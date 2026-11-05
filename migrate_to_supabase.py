"""
Merdiye Hocam LGS Platformu - Supabase Veri Göçü (Migration) Aracı
Kurallar: Axiom Zero Bloat (Yalnızca Python Standart Kütüphanesi: urllib, json, os, sys)
İşlev: Yerel JSON dosyalarındaki verileri (PDF kataloğu, veli başvuruları, yayınlanan videolar)
doğrudan Supabase PostgREST API uç noktalarına aktarır (Upsert / Insert).
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.parse
from pathlib import Path

WEBSITE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = WEBSITE_DIR.parent
STORAGE_DIR = PROJECT_ROOT / "storage"
PDFS_JSON_FILE = WEBSITE_DIR / "assets" / "data" / "pdfs.json"
INQUIRIES_FILE = STORAGE_DIR / "inquiries.json"
POSTS_FILE = STORAGE_DIR / "published_posts.json"


def _read_json(file_path: Path, default):
    if not file_path.exists():
        return default
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[UYARI] {file_path.name} okunamadı: {e}")
        return default


def _supabase_request(url: str, anon_key: str, endpoint: str, data: list, method: str = "POST"):
    """Standart kütüphane ile Supabase PostgREST API isteği atar."""
    target_url = f"{url.rstrip('/')}/rest/v1/{endpoint}"
    headers = {
        "apikey": anon_key,
        "Authorization": f"Bearer {anon_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation"
    }

    body_bytes = json.dumps(data, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(target_url, data=body_bytes, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            resp_body = resp.read().decode("utf-8")
            return {"status": resp.status, "data": json.loads(resp_body) if resp_body else []}
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8") if e.fp else str(e)
        return {"status": e.code, "error": err_msg}
    except Exception as e:
        return {"status": 500, "error": str(e)}


def migrate_all(supabase_url: str, supabase_key: str):
    print("=" * 70)
    print("MERDİYE HOCAM - SUPABASE BULUT VERİTABANI GÖÇ ARACI")
    print("=" * 70)
    print(f"Hedef Supabase URL : {supabase_url}")
    print(f"API Anahtarı       : {supabase_key[:8]}...{supabase_key[-6:]}")
    print("-" * 70)

    # 1. PDF Kataloğu Göçü
    pdfs = _read_json(PDFS_JSON_FILE, [])
    print(f"[*] {len(pdfs)} adet PDF föyü taranıyor...")
    pdf_rows = []
    for p in pdfs:
        pdf_rows.append({
            "id": p.get("id"),
            "unit": p.get("unit", "8. Sınıf"),
            "term": p.get("term", "Genel"),
            "category": p.get("category", "term1"),
            "title": p.get("title"),
            "subtitle": p.get("subtitle", ""),
            "difficulty": p.get("difficulty", "LGS Ayarı"),
            "filename": p.get("filename"),
            "file_url": p.get("file_url", f"assets/pdf/{p.get('filename')}"),
            "file_size": p.get("file_size", "105 KB"),
            "pages": p.get("pages", "1 Sayfa"),
            "badge": p.get("badge", "MEB Kazanım Uyumlu"),
            "popular": bool(p.get("popular", False)),
            "topics": p.get("topics", [p.get("title")])
        })

    if pdf_rows:
        res = _supabase_request(supabase_url, supabase_key, "mh_pdfs", pdf_rows)
        if "error" in res:
            print(f"[-] mh_pdfs yüklenirken hata oluştu ({res['status']}): {res['error']}")
        else:
            print(f"[+] mh_pdfs tablosuna {len(pdf_rows)} föy başarıyla aktarıldı!")
    else:
        print("[!] Aktarılacak PDF föyü bulunamadı.")

    # 2. Özel Ders Başvuruları (Leads / Inquiries) Göçü
    leads = _read_json(INQUIRIES_FILE, [])
    print(f"[*] {len(leads)} adet özel ders başvurusu taranıyor...")
    lead_rows = []
    for l in leads:
        lead_rows.append({
            "name": l.get("name", "İsimsiz"),
            "phone": l.get("phone", ""),
            "role": l.get("role", "Öğrenci"),
            "city": l.get("city", ""),
            "current_net": l.get("current_net", ""),
            "target_school": l.get("target_school", ""),
            "notes": l.get("notes", ""),
            "admin_notes": l.get("admin_notes", ""),
            "status": l.get("status", "Yeni")
        })

    if lead_rows:
        res = _supabase_request(supabase_url, supabase_key, "mh_leads", lead_rows)
        if "error" in res:
            print(f"[-] mh_leads yüklenirken hata oluştu ({res['status']}): {res['error']}")
        else:
            print(f"[+] mh_leads tablosuna {len(lead_rows)} başvuru başarıyla aktarıldı!")
    else:
        print("[!] Aktarılacak başvuru kaydı bulunamadı.")

    # 3. Yayınlanan Gönderiler (Published Posts) Göçü
    posts = _read_json(POSTS_FILE, [])
    print(f"[*] {len(posts)} adet sosyal medya gönderisi taranıyor...")
    post_rows = []
    for po in posts:
        post_rows.append({
            "id": po.get("id", f"post_{int(po.get('timestamp', 0))}"),
            "title": po.get("title", ""),
            "description": po.get("description", ""),
            "platforms": po.get("platforms", []),
            "video_url": po.get("video_url", ""),
            "privacy": po.get("privacy", "public"),
            "results": po.get("results", {})
        })

    if post_rows:
        res = _supabase_request(supabase_url, supabase_key, "mh_posts", post_rows)
        if "error" in res:
            print(f"[-] mh_posts yüklenirken hata oluştu ({res['status']}): {res['error']}")
        else:
            print(f"[+] mh_posts tablosuna {len(post_rows)} gönderi başarıyla aktarıldı!")

    print("-" * 70)
    print("[MİGRASYON TAMAMLANDI] Supabase bulut veritabanı senkronizasyonu bitti.")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(description="Merdiye Hocam Supabase Veri Göç Betiği")
    parser.add_argument("--url", default=os.getenv("SUPABASE_URL"), help="Supabase Proje URL")
    parser.add_argument("--key", default=os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_ANON_KEY"), help="Supabase Anon/Public Key")

    args = parser.parse_args()

    url = args.url or ""
    key = args.key or ""

    if not url or not key:
        print("[HATA] Lütfen Supabase URL ve Key belirtiniz!")
        print("Örnek: python website/migrate_to_supabase.py --url https://xyz.supabase.co --key eyJhbGci...")
        sys.exit(1)

    migrate_all(url, key)


if __name__ == "__main__":
    main()
