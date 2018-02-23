/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.0
 */
 
// import the specific package
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');

// Global variables used by the module
var db;
var counter = 0;

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
		endCallback();
	});
}

//SELECT rowid, * FROM 'Class';
//INSERT INTO Class (name) VALUES ('druid')

/**
 * 
 */
var resetSpellsDB = function(endCallback) {
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
			{ name : 'abjuration', 	desc : '' },
			{ name : 'conjuration', desc : '' },
			{ name : 'divination', 	desc : '' },
			{ name : 'enchantment', desc : '' },
			{ name : 'evocation', 	desc : '' },
			{ name : 'illusion', 	desc : '' },
			{ name : 'necromancy', 	desc : '' },
			{ name : 'sin magic specialist', 	desc : '' },
			{ name : 'universal', 	desc : '' },
			{ name : 'transmutation', desc : '' },
			{ name : 'aether elemental school', desc : '' },
			{ name : 'air', 	desc : '' },
			{ name : 'earth', 	desc : '' },
			{ name : 'fire', 	desc : '' },
			{ name : 'water', 	desc : '' },
			{ name : 'metal', 	desc : '' },
			{ name : 'void', 	desc : '' },
			{ name : 'wood', 	desc : '' }
			
		];
		var insertIntoSchool = db.prepare("INSERT INTO School (school_name, description) VALUES (?, ?)");
		for (var i = 0; i < schools.length; i++) {
			insertIntoSchool.run([schools[i]['name'], schools[i]['desc']]);
		}
		insertIntoSchool.finalize();
		// Insert Classes values.
		classes = [
			{ name : 'antipaladin', desc : '' },
			{ name : 'spiritualist', desc : '' },
			{ name : 'psychic', 	desc : '' },
			{ name : 'occultist', 	desc : '' },
			{ name : 'mesmerist', 	desc : '' },
			{ name : 'medium', 		desc : '' },
			{ name : 'bloodrager', 	desc : '' },
			{ name : 'shaman', 		desc : '' },
			{ name : 'witch', 		desc : '' },
			{ name : 'summoner', 	desc : '' },
			{ name : 'inquisitor', 	desc : '' },
			{ name : 'magus', 		desc : '' },
			{ name : 'alchemist', 	desc : '' },
			{ name : 'bard', 	desc : '' },
			{ name : 'cleric', 	desc : '' },
			{ name : 'oracle', 	desc : '' },
			{ name : 'druid', 	desc : '' },
			{ name : 'fighter', desc : '' },
			{ name : 'monk', 	desc : '' },
			{ name : 'paladin', desc : '' },
			{ name : 'ranger', 	desc : '' },
			{ name : 'rogue', 	desc : '' },
			{ name : 'sorcerer', desc : '' },
			{ name : 'wizard', 	desc : '' }
		];
		// Insert Class values.
		var insertIntoClass = db.prepare("INSERT INTO UserClass (class_name, description) VALUES (?, ?)");
		for (var i = 0; i < classes.length; i++) {
			insertIntoClass.run([classes[i]['name'], classes[i]['desc']]);
		}
		insertIntoClass.finalize();
		endCallback();
	});
}

/** Function that let insert in the database.
 * @param {object} jsondata - json file containing data.
 */
var insertSpell = function(jsondata, lastIDPages, endCallback) {
	//console.log(jsondata);
		
		// First : Get the school id
		/*var sql = "SELECT school_id id FROM School WHERE name = ?;";
		db.get(sql, jsondata['school'], (err, school) => {
			if (err) {
				throw err;
			}*/
			// We insert the spell in his tables
			//var insertSpell = db.prepare();
			// Variables
			console.log(jsondata['name']);
			var isVerbose = hasComponent(jsondata['components'], 'V') ? '1' : '0';
			var isSomatic = hasComponent(jsondata['components'], 'S') ? '1' : '0';
			var provideResistance = jsondata['SpellResistance'].indexOf('yes') > -1 ? '1' : '0';
			
			db.serialize(() => {
				db.run("INSERT INTO Spell (spell_name, school_name, description, provideResistance, isVerbose, isSomatic) VALUES (?, ?, ?, ?, ?, ?)", 
						[jsondata['name'], jsondata['school'], '', provideResistance, isVerbose, isSomatic], (err, row) => {
					if (err) { console.log("spell failed insert query."); }
					counter = counter + 1;
					if(counter == lastIDPages) {
						endCallback('sqlite');
					}
				});
				for(index in jsondata['levels']) {
					//console.log(jsondata['levels'][index]);
					db.run("INSERT INTO Invoque (class_name, spell_name, spellLevel) VALUES (?, ?, ?)", 
							[jsondata['levels'][index]['class'], jsondata['name'], jsondata['levels'][index]['level']], (err, row) => {
						if (err) { console.log("invoque failed insert query."); }
					});
				}
			});
				
				/*
				if(err) throw err;
					
				// Create the relation between Ingredients and Spell.
				// TODO later ?
					// Get his ID.
					//var previousID = this.lastID;
					var insertInvoque = db.prepare();
					for(index in jsondata['levels']) {
						console.log(jsondata['levels'][index]['class']);
						// Create the relation between UserClass and Spell.
						/*db.get("SELECT class_id id FROM UserClass WHERE name = ?", jsondata['levels'][index]['class'], (err, row) => {
							if (err){
								throw err;
							}
						insertInvoque.run("INSERT INTO Invoque (class_name, spell_name, spellLevel) VALUES (?, ?, ?)", [jsondata['levels'][index]['class'], jsondata['name'], jsondata['levels'][index]['level']]);
						//});
							
						//console.log(jsondata['levels'][index]['class']);
						//insertInvoque(sqlClassID, previousID, jsondata['levels'][index]);
					}
				
			});*/
			//insertSpell.finalize();
		//});
}

