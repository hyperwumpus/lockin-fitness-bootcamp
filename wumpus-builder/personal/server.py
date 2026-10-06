"""Local Wumpus Builder server. No accounts, payments, or cloud persistence."""
import argparse
import json
import os
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

APP_DIR = Path(__file__).resolve().parent / 'app'
class Handler(SimpleHTTPRequestHandler):
    extensions_map={**SimpleHTTPRequestHandler.extensions_map,'.webmanifest':'application/manifest+json'}
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(APP_DIR),**kwargs)
    def list_directory(self,path):self.send_error(404,'Not found')
    def send_json(self,status,data):
        raw=json.dumps(data).encode();self.send_response(status)
        self.send_header('Content-Type','application/json; charset=utf-8')
        self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(raw)))
        self.end_headers();self.wfile.write(raw)
    def do_GET(self):
        if not self.path.startswith('/api/product/'):return super().do_GET()
        code=self.path.removeprefix('/api/product/')
        if not re.fullmatch(r'[0-9]{8,14}',code):return self.send_json(400,{'error':'Enter an 8–14 digit barcode.'})
        fields='code,product_name,brands,serving_size,nutriments'
        request=Request(f'https://world.openfoodfacts.org/api/v2/product/{code}.json?fields={fields}',headers={'User-Agent':'WumpusBuilder/1.0 ('+os.environ.get('BUILDER_CONTACT','local prototype')+')'})
        try:
            with urlopen(request,timeout=12) as response:raw=response.read(1_000_001)
            if len(raw)>1_000_000:raise ValueError('Oversized response')
            data=json.loads(raw)
        except (HTTPError,URLError,TimeoutError,ValueError):return self.send_json(502,{'error':'Food lookup unavailable. Enter the label manually.'})
        if data.get('status')!=1 or not isinstance(data.get('product'),dict):return self.send_json(404,{'error':'No food found. Enter the label manually.'})
        p=data['product'];return self.send_json(200,{'name':p.get('product_name') or 'Unnamed food','brand':p.get('brands') or '', 'servingSize':p.get('serving_size') or '', 'nutriments':p.get('nutriments') or {}})
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--host',default='127.0.0.1');parser.add_argument('--port',type=int,default=8081)
    args=parser.parse_args();server=ThreadingHTTPServer((args.host,args.port),Handler)
    print(f'Wumpus Builder: http://{args.host}:{args.port}',flush=True)
    try:server.serve_forever()
    except KeyboardInterrupt:pass
    finally:server.server_close()
