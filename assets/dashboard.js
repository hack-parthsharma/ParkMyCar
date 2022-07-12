var add = document.querySelector('#add');
var subtract = document.querySelector('#subtract');
var number = document.querySelector('#number');
var number2 = document.querySelector('#number').innerText;
var total = document.querySelector('#total').innerText;
var number1 = parseInt(number2, 10);

add.addEventListener('click', function() {
  if (number1 < parseInt(total, 10)) {
    number1 = number1 + 1;
    number.textContent = number1;
    add.style.background = 'yellow';
    subtract.style.background = 'white';

    var Url = 'https://ms.goyal.club/operator/add';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', Url, true);
    xhr.send('hello');
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log('Done');
      }
    }
  }
});

subtract.addEventListener('click', function() {
  if (number1 >= 0) {
    number1 = number1 - 1;
    number.textContent = number1;
    subtract.style.background = 'yellow';
    add.style.background = 'white';
    var Url = 'https://ms.goyal.club/operator/subtract';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', Url, true);
    xhr.send('OK');
    xhr.onreadystatechange = processRequest;
    function processRequest(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log('Done');
      }
    }
  }
});
