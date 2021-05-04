#!/usr/bin/env python3
from flask import jsonify, request
from config import app, db
from flask_cors import CORS
import datetime
from sqlalchemy.sql import func
import requests
from bs4 import BeautifulSoup

CORS(app)
GENRE_URL = "https://myanimelist.net/anime.php"

@app.route('/')
def hello():
    return jsonify(message="hello there")

@app.route('/genres')
def genres():
    genres = []
    resp = requests.get(GENRE_URL)
    if resp.status_code ==200:
        raw_html = resp.text
    else:
        raise ValueError("Could not Retrieve valid HTML")

    html = BeautifulSoup(raw_html, 'html.parser')
    for item in html.select('table.space_table tr td'):
        g = item.text
        g = g.replace('\n', '')
        genres.append(g)
    genres.sort()
    return jsonify(genres=genres)

@app.route('/episodes', methods=['POST'])
def episodes():
    content = request.json
    epurl = content['anime_url']
    epnum = content['ep']

    code = requests.get(epurl+'/episode/'+str(epnum))
    plain = code.text
    s = BeautifulSoup(plain, "html.parser")
    link = s.find('iframe')['src']

    return link