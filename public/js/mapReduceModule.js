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
	
		mongodbModule.mapReduceSpells(collecName, spellArguments, mapSpells, reduceSpells, function (result) {
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

//school, [level, components, range, {SpellResistance: spellResistance}])
/** mapSpells 
  * map function executed by MongoDB interpreter.
  */
var mapSpells = function() {
	//print(tojson(this));
	
	var key = this.name;
	//print(spell);
	var school = this.school;
	//print(school);
	var level = this.level;
	//print(level);
	var components = this.components;
	//print(components);
	var range = this.range;
	//print(range);
	var SpellResistance = this.SpellResistance;
	//print(SpellResistance);
	
	// Check if the current spell match our criterion
	var value = {};
	print(spellArguments);
	/*if (this.level <= spellArguments.level && this.school == spellArguments.level && 
		this.SpellResistance == spellArguments.SpellResistance &&
		checkComponents(spellArguments.components, this.components) ) {*/
	if(true) {
		// The current spell does match.
		value = { 
				 name: this.name,
				 isValid: 1
				};
		emit(key, value);
	} else {
		// The current spell doesn't match.
		value = { 	
					name: 'toto',
					isValid: 0
				};
		// nothing ?
	}
	
	
};


var checkComponents = function(givenComponents, currentSpellComponents) {
	if(givenComponents.length != currentSpellComponents.length) {
		return false;
	} else {
		var i = 0;
		var equals = true;
		while(equals && i < currentSpellComponents.length) {
			// if the current item is not 
			if(givenComponents.indexOf(currentSpellComponents[i]) == -1) {
				var equals = false;
			}
		}
		return equals;
	}
}

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
	
	print("1er Reduce : ", tojson(key), tojson(values));
	var reducedVal = { names : [] };
	
	for (var i = 0; i < values.length; i++){
		reducedVal.names[i] = values[i].name
	}

	print("Full object de ", reducedVal);
	//print(tojson(full));
	return reducedVal;
}

// Export module functions
exports.pageRank = pageRank;
exports.findSpells = findSpells;