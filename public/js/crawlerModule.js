/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @author : Florian Vidal <florianvidals@gmail.com>
 * @version : 0.1.0
 */

// import the specific package
const Crawler = require('crawler');
const fs = require('fs');

// Import custom modules
var parserModule = require('./parserModule');

// Database variables
const dbUrl = 'mongodb://localhost:27017/';
const dbName = 'mongodbSpellsFinder';		// Database Name
const collecName = 'spells';				// Collection name

var createCrawler = new Crawler({
	maxConnections: 1, // `maxConnections` will be forced to 1
	// This will be called for each crawled page
	callback : function (error, res, done) {
		if(error) {
			console.log(error);
		} else {
			console.log("page crawled !");
		}
		done();
	}
});


/** webScraper
 * Method called to parser a webpage and enter value inside the database.
 *
 * @param {string} url - Uniform Resource Locator (URL) of the webpage.
 */
var webScraper = function(url, numPage, dbcallback, lastIDPages, endCallback) {
	createCrawler.queue([{
		uri: url + numPage,
		id: numPage,
		// The global callback won't be called
		callback: function (error, res, done) {
			if (error) {
				console.log(error);
			} else {
				var $ = res.$;
				
				// Send spell data to parse it.
				var currentSpell = parserModule.parseCurrentSpell($('.SpellDiv'));

				// call MongoDB callback to insert the data into mongodb
				dbcallback(currentSpell, lastIDPages, endCallback);
				
			}
			done();
		}
	}]);
}

// Export module functions
exports.webScraper = webScraper;