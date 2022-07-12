from functools import wraps
import pymongo
import os
import bcrypt
import simplejson as json
from flask import Flask, render_template, send_from_directory, \
    request, session, redirect, flash, jsonify
from attendant import ParkingLot
from map_my_india import geocode

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
# CORS(app)
a = os.environ.get("MONGO_URI")
b = os.environ.get("FLASK_SECRET_KEY")
mongo = pymongo.MongoClient(a)
app.secret_key = b
TOKEN = '282cf477-f3b8-400f-918b-183fb2c54b8a'
objectEndpoint = ''

s_lat = ''
s_lon = ''
e_lon = ''
e_lat = ''
p_name = ''
p_available_spaces = 1
p_cost_per_hour = 1


def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'username' in session:
            return f(*args, **kwargs)
        else:
            flash("Login First!")
            return(redirect("/operator/login"))
    return wrap


@app.route('/secret')
@login_required
def secret():
    return session['username']


@app.route('/operator/signup', methods=['GET', 'POST'])
def operator_signup():
    '''Parking Interface'''
    if request.method == 'GET':
        return render_template('parkmycar.html')
    else:
        print("ENTERING THE ONE")
        username = request.form["username"]
        password = request.form["password"]
        address = request.form["address"]
        cost_per_hour = request.form["cost_per_hour"]
        total_capacity = request.form["capacity"]
        users = mongo.parking.lot
        print(users)
        existing_user = users.find_one({'username': username})
        if existing_user is None:
            hashpass = bcrypt.hashpw(
                password.encode('utf-8'), bcrypt.gensalt())
            session['username'] = username
        else:
            "User already Exists"
            return redirect('/operator/signup')
        print("done")

        coordinates = geocode(address, token=TOKEN)
        latitude = coordinates[0]
        longitude = coordinates[1]
        operator = ParkingLot(username, latitude,
                              longitude, total_capacity, cost_per_hour)
        # print(operator)
        print('================================================')
        users.insert(
            {'username': username, 'password': hashpass, 'latitude': latitude,
             'longitude': longitude, 'totalSpace': int(total_capacity),
             'available_space': int(total_capacity),
             'cost_per_hour': cost_per_hour, 'address': address})

        global objectEndpoint
        objectEndpoint = json.dumps(operator.__dict__)
        print(objectEndpoint)
        # return objectEndpoint
        return redirect('/operator/dashboard')


@app.route('/operator/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        username = request.form["username"]
        password = request.form["password"]
        users = mongo.parking.lot
        login_user = users.find_one({"username": username})

        if login_user:
            orig_pass = login_user['password']
            if bcrypt.hashpw(password.encode('utf-8'), orig_pass) == orig_pass:
                session['username'] = username
                return redirect('/operator/dashboard')
            return "Invalid username/password combination"
        return "invalid username"


@app.route('/public')
def public():  # name, available_spaces, cost_per_hour):
    # global p_name
    # global p_available_spaces
    # global p_cost_per_hour

    # name=name, available_spaces=available_spaces,cost_per_hour=cost_per_hour)
    return render_template('public.html')


@app.route('/booklater', methods=['GET', 'POST'])
def mridul_a():
    if request.method == 'POST':
        a = request.get_data()
        a = str(a)[2:-1]
        a = (json.loads(a))
        print(a)
        global p_name
        global p_available_spaces
        global p_cost_per_hour

        s_lat = a['current_latitude']
        s_lon = a['current_longitude']
        e_lat = a['latitude']
        e_lon = a['longitude']
        print(e_lon)
        return "ok"


@app.route('/list')
def list():
    json_list = []
    users = mongo.parking.lot
    a = users.find({})

    for doc in a:
        # print(type(doc))
        del doc['_id']
        del doc['password']
        json_list.append(doc)

        # print(doc)
    # print(json_list)
    return jsonify(json_list), {'Access-Control-Allow-Origin': '*'}
    # print(a)


@app.route('/')
def index():
    '''Returns the homepage'''
    return render_template('index.html')


@app.route('/assets/<path:path>')
def css(path):
    '''Serve static content for the homepage'''
    return send_from_directory('assets', path)


@app.route('/route')
def route_temp():  # (s_lat=s_lat, s_lon=s_lon, e_lat=e_lat, e_lon=e_lon):
    global s_lat
    global s_lon
    global e_lon
    global e_lat
    return render_template('routing.html', s_lat=s_lat,
                           s_lon=s_lon, e_lat=e_lat, e_lon=e_lon)


@app.route('/form-booking')
def form_booking():
    global name
    global available_spaces
    global cost_per_hour

    return render_template('bookingForm.html')


@app.route('/coordinates', methods=['POST', 'GET'])
def coordinates():
    if request.method == 'POST':
        print('post request')
        a = request.get_data()
        a = str(a)[2:-1]
        a = (json.loads(a))
        print(a)
        global s_lat
        global s_lon
        global e_lon
        global e_lat

        s_lat = a['current_latitude']
        s_lon = a['current_longitude']
        e_lat = a['latitude']
        e_lon = a['longitude']
        print(e_lon)
        return "ok"


@app.route('/logout')
@login_required
def logout():
    session.clear()
    flash("Successfully Logged out")
    return redirect('/')


@app.errorhandler(500)
def syserror(e):
    return render_template("404.html", error='500'), 500


@app.errorhandler(404)
def not_found(e):
    return render_template("404.html", error='404'), 404


@app.route('/operator/dashboard')
@login_required
def dashboard(available_spaces=100, total_space=110):
    users = mongo.parking.lot
    user = session['username']
    a = users.find_one({"username": user})
    return render_template('dashboard.html',
                           available_spaces=a['available_space'],
                           total_space=a['totalSpace'])


@app.route('/operator/add', methods=['POST'])
def space_add():
    users = mongo.parking.lot
    user = session['username']
    a = users.find_one({"username": user})
    users.update(
        {"username": user},
        {"$inc": {'available_space': 1}}
    )
    return "ok"


@app.route('/operator/subtract', methods=['POST'])
def space_minus():
    users = mongo.parking.lot
    user = session['username']
    a = users.find_one({"username": user})
    users.update(
        {"username": user},
        {"$inc": {'available_space': -1}}
    )
    return "ok"


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', threaded=True)
