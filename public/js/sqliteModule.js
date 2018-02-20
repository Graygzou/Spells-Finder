/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.0
 */
 
// import the specific package
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

// Global variables used by the module
var db;

/**
 * Basic setup of the sqlite bdd.
 */
var setupSpellsDB = function(endCallback) {
	// if the database does not exist, the new database will be created 
	// and is ready for read and write.
	db = new sqlite3.Database('./sqlite/spells.db', sqlite3.OPEN_CREATE|sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log('Connected to the spell SQlite database.');
		// Create the SQL schema.
		createSpellsDB(endCallback);
	});
}

//SELECT rowid, * FROM 'Class';
//INSERT INTO Class (name) VALUES ('druid')

/**
 * 
 */
var createSpellsDB = function(endCallback) {
	// Retrieve the .sql file that create sqlite tables
	//var createTableFile = fs.readFileSync('').toString();
	
	fs.readFile('./sqlite/queries/init-spell-database.sql', 'utf8', function (err, data) {
		if (err) throw err;
		db.exec(data, function (err) {
			if (err) throw err;
			console.log("Database created.");
			endCallback();
		});
    });
}

/** initSpellsDB
 * Initialize tables that don't need the spells crawler.
 */
var initSpellsDB = function(endCallback) {
	db.serialize(function() {
		// Insert School values.
		schools = [
			{ name : 'Abjuration', 	desc : '' },
			{ name : 'Conjuration', desc : '' },
			{ name : 'Divination', 	desc : '' },
			{ name : 'Enchantment', desc : '' },
			{ name : 'Evocation', 	desc : '' },
			{ name : 'Illusion', 	desc : '' },
			{ name : 'Necromancy', 	desc : '' },
			{ name : 'Transmutation', desc : '' }
		];
		var insertQuery1 = db.prepare("INSERT INTO School VALUES (NULL, ?, ?)");
		for (var i = 0; i < schools.length; i++) {
			insertQuery1.run([schools[i]['name'], schools[i]['desc']]);
		}
		insertQuery1.finalize();
		// Insert Classes values.
		classes = [
			{ name : 'Bard', 	desc : '' },
			{ name : 'Cleric', 	desc : '' },
			{ name : 'Druid', 	desc : '' },
			{ name : 'Fighter', desc : '' },
			{ name : 'Monk', 	desc : '' },
			{ name : 'Paladin', desc : '' },
			{ name : 'Ranger', 	desc : '' },
			{ name : 'Rogue', 	desc : '' },
			{ name : 'Sorcerer', desc : '' },
			{ name : 'Wizard', 	desc : '' }
		];
		// Insert Class values.
		var insertQuery2 = db.prepare("INSERT INTO UserClass VALUES (NULL, ?, ?)");
		for (var i = 0; i < classes.length; i++) {
			insertQuery2.run([classes[i]['name'], classes[i]['desc']]);
		}
		insertQuery2.finalize();
		endCallback();
	});
}

/** Function that let insert in the database.
 * @param {object} jsondata - json file containing data.
 */
var insertSpell = function(jsondata) {
	// Call the parser maybe here ?
	db.serialize(function() {
		var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
		for (var i = 0; i < 10; i++) {
			stmt.run("Ipsum " + i);
		}
		stmt.finalize();
		
	});
}


/**
 * Let the user find a specific spell thanks to given parameters.
 * @param {int} maxLevel - maximum level of the spell
 * @param {bool} isVerbose - 1 is the spell needs verbose, 0 otherwise.
 * @param {bool} isSomatic - 1 is the spell needs somatic, 0 otherwise.
 * @param {bool} provideResistance - 1 if it grants spell resistance, 0 otherwise.
 * @param {array} materials - arrays of string that contains materials needed
 */
var getSpecificSpell = function(Userclass, maxLevel, isVerbose, isSomatic, provideResistance, materials) {
	var getQueryFile = fs.readFileSync('get-spell.sql').toString();
	
	db.serialize(function() {
		db.each(getQueryFile, [Userclass, provideResistance, isVerbose, isSomatic], function(err, row) {
			console.log(row.id + ": " + row.name);
			// return the name of spells that match the request parameters
			return row;
		});
	});
}


/**
 * Function that close the current database
 */
var closeSpellsDB = function() {
	db.close((err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log('Close the database connection.')
	});
}

// Export module functions
exports.setupSpellsDB 		= setupSpellsDB;
exports.initSpellsDB		= initSpellsDB;
exports.insertSpell 		= insertSpell;
exports.getSpecificSpell 	= getSpecificSpell;
exports.closeSpellsDB 		= closeSpellsDB;
 