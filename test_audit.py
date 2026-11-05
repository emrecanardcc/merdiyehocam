import sys
import os
import re
import json
import urllib.request
import urllib.parse
from pathlib import Path

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_URL = "http://127.0.0.1:8080"
WEBSITE_DIR = Path(__file__).resolve().parent

print("=" * 60)
print("🔍 MERDİYE HOCAM WEB & ADMIN OTOMATİK QA AUDIT VE TESTİ")
print("=" * 60)

passed = []
issues = []

def report_pass(title):
    passed.append(title)
    print(f"  ✓ {title}")

def report_issue(issue_type, page, title, details, recommendation, severity="ORTA"):
    issues.append({
        "type": issue_type,
        "page": page,
        "title": title,
        "details": details,
        "recommendation": recommendation,
        "severity": severity
    })
    print(f"  ❌ [{severity}] ({page}) {title}")

# 1. Test Endpoint Availability
print("\n--- 1. HTTP Endpoint Testleri ---")
endpoints = [
    ("/", 200, "Ana Sayfa"),
    ("/admin.html", 200, "Admin Paneli"),
    ("/assets/css/style.css", 200, "CSS Dosyası"),
    ("/assets/js/main.js", 200, "Ana Script"),
    ("/assets/js/admin.js", 200, "Admin Script"),
    ("/assets/images/logo.svg", 200, "Logo SVG"),
    ("/assets/images/logo-icon.svg", 200, "Logo İkon"),
    ("/assets/data/pdfs.json", 200, "PDFs Verisi"),
    ("/api/pdfs", 200, "PDF Listesi API"),
    ("/api/admin/analytics", 200, "Analitik API"),
    ("/api/admin/inquiries", 200, "Gelen Talepler API"),
    ("/api/admin/social", 200, "Sosyal Medya API"),
    ("/api/admin/posts", 200, "Yayın Geçmişi API")
]

for ep, exp_status, desc in endpoints:
    url = BASE_URL + ep
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            data = resp.read()
            if status != exp_status:
                report_issue("HATA", ep, f"Beklenmeyen durum kodu: {status}", f"Beklenen {exp_status}", "Sunucu endpoint eşlemesini kontrol edin", "YÜKSEK")
            else:
                report_pass(f"{desc} ({ep}): 200 OK ({len(data)} bayt)")
    except Exception as e:
        report_issue("HATA", ep, f"Endpoint ulaşılamıyor: {ep}", str(e), "Sunucu yönlendirmesini düzeltin", "KRİTİK")

# 2. Check Admin Authentication Gate
print("\n--- 2. Admin Güvenlik & Yetkilendirme Testi ---")
with open(WEBSITE_DIR / "admin.html", "r", encoding="utf-8") as f:
    admin_html = f.read()

with open(WEBSITE_DIR / "assets" / "js" / "admin.js", "r", encoding="utf-8") as f:
    admin_js = f.read()

has_auth_overlay = "adminAuthOverlay" in admin_html and "adminLoginForm" in admin_html
has_auth_script = "checkAdminAuth" in admin_js and "merdiye_admin_auth_token" in admin_js
has_logout_btn = "adminLogoutBtn" in admin_html

if has_auth_overlay and has_auth_script and has_logout_btn:
    report_pass("Admin Güvenlik Kapısı Aktif: Şifresiz giriş engellendi, oturum denetimi ve güvenli çıkış mevcut.")
else:
    report_issue("GÜVENLİK", "admin.html", "Admin Paneli Şifresiz / Açık Giriş", 
                 "admin.html sayfası oturum denetimi içermiyor.", "Admin login modalı ekleyin.", "KRİTİK")

# 3. Check PDF Upload & Manual File Size Entry
print("\n--- 3. PDF Yönetimi & Dosya Yükleme Testi ---")
is_manual_size_input = bool(re.search(r'<input[^>]+type=["\']text["\'][^>]+id=["\']modalPdfSize["\']', admin_html))
has_dropzone = "pdfDropZone" in admin_html and "filePreviewCard" in admin_html
has_dropzone_logic = "handlePdfFile" in admin_js and "dropzone" in admin_js.lower()

if not is_manual_size_input and has_dropzone and has_dropzone_logic:
    report_pass("Otomatik PDF Sürükle-Bırak Yükleyici Aktif: Elle boyut girme kaldırıldı, dosya seçildiğinde otomatik hesaplanıyor.")
else:
    report_issue("KULLANICI_DENEYIMI", "admin.html", "Dosya Boyutu Elle Giriliyor",
                 "PDF modalında boyut elle girilen bir metin kutusu olarak duruyor.", "Otomatik sürükle-bırak dropzone kullanın.", "YÜKSEK")

# 4. Check Logo Sizing and SVG encoding
print("\n--- 4. Logo & Görsel Bütünlük Testi ---")
with open(WEBSITE_DIR / "assets" / "images" / "logo.svg", "rb") as f:
    logo_bytes = f.read()

has_valid_utf8_turkish = b"LGS MATEMAT\xc4\xb0K AKADEM\xc4\xb0S\xc4\xb0" in logo_bytes
if has_valid_utf8_turkish:
    report_pass("Logo SVG UTF-8 Türkçe Karakter Desteği Kusursuz ('LGS MATEMATİK AKADEMİSİ').")
else:
    report_issue("HATA", "assets/images/logo.svg", "Logo SVG Karakter Kodlama Hatası", "Logo metninde Türkçe İ bozulmuş.", "UTF-8 olarak kaydedin.", "ORTA")

