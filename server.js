var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
});

app.listen(8080);
console.log('Server cool!');

// http://localhost:8080/
