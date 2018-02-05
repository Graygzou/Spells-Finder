/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.0
 */

var http = require('http');
var fs = require('fs');
var express = require('express'),
    app = module.exports.app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(8080);  //listen on port 80

// Get our modules
var moncrawler = require('./crawlerModule');

// Let express know there's a public directory.
app.use(express.static('./public'));

// -------------------------------------
// Basic Routing
// -------------------------------------

// Index page
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
	fs.readFile('./views/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
		
		moncrawler.crawlerPage("http://www.d20pfsrd.com/magic/all-spells/a/acid-arrow");
    });
});

app.get('/Exercice1', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

app.get('/Exercice2', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    fs.readFile('../index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

// -------------------------------------
// Real-Time communications
// -------------------------------------	

// Handle client messages
io.sockets.on('connection', function (socket) {
    // On "get" message from the client    
    socket.on('get', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
		c.queue(message);
		
    });	
});