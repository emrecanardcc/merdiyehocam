"""
Lightweight Python HTTP Server for Merdiye Hocam Website.
Handles static file serving (HTML, CSS, JS, PDF, SVG) and contact API requests.
Zero external bloat: uses standard library http.server.
"""
import os
import sys
import json
import mimetypes
from datetime import datetime
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    try:
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

WEBSITE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = WEBSITE_DIR.parent
STORAGE_DIR = PROJECT_ROOT / "storage"
INQUIRIES_FILE = STORAGE_DIR / "inquiries.json"

# Ensure mimetypes are properly configured
mimetypes.add_type("application/pdf", ".pdf")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("application/json", ".json")

class MerdiyeHocamRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEBSITE_DIR), **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path

        if clean_path == "/api/pdfs":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            data_file = WEBSITE_DIR / "assets" / "data" / "pdfs.json"
            if data_file.exists():
                with open(data_file, "rb") as f:
                    self.wfile.write(f.read())
            else:
                self.wfile.write(b"[]")
            return

        # Default static file handling
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path

        if clean_path == "/api/contact":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_length).decode("utf-8")
                payload = json.loads(body)

                name = str(payload.get("name", "")).strip()[:100]
                phone = str(payload.get("phone", "")).strip()[:30]
                role = str(payload.get("role", "Öğrenci")).strip()[:30]
                city = str(payload.get("city", "")).strip()[:100]
                current_net = str(payload.get("currentNet", "")).strip()[:50]
                target_school = str(payload.get("targetSchool", "")).strip()[:100]
                notes = str(payload.get("notes", "")).strip()[:500]

                if not name or not phone:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "İsim ve telefon zorunludur"}).encode("utf-8"))
                    return

                lead_record = {
                    "id": f"lead_{int(datetime.now().timestamp() * 1000)}",
                    "timestamp": datetime.now().isoformat(),
                    "name": name,
                    "phone": phone,
                    "role": role,
                    "city": city,
                    "current_net": current_net,
                    "target_school": target_school,
                    "notes": notes
                }

                STORAGE_DIR.mkdir(parents=True, exist_ok=True)
                existing_leads = []
                if INQUIRIES_FILE.exists():
                    try:
                        with open(INQUIRIES_FILE, "r", encoding="utf-8") as f:
                            existing_leads = json.load(f)
                    except Exception:
                        existing_leads = []

                existing_leads.append(lead_record)
                with open(INQUIRIES_FILE, "w", encoding="utf-8") as f:
                    json.dump(existing_leads, f, ensure_ascii=False, indent=2)

                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "success",
                    "message": "Özel ders talebiniz başarıyla kaydedildi.",
                    "lead_id": lead_record["id"]
                }).encode("utf-8"))
                return

            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
                return

        self.send_response(404)
        self.end_headers()

def run_server(port=8080):
    server_address = ("127.0.0.1", port)
    httpd = HTTPServer(server_address, MerdiyeHocamRequestHandler)
    print(f"🚀 Merdiye Hocam Web Sunucusu Başlatıldı: http://localhost:{port}/")
    print(f"📁 Kök Dizin: {WEBSITE_DIR}")
    print("Durdurmak için Ctrl+C tuşlarına basın.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nSunucu kapatıldı.")
        httpd.server_close()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    run_server(port)
