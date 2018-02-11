/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @author : Florian Vidal <florianvidals@gmail.com>
 * @version : 0.1.0
 */

// import the specific package
var Crawler = require('crawler');
var fs = require('fs');

// Import database packages
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const dbUrl = 'mongodb://localhost:27017/';
 
// Database Name
const dbName = 'mongodbSpellsFinder';

// Collection name
const collecName = 'spells';

// Function that get the page and return Cheerio to crawl the HTML body
var crawlerPage = function(url) {
    console.log('URl : ' + url);
	var crawler = new Crawler({
		maxConnections: 1, // `maxConnections` will be forced to 1
		// This will be called for each crawled page
		callback : function (error, res, done) {
			if(error) {
				console.log(error);
			} else {
				var $ = res.$;

				// Parser
				var title = $('div.heading').find('p').text();

                var infoSchoolLevel = $($('div.SpellDiv').children()[1]).text();
                var school = infoSchoolLevel.substring(7,infoSchoolLevel.indexOf(";"));
                var level = infoSchoolLevel.substring(infoSchoolLevel.indexOf(";")+8, infoSchoolLevel.length);

                var castingTime = $($('div.SpellDiv').children()[3]).text().substring(13);
                var components = $($('div.SpellDiv').children()[4]).text().substring(11);

                var range = $($('div.SpellDiv').children()[6]).text().substring(6);
                var effects = $($('div.SpellDiv').children()[7]).text().substring(7);
                var duration = $($('div.SpellDiv').children()[8]).text().substring(9);

                var infoSavingResistance = $($('div.SpellDiv').children()[9]).text();
                var savingThrow = infoSavingResistance.substring(13, infoSavingResistance.indexOf(";"));
                var spellResistance = infoSavingResistance.substring(infoSavingResistance.indexOf(";")+19, infoSavingResistance.length);

                var description = $($('div.SpellDiv').children()[11]).text();

				/*
                console.log("School           : " + school);
                console.log("Level            : " + level);
                console.log("Casting Time     : " + castingTime);
                console.log("Components       : " + components);
                console.log("Range            : " + range);
                console.log("Effects          : " + effects);
                console.log("Duration         : " + duration);
                console.log("Saving Throw     : " + savingThrow);
                console.log("Spell Resistance : " + spellResistance);
                console.log("Description      : " + description);*/
				
				var currentSpell = { 
					"School": school, "Level": level, "Casting Time": castingTime,
					"Components": components, Range: range, "Effects": effects,
					"Duration": duration, "Saving Throw": savingThrow,
					"Spell Resistance": spellResistance, "Description": description
				};
				
				// Use connect method to connect to the server
				MongoClient.connect(dbUrl, function(err, db) {
					assert.equal(null, err);
					console.log("Connected successfully to bdd");

					// Create a database
					var spellsFinderDb = db.db(dbName);
					
					// Create a test collection
					spellsFinderDb.createCollection(collecName, function(err, res) {
						if (err) throw err;
						console.log("Collection created!");
					});

					// Insert the current value in the database
					spellsFinderDb.collection(collecName).insertOne(currentSpell, function(err, res) {
						if (err) throw err;
						console.log("1 document inserted");
					});
					
					spellsFinderDb.collection(collecName).findOne({}, function(err, result) {
						if (err) throw err;
						console.log(result);
						db.close();
					});
				 
				  //db.close();
				});

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
	});
	crawler.queue(url);
}





// Export the function of the module
exports.crawlerPage = crawlerPage;