/** Function that let insert in the database.
 * @param {object} jsondata - json file containing data.
 */
 /*
var insertInvoque = function(sqlClassID, previousID, currentField, endcallback()) {
	console.log(previousID + " / ");
	console.log(currentField);
	sqlClassID.run(currentField['class'], (err, userClass) => {
		if (err) {
			throw err;
		}
		if(userClass === undefined) {
			console.log("undefinied");
			console.log(currentField);
		}
		var sqlInsertInvoque = db.prepare("INSERT INTO Invoque (class_id, spell_id, spellLevel) VALUES (?, ?, ?)");
		sqlInsertInvoque.run([userClass.id, previousID, currentField['level']]);
		sqlInsertInvoque.finalize();
	});
	sqlClassID.reset();
}*/

var hasComponent = function(components, wantedComponent) {
	var find = false;
	
	for(index in components) {
		if(components[index] == wantedComponent) {
			find = true
		}
	}
	return find;
}


/**
 * Let the user find a specific spell thanks to given parameters.
 * @param {int} maxLevel - maximum level of the spell
 * @param {bool} isVerbose - 1 is the spell needs verbose, 0 otherwise.
 * @param {bool} isSomatic - 1 is the spell needs somatic, 0 otherwise.
 * @param {bool} provideResistance - 1 if it grants spell resistance, 0 otherwise.
 */
var getSpecificSpells = function(params, endCallback) {
	//var getQueryFile = fs.readFileSync('get-spell.sql').toString();
	// Build the request depending on parameters
	var queryParameters = [];
	console.log(params);
	
	var sql = "SELECT DISTINCT Spell.spell_name, Spell.school_name, spellLevel, isVerbose, isSomatic, provideResistance FROM Spell INNER JOIN Invoque on Invoque.spell_name = Spell.spell_name INNER JOIN School on School.school_name = Spell.school_name INNER JOIN UserClass on UserClass.class_name = Invoque.class_name";
	
	var i = 0;
	for(index in params) {
		if(i == 0) {
			sql += " WHERE ";
			i = 1;
		} else {
			sql += " AND ";
		}
		
		if(index == 'school') {
			sql += 'School.school_name = ?';
			queryParameters.push(params[index]);
		} else if(index == 'levels') {
			sql += 'Invoque.spellLevel <= ?';
			queryParameters.push(params[index]['level']);
			sql += 'AND UserClass.class_name = ?';
			queryParameters.push(params[index]['class']);
		} else if(index == 'isVerbose') {
			sqlQueryFile += 'Spell.isVerbal = ?';
			// TODO
			
		} else if(index == 'isSomatic') {
			sqlQueryFile += 'Spell.isSomatic = ?';
			// TODO
			
		} else if(index == 'spellResistance') {
			sql += "Spell.provideResistance = ?";
			queryParameters.push(params[index].indexOf('yes') > -1 ? 1 : 0);
		}
	}
	
	// Execute the query
	db.all(sql, queryParameters, (err, rows) => {
		if (err) {
			throw err;
		}
		endCallback({'bdd': 'sqlite', 'results': rows});
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
exports.resetSpellsDB 		= resetSpellsDB;
exports.closeSpellsDB 		= closeSpellsDB;

exports.initSpellsDB		= initSpellsDB;

exports.insertSpell 		= insertSpell;
exports.getSpecificSpells 	= getSpecificSpells;