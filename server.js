/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.0
 */
 
// -------------------------------------
// Import modules
// -------------------------------------
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

var express = require('express'),
    app = module.exports.app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(8080);  //listen on port 80

// -------------------------------------
// Basic configuration
// -------------------------------------

// Let express know there's a public directory.
app.use(express.static(__dirname + '/public'));

// Get our custom modules
var crawlerModule = require('./public/js/crawlerModule');
var mapReduceModule = require('./public/js/mapReduceModule');
var mongodbModule = require('./public/js/mongodbModule');
var sqlite = require('./public/js/sqliteModule');


// Database variables
const dbUrl = 'mongodb://localhost:27017/';
const dbName = 'mongodbSpellsFinder';		// Database Name
const collecName = 'spells';				// Collection name

// -------------------------------------
// Basic Routing
// -------------------------------------

// Index page
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
	fs.readFile('./views/index.html', 'utf-8', function(error, content) {
		sqlite.openSpellsdb();
		sqlite.closeSpellsdb();
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

app.get('/formulaire.html', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    fs.readFile('./views/formulaire.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

app.get('/results.html', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    fs.readFile('./views/results.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
		console.log()
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
    // "get" means scraping all the webpage of spells. 
    socket.on('get', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
		
		// Setup MongoDB database
		mongodbModule.setupMongoDB(dbUrl, dbName, collecName, function () {
			console.log("-- Finished setup --");
			// Reset documents
			mongodbModule.removeAllCollection(collecName, function () {
				console.log("-- Finished removeAll --");
			
				mongodbModule.createCollections(collecName, function () {
					console.log("-- Finished createCollection --");
					
					// Start the crawling algorithm
					startCrawler(function () {
						
						
						console.log("-- Finish crawling --");
						
						//getSpecificSpell();
						
						mongodbModule.closeSpellsdb();
						
						// Let know the client he can step over to the next page
						socket.emit('finish', 'crawling');
						
					});
				});
			});
		});
    });
	
	// "compute" means appling the map reduce algorithm to find a list of spells.
	socket.on('compute', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
		
		// Setup MongoDB database
		mongodbModule.setupMongoDB(dbUrl, dbName, collecName, function () {
			console.log("-- Finished setup --");
			
			mongodbModule.getAllDocuments(collecName, function (results) {
				console.log(results);
			
				// Call the mapReduce function created for spells.
				var spellArgument = {school: 'conjuration', level: 2, components: ['V', 'S'], SpellResistance: 'no'};
				
				mapReduceModule.findSpells(0, 1, dbUrl, dbName, collecName, spellArgument, function (results) {
					console.log(results);
					
					// Let know the client he can print the results
					socket.emit('results', results);
				});
			});
		});
    });	
});

// -------------------------------------
// Private functions
// -------------------------------------	

var startCrawler = function(endCallback) {
	
	var maxNumber = 5;
	var url = "http://www.dxcontent.com/SDB_SpellBlock.asp?SDBID=";
	for(var id = 1; id <= maxNumber; id++) {
		crawlerModule.webScraper(url, id, insertMongoCallback, maxNumber, endCallback);
	}
}

var insertMongoCallback = function(jsonData) {
	mongodbModule.insertSpell(collecName, jsonData);
	console.log("1 document inserted");
}