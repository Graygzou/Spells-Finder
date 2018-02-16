/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @author : Florian Vidal <florianvidals@gmail.com>
 * @version : 0.1.0
 */

// import the specific package
const Crawler = require('crawler');
const fs = require('fs');

// Import custom modules
var parserModule = require('./parser');

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
var webScraper = function(url, dbcallback) {
	console.log('URl : ' + url);

	createCrawler.queue([{
		uri: url,
	 
		// The global callback won't be called
		callback: function (error, res, done) {
			if (error) {
				console.log(error);
			} else {
				var $ = res.$;

				// Parser
				var spellTitle = $('div.heading').find('p').text();

				var infoSchoolLevel = $($('div.SpellDiv').children()[1]).text();
				var school = parserModule.splitSchool(infoSchoolLevel.substring(7,infoSchoolLevel.indexOf(";")));
				var level = parserModule.splitLevel(infoSchoolLevel.substring(infoSchoolLevel.indexOf(";")+8, infoSchoolLevel.length));

				var castingTime = $($('div.SpellDiv').children()[3]).text().substring(13);
				var components = parserModule.splitComponent($($('div.SpellDiv').children()[4]).text().substring(11));

				var range = parserModule.splitRange($($('div.SpellDiv').children()[6]).text().substring(6));
				var effects = $($('div.SpellDiv').children()[7]).text().substring(7);
				var duration = $($('div.SpellDiv').children()[8]).text().substring(9);

				var infoSavingResistance = $($('div.SpellDiv').children()[9]).text();
				var savingThrow = infoSavingResistance.substring(13, infoSavingResistance.indexOf(";"));
				var spellResistance = infoSavingResistance.substring(infoSavingResistance.indexOf(";")+19, infoSavingResistance.length);

				var description = $($('div.SpellDiv').children()[11]).text();

				/*
				console.log(spellTitle)
				console.log(school);
				console.log(level);
				console.log(components);
				console.log(range);
				console.log("SpellResistance :" + spellResistance);*/
				
				/*
				console.log("Level            : " + level);
				console.log("Casting Time     : " + castingTime);
				console.log("Components       : " + components);
				console.log("Range            : " + range);
				console.log("Effects          : " + effects);
				console.log("Duration         : " + duration);
				console.log("Saving Throw     : " + savingThrow);
				console.log("Spell Resistance : " + spellResistance);
				console.log("Description      : " + description);*/
				
				var currentSpell = parserModule.JSONConcat({name: spellTitle}, [school, level, components, range, {SpellResistance: spellResistance}])
				console.log(currentSpell);

				dbcallback(currentSpell);
					/*
					spellsFinderDb.listCollections().toArray(function(err, collections){
						//collections = [{"name": "coll1"}, {"name": "coll2"}]
						collections.forEach(function(elem) {
							if (collecName === elem.name) {
								spellsFinderDb.collection(collecName).drop();
							}
						});	
					});*/

				// $ is Cheerio by default
				//a lean implementation of core jQuery designed specifically for the server
				//console.log($('body').find('script').eq(7).text());

				//console.log(infos.children());
				//console.log($('.article-content').find('p').text());

				//console.log($('.article_center').find('p'));
				//console.log($('.article-content').find('p').length);
				//fs.writeFileSync("monFichier", $('body').find('script').eq(7).text(), "UTF-8");
				//console.log($("table").text());
				//socket.emit('response', res.body);
				//console.log($("title").text());
			}
			done();
		}
	}]);
}

// Export module functions
exports.webScraper = webScraper;