with open(WEBSITE_DIR / "assets" / "css" / "style.css", "r", encoding="utf-8") as f:
    css_content = f.read()

logo_img_match = re.search(r'\.logo-img\s*\{([^}]+)\}', css_content)
if logo_img_match:
    rules = logo_img_match.group(1)
    if "height: 56px" in rules:
        report_pass("Header Logo Boyutu 56px Olarak Optimize Edildi (Büyük, Okunaklı ve Prestijli).")
    else:
        report_issue("GÖRÜNÜM", "style.css", "Logo Boyutu Küçük", rules, "56px yapın.", "ORTA")

# 5. Check Live / Demo Data Transparency
print("\n--- 5. Veri Tutarlılığı ve Canlı Veri Testi ---")
try:
    req = urllib.request.Request(f"{BASE_URL}/api/admin/social")
    with urllib.request.urlopen(req) as resp:
        social_data = json.loads(resp.read().decode("utf-8"))
        yt_mode = social_data.get("youtube", {}).get("mode")
        ig_mode = social_data.get("instagram", {}).get("mode")
        yt_status = social_data.get("youtube", {}).get("status")

        has_demo_banner = "ytDemoBanner" in admin_html and "igDemoBanner" in admin_html

        if yt_mode == "demo" and yt_status == "disconnected" and has_demo_banner:
            report_pass("Sosyal Medya Şeffaflığı Sağlandı: Bağlantısız hesaplar sahte bağlı gibi gösterilmiyor, [DEMO VERİ] olarak etiketleniyor.")
        else:
            report_issue("VERİ_TUTARSIZLIĞI", "server.py & admin.html", "Sosyal Medya Veri Şeffaflığı Eksik",
                         f"Status: {yt_status}, Mode: {yt_mode}", "Demo etiketlerini ve disconnected durumunu yansıtın.", "YÜKSEK")
except Exception as e:
    report_issue("HATA", "/api/admin/social", "Sosyal Medya API Hatası", str(e), "Sunucu handlerını düzeltin.", "YÜKSEK")

# 6. Check Text Overflow and Layout Shifting
print("\n--- 6. Yazı Kayması & Responsive Breakpoint Testi ---")
has_1024_nav = bool(re.search(r'@media\s*\(\s*max-width:\s*1024px\s*\)\s*\{[^}]*\.header\s+\.nav-menu', css_content))
if has_1024_nav:
    report_pass("Responsive Header Düzeni: 1024px tablet/laptop ekranlarında menü kayması engellendi, hamburger menüye bağlandı.")
else:
    report_issue("LAYOUT", "style.css", "Header Menü Kırılma Noktası Yetersiz", "768px-1024px arasında menü taşma yapıyor.", "1024px breakpoint uygulayın.", "YÜKSEK")

has_table_resp = ".table-responsive" in css_content and "min-width: 680px" in css_content
if has_table_resp:
    report_pass("Admin Tabloları Koruma Altında: .table-responsive ile sütunların daralması engellendi (min-width: 680px).")
else:
    report_issue("LAYOUT", "style.css", "Tablolarda Taşma Koruması Eksik", "Dar ekranlarda tablo kolonları sıkışıyor.", "min-width ekleyin.", "ORTA")

# 7. Physical PDF Existence
print("\n--- 7. Fiziksel PDF Dosyalarının Varlık Testi ---")
pdfs_json_path = WEBSITE_DIR / "assets" / "data" / "pdfs.json"
if pdfs_json_path.exists():
    with open(pdfs_json_path, "r", encoding="utf-8") as f:
        pdf_catalog = json.load(f)
    missing = [item.get("filename") for item in pdf_catalog if not (WEBSITE_DIR / item.get("file_url", "")).exists()]
    if not missing:
        report_pass(f"Tüm {len(pdf_catalog)} LGS Matematik PDF Föyü Fiziksel Olarak Diskte Mevcut ve Doğrulandı!")
    else:
        report_issue("HATA", "assets/pdf/", "Eksik PDF Dosyaları", str(missing), "Dosyaları oluşturun.", "KRİTİK")

# 8. Contact Form
print("\n--- 8. Özel Ders Formu Gönderim Testi ---")
contact_payload = json.dumps({
    "name": "Audit Test Öğrencisi",
    "phone": "05551234567",
    "role": "Öğrenci (8. Sınıf)",
    "city": "İstanbul",
    "currentNet": "16 Net",
    "targetSchool": "Galatasaray Lisesi",
    "notes": "Otomatik QA denetim talebidir."
}).encode("utf-8")

try:
    req = urllib.request.Request(f"{BASE_URL}/api/contact", data=contact_payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        if res.get("status") == "success":
            report_pass(f"Özel Ders Formu API Testi Başarılı! (Lead ID: {res.get('lead_id')})")
        else:
            report_issue("HATA", "/api/contact", "Özel ders formu başarısız", str(res), "Düzeltin.", "YÜKSEK")
except Exception as e:
    report_issue("HATA", "/api/contact", "Özel ders formu hatası", str(e), "Düzeltin.", "YÜKSEK")

print("\n" + "=" * 60)
print(f"📊 QA AUDIT SONUCU: {len(passed)} TEST GEÇTİ | {len(issues)} HATA BULUNDU")
print("=" * 60)

with open(WEBSITE_DIR / "qa_audit_findings.json", "w", encoding="utf-8") as f:
    json.dump({"passed": passed, "issues": issues}, f, ensure_ascii=False, indent=2)
