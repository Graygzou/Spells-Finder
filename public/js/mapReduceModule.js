/**
 * @authors : Gregoire Boiron <gregoire.boiron@gmail.com>, 
			  Theo Le Donne
 * @version : 0.1.2
 */

 var mongodbModule = require('./mongodbModule');
 
 // JSON object containing spell arguments.
 var spellArguments;
 
/** pageRank 
  * Compute the map reduce algorithm to process a page rank.
  *
  * @param {int} i - Number of the current iteration.
  * @param {int} max - Maximum number of iterations the algorithm will process. 
  * @param {object} db - opened database ready to execute queries.
  * @param {callback} end - function called when the algorithm has finished.
  */
var pageRank = function(i, max, dbo, end) {
	dbo.collection("Pages").mapReduce(mapPageRank, reducePageRank, {out: {replace: "Pages"}}, function(err,fin) {
		if (err) throw err
		if (i==max) end();
		
		else {
			console.log("  ");
			console.log("  ");
			console.log("Iteration n° " + i);
			fin.findOne({"_id" : "A"}, function(err, result){
				console.log(result);
			});
			fin.findOne({"_id" : "B"}, function(err, result){
				console.log(result);
			});
			fin.findOne({"_id" : "C"}, function(err, result){
				console.log(result);
			});
			fin.findOne({"_id" : "D"}, function(err, result){
				console.log(result);
			});
			console.log("  ");
			pageRank(i+1, max, dbo, end);
		}
	});
}
 
/** findSpells 
  * Compute the map reduce algorithm to find a particular spell.
  *
  * @param {int} i - Number of the current iteration.
  * @param {int} max - Maximum number of iterations the algorithm will process. 
  * @param {object} dbUrl - opened database ready to execute queries.
  * @param {callback} end - function called when the algorithm has finished.
  */
function findSpells(i, max, dbUrl, dbName, collecName, arguments, endCallback){
	
	spellArguments = arguments;
	//console.log(arguments);
	
	// re connect to the mongodb client
	mongodbModule.setupMongoDB(dbUrl, dbName, collecName, function () {
		console.log("-- Finished setup --");		
		
		/** checkIfValid
		 * function called by the map function to know if a specific spell match the parameters.
		 * @param {JSON} currentSpell - spell currently evaluated by the mapReduce algorithm.
		 */
		/*checkFunction = function(spellArguments) {
			return (true);
		}*/
	
		mongodbModule.mapReduceSpells(collecName, spellArguments, mapSpells, reduceSpells, checkInformations, getSpellLevel, function (result) {
			console.log("-- MapReduce finished --");
			endCallback(result);
		});

	});
}

// --------------------------------------------------------------
// Private functions
// --------------------------------------------------------------
 
/** mapSpells 
  * map function executed by MongoDB interpreter.
  */
var mapPageRank = function() {
	var page = this._id;
	var pagerank = this.value.pagerank;
	var outlink_list = this.value.outlink_list;
	var linkPageRank = 0;

	emit(page,outlink_list);

	for (var i=0, len=outlink_list.length; i<len; i++){
		var outlink = outlink_list[i];
		if (page!==outlink) {
			var linkPageRank = pagerank/(outlink_list.length-1); //the default pageRank for the node itself is set to 0
		}
		emit(outlink,linkPageRank);
	}
};

/** mapSpells 
  * map function executed by MongoDB interpreter.
  */
var mapSpells = function() {
	// Check if the current spell match our criterion
	var value = {};
	if(check(this, spellArguments)) {
		// Find the level of the spell for the userClass
		spellLevel = getSpellLevel(this.levels, spellArguments);
		// The current spell does match.
		value = {
			school: this.school,
			level: spellLevel,
			components: this.components,
			range: this.range,
			SpellResistance: this.SpellResistance
		};
		emit(this.name, value);
	} else {
		// nothing.
	}
	
	
};

/** reducePageRank
 *
 */
var reducePageRank = function(page,values){
	var outlink_list = [];
	var pagerankSum = 0;
	var damping = 0.85;
	var nbOfNodes = this.insertedCount;
	var obj = {};
	
	for (var i=0, len=values.length; i<len; i++){
		if (values[i] instanceof Array) {
			outlink_list=values[i];}
		else {                        
			pagerankSum += values[i];
		}
	}
	var newPageRank = 1 - damping + ( damping*pagerankSum );
	obj = {pagerank:newPageRank, outlink_list: outlink_list}
	
	return obj;
};

/** reduceSpells
 * apply the reduce function based on isValid attribute
 */
var reduceSpells = function(key, values){
	
	var reducedVal = { names : [] };
	
	for (var i = 0; i < values.length; i++){
		reducedVal.names[i] = values[i].name
	}
	return reducedVal;
}

// ----------------------------------------
// Private functions
// ----------------------------------------

var checkInformations = function(currentSpellInfos, givenSpellInfos) {
	var finalEquals = true;
	for (key in givenSpellInfos) {
		if(key == "levels") {
			var innerEquals = false;
			for (spellLevels in currentSpellInfos[key]) {
				var spellClass = currentSpellInfos[key][spellLevels]["class"];
				var spellLevel = currentSpellInfos[key][spellLevels]["level"];
				if(spellClass != undefined) {
					if(spellClass.indexOf(givenSpellInfos["levels"]["class"]) > -1 && spellLevel <= givenSpellInfos["levels"]["level"]) {
						innerEquals = true;
					}
				}
			}
			finalEquals = finalEquals && innerEquals;
		} else if (key == "components") {
			var counter = 0;
			// for all the spells
			for(currentIndex in givenSpellInfos[key]) {
				// get the current component ('V', 'S', ...)
				current_component = givenSpellInfos[key][currentIndex];
				for(key_comp in current_component) {
					// See if it match
					if(current_component[key_comp] == 1) {
						counter += 1;
						finalEquals = finalEquals && (currentSpellInfos[key].indexOf(key_comp) > -1);
					} else if(current_component[key_comp] == 0) {
						finalEquals = finalEquals && (currentSpellInfos[key].indexOf(key_comp) == -1);
					}
				}
			}
			// Make a final filter to make sure we take into account M/DF and F/DF components.
			if(currentSpellInfos[key].length != counter) {
				finalEquals = false;
			}
		} else {
			printjson(givenSpellInfos[key]);
			printjson(currentSpellInfos[key]);
			finalEquals = finalEquals && (givenSpellInfos[key] == currentSpellInfos[key]);
		}
	}
	
	return finalEquals;
}

var getSpellLevel = function(currentSpellLevels, givenSpellInfos) {
	var level;
	//print("ici");
	//printjson(givenSpellInfos);
	//printjson(currentSpellLevels);
	for(var i = 0; i < currentSpellLevels.length; i++)
	{
	//for (spellLevels in currentSpellLevels) {
		//print(spellLevels);
		// assign the first level no matter what
		if(i == 0) {
			level = currentSpellLevels[i]["level"];
		}
		var spellClass = currentSpellLevels[i]["class"];
		var spellLevel = currentSpellLevels[i]["level"];
		//print(spellClass);
		if(spellClass != undefined) {
			if (givenSpellInfos.hasOwnProperty("levels")) {
				if(spellClass.indexOf(givenSpellInfos["levels"]["class"])) {
					level = spellLevel;
				}
			} else {
				 level = spellLevel;
			}
		}
	}
	
	return level;
}

// Export module functions
exports.pageRank = pageRank;
exports.findSpells = findSpells;