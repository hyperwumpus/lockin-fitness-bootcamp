"""Serve LOCK//IN and proxy barcode lookups to Open Food Facts.

Run: python3 server.py --host 127.0.0.1 --port 8080
For testing on a phone on the same Wi-Fi, use --host 0.0.0.0 and the
computer's local IP address. This server has no account or cloud storage.
"""
import argparse
import json
import os
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

APP_DIR = Path(__file__).resolve().parent / "app"
BARCODE = re.compile(r"^[0-9]{8,14}$")
FIELDS = "code,product_name,brands,quantity,serving_size,nutriments"
MAX_RESPONSE = 1_000_000


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(APP_DIR), **kwargs)

    def send_json(self, status, data):
        payload = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        if not self.path.startswith("/api/product/"):
            return super().do_GET()
        code = self.path.removeprefix("/api/product/")
        if not BARCODE.fullmatch(code):
            return self.send_json(400, {"error": "Enter an 8–14 digit barcode."})
        url = f"https://world.openfoodfacts.org/api/v2/product/{code}.json?fields={FIELDS}"
        contact = os.environ.get("LOCKIN_CONTACT", "local personal prototype")
        request = Request(url, headers={"User-Agent": f"LOCKIN/0.2 ({contact})"})
        try:
            with urlopen(request, timeout=12) as response:
                raw = response.read(MAX_RESPONSE + 1)
            if len(raw) > MAX_RESPONSE:
                raise ValueError("Oversized response")
            data = json.loads(raw)
        except (HTTPError, URLError, TimeoutError, ValueError, json.JSONDecodeError):
            return self.send_json(502, {"error": "Food lookup is unavailable. Try again or log food manually."})
        if data.get("status") != 1 or not isinstance(data.get("product"), dict):
            return self.send_json(404, {"error": "No food found for that barcode. You can add it manually."})
        product = data["product"]
        self.send_json(200, {
            "barcode": code,
            "name": product.get("product_name") or "Unnamed product",
            "brand": product.get("brands") or "",
            "servingSize": product.get("serving_size") or "",
            "nutriments": product.get("nutriments") or {},
        })


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="LOCK//IN local server")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8080)
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"LOCK//IN running at http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

