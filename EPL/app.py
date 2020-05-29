import warnings
warnings.filterwarnings('ignore')
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, inspect, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import psycopg2
import pandas as pd

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')
#engine = create_engine(f'postgresql://{app.config["SQLALCHEMY_DATABASE_URI"]}', echo=False)

db = SQLAlchemy(app)
#db.init_app(app)

class Alls(db.Model):
    __tablename__ = "alls"
    Team = db.Column(db.String(50), primary_key = True)
    GP = db.Column(db.Integer)
    W = db.Column(db.Integer) 
    D = db.Column(db.Integer)
    GF = db.Column(db.Integer)
    GA = db.Column(db.Integer)
    L = db.Column(db.Integer)
    Dif = db.Column(db.Integer)
    P = db.Column(db.Integer)
    Season = db.Column(db.String(10))
    Standing = db.Column(db.Integer)

##inspector = inspect(engine)
##inspector.get_table_names()

##Base = automap_base()
##Base.prepare(engine, reflect=True)
##alls = Base.classes.alls

@app.route("/")
def home():
    return render_template("index.html", file="1992-93")

@app.route('/<snumber>')
def getseason(snumber):
    results = Alls.query\
        .filter(Alls.Season == snumber)\
        .order_by(Alls.Standing)\
        .all()
    
    print(results)

    alls_info = []
    for r in results:
        alls_dict = {}
        alls_dict["Team"] = r.Team
        alls_dict["GP"] = r.GP
        alls_dict["W"] = r.W 
        alls_dict["D"] = r.D
        alls_dict["GF"] = r.GF
        alls_dict["GA"] = r.GA
        alls_dict["L"] = r.L
        alls_dict["Dif"] = r.Dif
        alls_dict["P"] = r.P
        alls_dict["Season"] = r.Season
        alls_dict["Standing"] = r.Standing
        alls_info.append(alls_dict)
    
    return jsonify(alls_info)

if __name__ == '__main__':
    app.run()