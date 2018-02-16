/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.0
 */
 
// import the specific package
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var connect;
var spellsFinderdb;

/** setupMongoDB
 * Basic setup of the mongodb database
 *
 * @param {string} dbName - name of the database
 */
var setupMongoDB = function(dbUrl, dbName, collecName, callback) {
	// Connect to the database server.
	connect = MongoClient.connect(dbUrl + dbName);
	
	// Create a database
	MongoClient.connect(dbUrl, function(err, db) {
		assert.equal(null, err);
		console.log("Connected successfully to MongoDB");
		
		spellsFinderdb = db.db(dbName);
		
		// Call the end callback
		callback();
	});
}

/** createCollections
 * Function that create a collection
 *
 * @param {string} collecName - name of the collection
 */
var createCollections = function(collecName, callback) {
	// Create a test collection
	spellsFinderdb.createCollection(collecName, function(err, res) {
		if (err) throw err;
		
		callback();
	});
}

/** removeAllCollection
 * Function that remove everything from a collection
 *
 * @param {string} collecName - name of the collection
 */
var removeAllCollection = function(collecName, callback) {
	// Remove all the documents
	spellsFinderdb.collection(collecName).removeMany();
	
	callback();
}

/** insertSpell
 * Function that insert a json file in the specified collection.
 *
 * @param {string} collecName - name of the collection
 * @param {object} jsondata - json file containing data.
 */
var insertSpell = function(collecName, jsondata){
	// Insert the current value in the database
	spellsFinderdb.collection(collecName).insertOne(jsondata, function(err, res) {
		if (err) throw err;
	});
}

/** getSpecificSpell
 * Let the user find a specific spell thanks to given parameters.
 *
 * @param {string} collecName - name of the collection
 * @param {int} maxLevel - maximum level of the spell
 * @param {bool} isVerbose - 1 is the spell needs verbose, 0 otherwise.
 * @param {bool} isSomatic - 1 is the spell needs somatic, 0 otherwise.
 * @param {bool} provideResistance - 1 if it grants spell resistance, 0 otherwise.
 * @param {array} materials - arrays of string that contains materials needed
 */
var getSpecificSpell = function(collecName, maxLevel, isVerbose, isSomatic, provideResistance, materials) {
	spellsFinderdb.collection(collecName).findOne({}, function(err, result) {
		if (err) throw err;
		console.log(result);
	});
}

/** getAllDocuments
 * Let the user retrieve all the documents of a collection
 *
 * @param {string} collecName - name of the collection
 */
var getAllDocuments = function(collecName, callback) {
	spellsFinderdb.collection(collecName).find({}).toArray(function(err, result) {
		if (err) throw err;
		callback(result);
	});
}

/** mapReduceSpells
 * Apply mapReduce algorithm on a specified collection
 *
 */
var mapReduceSpells = function(collecName, arguments, mapSpells, reduceSpells, callback) {
	spellsFinderdb.collection(collecName).mapReduce(mapSpells, reduceSpells, { out: {replace: "validSpells"}, scope: { spellArguments: arguments } })
	.then(function (collection) {
		collection.find({}).toArray().then(function (docs) {
		   // Send the result to the callback
		   callback(docs);
	   });
	});
}


/**
 * Function that close the current database
 */
var closeSpellsdb = function() {
	spellsFinderdb.close;
}

// Export module functions
exports.setupMongoDB 		= setupMongoDB;
exports.createCollections 	= createCollections
exports.closeSpellsdb 		= closeSpellsdb; 

exports.insertSpell 		= insertSpell;
exports.removeAllCollection = removeAllCollection;

exports.getAllDocuments		= getAllDocuments;
exports.getSpecificSpell 	= getSpecificSpell;

exports.mapReduceSpells		= mapReduceSpells;