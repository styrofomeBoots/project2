# flask application to serve data between DB 
# and web page
from flask import Flask, jsonify, render_template
import pandas as pd 
import sqlite3
import sys
from collections import defaultdict

app = Flask(__name__)


#################################################
# Database Setup
#################################################

# cache was stopping javascript from refreshing
# remove before pushing to heroku
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


#  initial loading route
@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")




#  API route for Gender Age Graph
@app.route("/age/<gender>")
def age(gender):
    con = sqlite3.connect('db/olympic_data.db')

    sql = f"""
        SELECT * FROM yearAge{gender[0]};
        """
    yearAvgM = pd.read_sql(sql, con)

    query_dict = defaultdict(list)

    for index, row in yearAvgM.iterrows():
        query_dict[row["Year"]].append(row["Age"])
    
    clean_dict = dict(query_dict)
    clean_list = [{k:v} for k, v in clean_dict.items()]

    return jsonify(clean_list)




if __name__ == "__main__":
    app.run(debug=True)
