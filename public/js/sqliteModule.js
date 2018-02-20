/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.0
 */
 
// import the specific package
var sqlite3 = require('sqlite3').verbose();

// Global variables used by the module
var db;
var isDatabaseCreated = false;

/**
 * Open the database in memory
 */
var openSpellsdb = function() {
	db = new sqlite3.Database(':memory:', (err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log('Connected to the in-memory SQlite database.');
	});
}


//SELECT rowid, * FROM 'Class';
//INSERT INTO Class (name) VALUES ('druid')

/**
 * Function that close the db
 */
var createSpellsdb = function() {
	// Retrieve the .sql file that create sqlite tables
	var sqlCreateTables = fs.readFileSync('init-spell-database.sql').toString();
	
	db.serialize(function() {
		db.run(sqlCreateTables);
	});
	isDatabaseCreated = true;
	console.log("database created");
}

/** Function that let insert in the database.
 * @param {object} jsondata - json file containing data.
 */
var insertSpell = function(jsondata){
	if(isDatabaseCreated) {
		
		// Call the parser maybe here ?
		
		db.serialize(function() {
			var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
			for (var i = 0; i < 10; i++) {
				stmt.run("Ipsum " + i);
			}
			stmt.finalize();
			
		});
	} else {
		console.log("call createSpellsdb before this operation");
	}
}


/**
 * Let the user find a specific spell thanks to given parameters.
 * @param {int} maxLevel - maximum level of the spell
 * @param {bool} isVerbose - 1 is the spell needs verbose, 0 otherwise.
 * @param {bool} isSomatic - 1 is the spell needs somatic, 0 otherwise.
 * @param {bool} provideResistance - 1 if it grants spell resistance, 0 otherwise.
 * @param {array} materials - arrays of string that contains materials needed
 */
var getSpecificSpell = function(maxLevel, isVerbose, isSomatic, provideResistance, materials) {
	if(isDatabaseCreated) {
		db.serialize(function() {
			db.each("SELECT * FROM Spell WHERE" +
							"provideResistance = " + provideResistance +
							"isVerbal = " + isVerbose +
							"isSomatic = " + isSomatic +
			"", function(err, row) {
				console.log(row.id + ": " + row.name);
				// return the name of spells that match the request parameters
				return row;
			});
		});
	} else {
		console.log("call createSpellsdb before this operation");
		return null;
	}
}


/**
 * Function that close the current database
 */
var closeSpellsdb = function() {
	db.close((err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log('Close the database connection.')
	});
}

// Export module functions
exports.openSpellsdb 		= openSpellsdb;
exports.createSpellsdb 		= createSpellsdb;
exports.insertSpell 		= insertSpell;
exports.getSpecificSpell 	= getSpecificSpell;
exports.closeSpellsdb 		= closeSpellsdb;
 