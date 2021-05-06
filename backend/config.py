from flask import Flask, jsonify, request, make_response, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, Date
import os
import datetime
from flask_marshmallow import Marshmallow
import pandas as pd
from flask_jwt_extended import JWTManager, jwt_required, create_access_token

"""App Config"""

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'animes.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'sfdsdfsdfsdfwefwefa'

db = SQLAlchemy(app)
ma = Marshmallow(app)
jwt = JWTManager(app)

"""App Database"""

@app.cli.command('db_create')
def db_create():
    db.create_all()
    print('Databases created')

@app.cli.command('db_drop')
def db_drop():
    db.drop_all()
    print('Databases dropped')

@app.cli.command('db_seed')
def db_seed():
    hiep = User(name = "Hiep",
                gender = "Male",
                email = "vohi01@luther.edu",
                password = "Bangfish0911",
                watching = '5114, 11061',
                watched = '28977',
                like = '36838, 2904'
                )

    db.session.add(hiep)
    db.session.commit()
    print('Databases seeded')

"""Database Models"""

class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key = True)
    name = Column(String)
    gender = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    watching = Column(String)
    watched = Column(String)
    like = Column(String)

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'gender', 'email', 'password', 'watching', 'watched', 'like')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

if __name__ == "__main__":
    app.run()