/**
 * @authors : Gregoire Boiron <gregoire.boiron@gmail.com>, 
			  Theo Le Donne
 * @version : 0.1.1
 */

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
  * @param {object} db - opened database ready to execute queries.
  * @param {callback} end - function called when the algorithm has finished.
  */
function findSpells(i, max, db, checkFunction, endCallback){
	db.collection("spells")
		.mapReduce(mapSpells, 
				reduceSpells, 
				{
					out: {replace: "validSpells"}
				})
		.then(function (collection) {
				collection.findOne({}, function(err, result) {
						if (err) throw err;
						console.log(result);
				});
               collection.find().toArray()
                   .then(function (docs)
                   {
                       console.log(docs);
                       console.log("************************************************************************");
                       console.log("************************************************************************");
                       console.log("************************************************************************");

                       //1ere condition d'arrêt. Le graphe converge (algo fini)
                       //Sinon, on a egalement un maximum d'iterations
                       //Nombre max d'iterations atteint
                       console.log("VALEUR DE I = ", i);
                       if (i == max)
                           cb();

                       // Peform a simple find and return all the documents
                       collection.find({"isValid": 1}).toArray()
                           .then(function (docs)
                           {

                               console.log("GROS LOG DES DOCS TROUVES");
                               console.log("************************************************************************");
                               console.log(docs);

                               if (docs.length == 0) {
                                   console.log("SORTIE TAKEN");
                                   cb();
                               }
                               else {
                                   console.log("ENCORE UNE ITERATION");
                                   findSpells(i + 1, max, db, cb);
                               }
                           });
                   });
		});
}


// Look at that : https://docs.mongodb.com/manual/tutorial/map-reduce-examples/

// --------------------------------------------------------------
// Private functions
// --------------------------------------------------------------
 
// {_id:"A", value: {pagerank:1, outlink_list:["A","B","C"]} },
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
	if (checkFunction(this)) {
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
	}s

	print("Full object de ", reducedVal);
	//print(tojson(full));
	return reducedVal;
}

// Export module functions
exports.pageRank = pageRank;
exports.findSpells = findSpells;