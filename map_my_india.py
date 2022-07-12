import requests
import os

TOKEN = os.environ.get("TOKEN")
OAUTH_API = "https://outpost.mapmyindia.com/api/security/oauth/token"
GEOCODEING_API = "https://atlas.mapmyindia.com/api/places/geocode"

client_id = os.environ.get("MAP_CLIENT_ID")
client_secret = os.environ.get("MAP_CLIENT_SECRET")


def request_token():
    # print("In REQ TOKEN")
    param = {"grant_type": "client_credentials"}
    oauth_data = {
        "client_id": client_id, "client_secret": client_secret
    }
    r = requests.post(url=OAUTH_API, data=oauth_data, params=param).json()
    return r['access_token']


def geocode(address, token):
    # print("In GEOCODE")
    param = {"address": address}
    header = {"Authorization": "bearer " + token}
    r = requests.get(url=GEOCODEING_API, params=param,
                     headers=header)

    if r.status_code != 200:
        # print("In IF")
        global TOKEN
        TOKEN = request_token()
        # print(TOKEN)
        ok = geocode(address, token=TOKEN)
        # print(ok)

    else:
        # print("In ELSE SUCCESS")
        r = r.json()
        latitude = r['copResults']['latitude']
        longitude = r['copResults']['longitude']
        print(latitude)
        print(longitude)
        coordinates = (latitude, longitude)
        print(coordinates)
        return coordinates


if __name__ == "__main__":
    r = geocode("G 27 Ground Floor, Kalkaji 110019", token=TOKEN)
    print(r)
