#!/usr/bin/env python3
from flask import jsonify, request, Response
from config import app, db, user_schema, users_schema, User
from flask_cors import CORS, cross_origin
import datetime
import json
from sqlalchemy.sql import func
import requests
from bs4 import BeautifulSoup
from flask_jwt_extended import JWTManager, jwt_required, create_access_token

CORS(app, support_credentials=True)
GENRE_URL = "https://myanimelist.net/anime.php"

@app.route('/')
@cross_origin(supports_credentials=True)
def hello():
    return jsonify(message="hello there im anime app")

# @app.route('/users')
# def users():
#     users_list = User.query.all()
#     result = users_schema.dumps(users_list)
#     return result

@app.route('/user/<email>', methods=['GET'])
@cross_origin(supports_credentials=True)
@jwt_required()
def user_detail(email: str):
    user = User.query.filter_by(email=email).first()
    if user:
        result = user_schema.dump(user)
        return result
    else:
        return jsonify(message="That user does not exist"), 404

@app.route('/update_preference/<email>/<anime_id>/<choice>', methods=['PUT'])
@cross_origin(supports_credentials=True)
@jwt_required()
def update_preference(email, anime_id, choice):
    print(choice)
    user = User.query.filter_by(email=email).first()
    if user:
        pref = {
            'watching' : user.watching.split(', '),
            'watched' : user.watched.split(', '),
            'like' : user.like.split(', '),
        }

        if choice == 'watching':
            if anime_id not in pref['watching']:
                pref['watching'].append(anime_id)
            if anime_id in pref['watched']:
                pref['watched'].remove(anime_id)
        elif choice == "watched":
            if anime_id not in pref['watched']:
                pref['watched'].append(anime_id)
            if anime_id in pref['watching']:
                pref['watching'].remove(anime_id)
        elif choice == "like" :
            if anime_id in pref['like']:
                pref['like'].remove(anime_id)
            else:
                pref['like'].append(anime_id)

        user.watching = ', '.join(pref['watching'])
        user.watched = ', '.join(pref['watched'])
        user.like = ', '.join(pref['like'])
        
        db.session.commit()
        print(user.watched)
        res = Response(json.dumps({"message": "You updated your preference", 'watching': user.watching, 'watched':user.watched, 'like':user.like})) 
        res.headers["Access-Control-Allow-Origin"] = "*"
        res.headers["Content-Type"] = "application/json"
        return res
    else:
        res = Response(json.dumps({"message": "That user does not exist"}))
        res.headers["Access-Control-Allow-Origin"] = "*"
        res.headers["Content-Type"] = "application/json"
        return res


@app.route('/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    email = request.form['email']
    test = User.query.filter_by(email=email).first()
    if test:
        return jsonify(message='That email already exists'), 409
    else:
        name = request.form['name']
        gender = request.form['gender']
        password = request.form['password']
        user = User(email=email, name=name, gender=gender, password=password, watching='', watched='', like='')
        db.session.add(user)
        db.session.commit()
        res = Response(json.dumps({"message": "User Created Successfully"}))
        res.headers["Access-Control-Allow-Origin"] = "*"
        res.headers["Content-Type"] = "application/json"
        return res

@app.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    if request.is_json:
        email = request.json['email']
        password = request.json['password']
    else:
        email = request.form['email']
        password = request.form['password']
    test = User.query.filter_by(email=email, password=password).first()
    if test:
        access_token = create_access_token(identity=email)
        res = Response(json.dumps({"message": "Login Successful", "access_token": access_token}))
        res.headers["Access-Control-Allow-Origin"] = "*"
        res.headers["Content-Type"] = "application/json"
        return res
    else:
        res = Response(json.dumps({"message": "Bad Email or Password"}))
        res.headers["Access-Control-Allow-Origin"] = "*"
        res.headers["Content-Type"] = "application/json"
        return res

@app.route('/genres')
@cross_origin(supports_credentials=True)
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
    res = Response(json.dumps({"genres": genres}))
    res.headers["Access-Control-Allow-Origin"] = "*"
    res.headers["Content-Type"] = "application/json"
    return res

@app.route('/episodes', methods=['POST'])
@cross_origin(supports_credentials=True)
def episodes():
    content = request.json
    epurl = content['anime_url']
    epnum = content['ep']

    code = requests.get(epurl+'/episode/'+str(epnum))
    plain = code.text
    s = BeautifulSoup(plain, "html.parser")
    link = s.find('iframe')['src']

    return link