import warnings
warnings.filterwarnings('ignore')
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, inspect, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import psycopg2
from bs4 import BeautifulSoup
import pandas as pd
import requests

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "postgres:2311@127.0.0.1:63159/EPL9219"
engine = create_engine(f'postgresql://{app.config["SQLALCHEMY_DATABASE_URI"]}', echo=False)

inspector = inspect(engine)
inspector.get_table_names()

Base = automap_base()
Base.prepare(engine, reflect=True)
alls = Base.classes.alls


@app.route('/Season/<season>')
def getseason(season):
    session = Session(engine)
    results = session.query(alls.Team, alls.GP, alls.W, alls.L, alls.D, alls.GF, alls.GA, alls.Dif, alls.P, alls.Season, alls.Standing)\
        .filter(alls.Season == season)\
        .order_by(alls.Standing.desc())\
        .all()
    
    session.close()

    alls_info = []
    for Team, GP, W, L, D, GF, GA, Dif, P, Season, Standing in results:
        alls_dict = {}
        alls_dict["Team"] = Team
        alls_dict["GP"] = GP
        alls_dict["W"] = W 
        alls_dict["D"] = D
        alls_dict["GF"] = GF
        alls_dict["GA"] = GA
        alls_dict["L"] = L
        alls_dict["Dif"] = Dif
        alls_dict["P"] = P
        alls_dict["Season"] = Season
        alls_dict["Standing"] = Standing
        alls_info.append(alls_dict)

    return jsonify(alls_info)

if __name__ == '__main__':
    app.run(debug=True)