/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.0
 */

var Crawler = require('crawler');
var express = require('express');
var http = require('http');
var fs = require('fs');

// Get our modules
//var module = require('./public/js/parser');

// Initialize app object.
var app = express();

// Set path to views.
//app.set('views', './views');

var spells = new Crawler({	
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log(res.body)
            console.log($("title").text());
        }
        done();
    }
});

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

app.listen(8080);