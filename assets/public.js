// const mainMap = document.querySelector('#mainMap');
// mainMap.style.height = '700px';
// /operatorl

// var scheduled = document.querySelector('#scheduled');
// var reserved = document.querySelector('#reserved');
// scheduled.style.margin-top=reserved.style.margin-top+'px';

// var parkingLots =['aaa'];//= [[28.61, 77.23],[28.65, 77.19]];

console.log('script connected');

var HttpClient = function() {
  this.get = function(aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function() {
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) aCallback(anHttpRequest.responseText);
    };
    anHttpRequest.open('GET', aUrl, true);
    anHttpRequest.send(null);
  };
};

// var theurl = 'https://ms.goyal.club/list';
var theurl = 'https://ms.goyal.club/list';

var client = new HttpClient();
client.get(theurl, response => {
  // alert(window.parkingLots);
  var selectedObj = undefined;
  window.parkingLots = JSON.parse(response);
  // alert(parkingLots[0].latitude);
  // alert(window.parkingLots);
  var map = new MapmyIndia.Map('mainMap', { center: [28.61, 77.23], zoomControl: true, hybrid: true, search: true, location: true }); /*map initialized*/

  map.setZoom(12);
  for (var index = 0; index < parkingLots.length; index++) {
    var icon = L.divIcon({
      className: 'my-div-icon',
      html: "<img class='popper'  src=" + "'https://maps.mapmyindia.com/images/2.png'>" + '<span class="my-div-span">' + (index + 1) + '</span>',
      iconSize: [10, 10],
      popupAnchor: [12, -10]
    });
    // console.log(typeof parkingLots[index].latitude);
    var mk = addMarker({
      position: [parkingLots[index].latitude, parkingLots[index].longitude],
      title: parkingLots[index].address,
      draggable: false,
      icon: icon,
      obj: parkingLots[index]
    });
  }

  function test() {
    document.getElementById('test').innerHTML = console.log(response);
  }
  function create_content(title, content) {
    var h = new Array();
    h.push('<div>');
    h.push('<div class="header">');
    h.push('<span>');
    h.push(title);
    h.push('</span> ');
    h.push('</div>');
    h.push('<div class="info_css">');
    h.push(content);
    h.push('</div>');
    h.push('</div>');
    return h.join('');
  }
  function addMarker(req) {
    console.log('I');
    var mk = new L.marker(req.position, {
      draggable: req.draggable,
      icon: req.icon,
      title: req.title
    });
    // mk.bindPopup(req.title);
    var content = create_content(req.obj.address, 'Available space: ' + req.obj.available_space + '<br>' + 'Cost/hr: ' + req.obj.cost_per_hour);
    mk.bindPopup(content);
    mk.on('click', () => {
      selectedObj = req.obj;
      mk.openPopup();
    });
    map.addLayer(mk);
    return mk;
  }

  // Geo-location
  getLocation();
  let current_latitude, current_longitude;

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }
  function showPosition(position) {
    current_latitude = position.coords.latitude;
    current_longitude = position.coords.longitude;
    console.log('Latitude: ' + position.coords.latitude + 'Longitude: ' + position.coords.longitude);
  }
  document.querySelector('#show-route').addEventListener('click', () => {
    if (selected == undefined) alert('Please select a pin');
    else {
      selectedObj['current_latitude'] = current_latitude;
      selectedObj['current_longitude'] = current_longitude;

      var x = selectedObj;
      console.log(selectedObj['current_latitude']);

      // x = JSON.parse(x);
      x = JSON.stringify(x);
      // var Url = "10.104.201.255:5000/coordinates"
      var Url = 'https://ms.goyal.club/coordinates';
      // var Url = 'localhost:5000/coordinates';
      var xhr = new XMLHttpRequest();
      xhr.open('POST', Url, true);
      xhr.send(x);
      xhr.onreadystatechange = processRequest;
      function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
          console.log('Done');
        }
      }
    }
  });
  // function showRouteOnClick() {
  //   console.log('CLICKED');

  //   var x = selectedObj;
  //   // var Url = "10.104.201.255:5000/coordinates"
  //   var Url = 'http://localhost:5000/coordinates';
  //   var xhr = new XMLHttpRequest();
  //   xhr.open('POST', Url, true);
  //   xhr.send(x);
  //   xhr.onreadystatechange = processRequest;
  //   function processRequest(e) {
  //     if (xhr.readyState == 4 && xhr.status == 200) {
  //       // alert(xhr.responseText.headers.Host);
  //       // var response1 = JSON.parse(xhr.responseText);
  //       // document.getElementById("origin").innerHTML = response1.origin;
  //       // document.getElementById("url").innerHTML = response1.url;
  //       // document.getElementById("data").innerHTML = response1.data;
  //       console.log('Done');
  //     }
  //   }
  // }

  // map.on("click", function (e) {
  //     var pt = e.latlng;
  //     document.getElementById('test').innerHTML = pt;
  //     var icon = L.divIcon({
  //         className: 'my-div-icon',
  //         // html:'<div class="popper">' + index+1 + '</div>',
  //         html: "<img class='popper'  src=" + "'https://maps.mapmyindia.com/images/2.png'>" + '<span class="my-div-span">' + (index + 1) + '</span>',
  //         iconSize: [2, 10],
  //         popupAnchor: [12, -10]
  //     });
  //     var mk = addMarker({
  //         position:pt,
  //         draggable:false,
  //         icon:icon,
  //         title:"Hi"
  //     });
  // });

  document.querySelector('#sbookLater').addEventListener('click', () => {
    selectedObj['current_latitude'] = current_latitude;
    selectedObj['current_longitude'] = current_longitude;

    var x = selectedObj;
    console.log(selectedObj['current_latitude']);

    // x = JSON.parse(x);
    x = JSON.stringify(x);
    // var Url = "10.104.201.255:5000/coordinates"
    var Url = 'https://ms.goyal.club/booklater';
    // var Url = 'localhost:5000/coordinates';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', Url, true);
    xhr.send(x);
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log('Done');
      }
    }
  });
});
