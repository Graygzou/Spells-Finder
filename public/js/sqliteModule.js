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
	
	//console.log(jsondata['name']);
	var isVerbose = hasComponent(jsondata['components'], 'V') ? '1' : '0';
	var isSomatic = hasComponent(jsondata['components'], 'S') ? '1' : '0';
	var provideResistance = jsondata['SpellResistance'].indexOf('yes') > -1 ? '1' : '0';
	// ----
	var hasFocus = hasComponent(jsondata['components'], 'F') ? 1 : 0;
	var hasMaterials = hasComponent(jsondata['components'], 'M') ? 1 : 0;
	var hasMorDF = hasComponent(jsondata['components'], 'M/DF') ? 1 : 0;
	var hasDivineFocus = hasComponent(jsondata['components'], 'DF') ? 1 : 0;
	
	db.serialize(() => {
		db.run("INSERT INTO Spell (spell_name, school_name, description, provideResistance, isVerbose, isSomatic) VALUES (?, ?, ?, ?, ?, ?)", 
				[jsondata['name'], jsondata['school'], '', provideResistance, isVerbose, isSomatic], (err, row) => {
			if (err) { console.log("spell failed insert query."); }
			counter = counter + 1;
			if(counter == lastIDPages) {
				endCallback('sqlite');
			}
		});
		// Add extras data into the database
		for(index in jsondata['levels']) {
			//console.log(jsondata['levels'][index]);
			db.run("INSERT INTO Invoque (class_name, spell_name, spellLevel) VALUES (?, ?, ?)", 
					[jsondata['levels'][index]['class'], jsondata['name'], jsondata['levels'][index]['level']], (err, row) => {
				if (err) { console.log("invoque failed insert query."); }
			});
		}
		if(hasMaterials) {
			// Insert the "ingredient" table
			var id_mat = Math.random().toString(36).substring(7);
			// Right now it's a dummy value because we don't retrieve objects in parentheses.
			db.run("INSERT INTO Ingredient (ingredient_name, description) VALUES (?, ?)", 
					[id_mat, 'dummy value'], (err, row) => {
				if (err) { console.log("invoque failed insert query."); }
			});
			// Insert the link between the two tables
			db.run("INSERT INTO Need (ingredient_name, spell_name, ingredient_type, cost) VALUES (?, ?, ?, ?)", 
					[id_mat, jsondata['name'], 'M', 0.0], (err, row) => {
				if (err) { console.log("invoque failed insert query."); }
			});
		}
		if(hasMorDF) {
			// Insert the "ingredient" table
			var id_mat = Math.random().toString(36).substring(7);
			// Right now it's a dummy value because we don't retrieve objects in parentheses.
			db.run("INSERT INTO Ingredient (ingredient_name, description) VALUES (?, ?)", 
					[id_mat, 'dummy value'], (err, row) => {
				if (err) { console.log("invoque failed insert query."); }
			});
			// Insert the link between the two tables
			db.run("INSERT INTO Need (ingredient_name, spell_name, ingredient_type, cost) VALUES (?, ?, ?, ?)", 
					[id_mat, jsondata['name'], 'M/DF', 0.0], (err, row) => {
				if (err) { console.log("invoque failed insert query."); }
			});
		}
		if(hasDivineFocus) {
			// Insert the "ingredient" table
			var id_mat = Math.random().toString(36).substring(7);
			// Right now it's a dummy value because we don't retrieve objects in parentheses.
			db.run("INSERT INTO Ingredient (ingredient_name, description) VALUES (?, ?)", 
					[id_mat, 'dummy value'], (err, row) => {
				if (err) { console.log("invoque failed insert query."); }
			});
			// Insert the link between the two tables
			db.run("INSERT INTO Need (ingredient_name, spell_name, ingredient_type, cost) VALUES (?, ?, ?, ?)", 
					[id_mat, jsondata['name'], 'DF', 0.0], (err, row) => {
				if (err) { console.log("invoque failed insert query."); }
			});
		}
		if(hasFocus) {
			// Insert the "ingredient" table
			var id_mat = Math.random().toString(36).substring(7);
			// Right now it's a dummy value because we don't retrieve objects in parentheses.
			db.run("INSERT INTO Ingredient (ingredient_name, description) VALUES (?, ?)", 
					[id_mat, 'dummy value'], (err, row) => {
				if (err) { console.log("invoque failed insert query."); }
			});
			// Insert the link between the two tables
			db.run("INSERT INTO Need (ingredient_name, spell_name, ingredient_type, cost) VALUES (?, ?, ?, ?)", 
					[id_mat, jsondata['name'], 'F', 0.0], (err, row) => {
				if (err) { console.log("invoque failed insert query."); }
			});
		}
	});
}

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
	
	var sql = fs.readFileSync('./sqlite/queries/get-spell.sql').toString();
	
	for(index in params) {
		sql += " AND ";
		
		if(index == 'school') {
			sql += "School.school_name = ?";
			queryParameters.push(params[index]);
		} else if(index == 'levels') {
			sql += "Invoque.spellLevel <= ?";
			queryParameters.push(params[index]['level']);
			sql += " AND UserClass.class_name = ?";
			queryParameters.push(params[index]['class']);
		} else if(index == 'components') {
			var firstOne = true;
			var queryFilter = '';
			
			// For all components in the array
			for(var compIndex in params[index]) {
				console.log(params[index][compIndex]);
				// to get the key
				for(var key in params[index][compIndex]) {
					console.log(key)
					console.log(params[index][compIndex][key])
					// find out which component is it.
					switch(key) {
						case 'V':
							queryFilter = 'sp1.isVerbose = ?';
							break;
						case 'S':
							queryFilter = 'sp1.isSomatic = ?';
							break;
						//case 'M':
						//	break;
						//case 'F': TODO Later
						//	break;
						//case 'DF':
						//	break;
						default:
							continue;
					}
					if(firstOne) {
						firstOne = false;
						sql += queryFilter;
					} else {
						sql += " AND " + queryFilter;
					}
					queryParameters.push(params[index][compIndex][key]);
				}
			}
		} else if(index == 'SpellResistance') {
			sql += "sp1.provideResistance = ?";
			queryParameters.push(params[index].indexOf('yes') > -1 ? 1 : 0);
		}
	}
	
	//sql += " GROUP BY sp1.spell_name"
	
	sql += " ORDER BY sp1.spell_name;";
	
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