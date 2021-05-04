from flask import Flask, jsonify, request, make_response, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, Date
import os
import datetime
from flask_marshmallow import Marshmallow
import pandas as pd

"""App Config"""

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'rides.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

"""App Database"""

@app.cli.command('db_create')
def db_create():
    db.create_all()
    print('Databases created')

@app.cli.command('db_drop')
def db_drop():
    db.drop_all()
    print('Databases dropped')

# @app.cli.command('db_seed')
# def db_seed():
#     jon = Order(purchaser = "Jon",
#                 date = datetime.date(2020, 3, 20),
#                 merchant = 'Fareway',
#                 denomination = 5,
#                 quantity = 10,
#                 amount = 10*5,
#                 discretion = 10*5*0.01,
#                 target = "Student Eric",
#                 order = 1)

#     hiep = Order(purchaser = "Hiep",
#                 date = datetime.date(2021, 4, 14),
#                 merchant = 'Casey',
#                 denomination = 10,
#                 quantity = 15,
#                 amount = 10*15,
#                 discretion = 10*15*0.01,
#                 target = "General Fund",
#                 order = 2)

#     db.session.add(jon)
#     db.session.add(hiep)
#     db.session.commit()
#     print('Databases seeded')

"""Database Models"""

class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key = True)
    name = Column(String)
    gender = Column(String)
    phone = Column(Integer)
    email = Column(String, unique=True)

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'gender', 'phone', 'email')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

if __name__ == "__main__":
    app.run()