/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.2
 */


var parseCurrentSpell = function(divSpell) {
	// init all the fields in case the spell don't cover them.
	var finalSpell = {};
	
	// Extract the title, which is a special case. 
	finalSpell.name = divSpell.find('div.heading').find('p').first().text();

	var pArray = divSpell.find('p.SPDet').toArray();
	
	for(index in pArray) {
		// Get the current p
		var current_p = pArray[index];
		
		// Get the first children of this p
		var child = current_p.children[0];
		
		while(child != null) {
			// If the element is a <b> he's a key.
			if(child.name == 'b') {
				// Get the title
				var libelle = child.children[0].data.toLowerCase();
				
				// Get the corresponding value
				value = child.next.data.substring(1);
				switch(libelle) {
					case "school":
						console.log(child.next.data)
						finalSpell = JSONConcat(finalSpell, [splitSchool(value)]);
						break;
					case "level":
						finalSpell = JSONConcat(finalSpell, [splitLevel(value)]);
						break;
					case "casting time":
						// Remove the first space
						finalSpell.CastingTime = value;
					case "components":
						console.log(value);
						finalSpell = JSONConcat(finalSpell, [splitComponent(value)]);
						break;
					case "range":
						finalSpell = JSONConcat(finalSpell, [splitRange(value)]);
						break;
					case "effect":
						finalSpell.effect = value;
						break;
					case "duration":
						finalSpell.duration = value;
						break;
					case "saving throw":
						finalSpell.SavingThrow = value;
						break;
					case "spell resistance":
						// Remove the first space
						finalSpell.SpellResistance = value;
						break;
					default:
						console.log(libelle + " not found.")
						break;
				}
			}
			
			// update the child with the next one (we skip the value between them).
			child = child.next.next;
		}
	}
	
	// Extract the description of the spell
	finalSpell.description = divSpell.find('div.SPDesc').find('p').first().text();
	
	// Fill the empty fields with dummy value.
	finalSpell = checkSpell(finalSpell);
	
	console.log(finalSpell);
	
	// Return the final JSON of the spell
	return finalSpell;
}


// -------------------------------------------
// PRIVATE FUNCTIONS
// -------------------------------------------


function checkSpell(finalSpell) {
	var fields = ["name", "school", "subschool", "descriptor", "levels", "CastingTime",
					"components", "range", "effect",  "duration", "SavingThrow", "SpellResistance",
					"description"];
	fields.forEach(function(elem) {
		if(finalSpell[elem] == undefined) {
			finalSpell[elem] = '';
		}
	});
	
	return finalSpell;
}


/**
 * Allow to split the school of the spell from the subschool and the descriptor if there are some.
 */
function splitSchool(school) {
	// Get the school of the spell
	// Remove ';' and ' ' and text in parentheses and brackets.
	schoolJSON = {"school": school.replace(/;|\(.*\)|\[.*\]| /g,'') };
	
	if (school.match("\( | \)| \[ | \]")) {
		// Retrieve the subschool
		var subschool = splitContainer(school, '(', ')', '');
		// Retrieve the descriptor
		var descriptor = splitContainer(school, '[', ']', '');
		// Merge the final result
		schoolJSON = JSONConcat(schoolJSON, [
			{"subschool": subschool}, 
			{"descriptor": descriptor}
		]);
	}
	return schoolJSON;
}

function splitLevel(level) {
	levelJSON = {};
	var levelsArray = level.split(', ');
	tab = [];
	for (var i = 0, len = levelsArray.length; i<len; i++) {
		var id = levelsArray[i].split(' ');
		// Check if there is no mistakes
		if(id.length == 2) {
			// In the case we have multiple classes seperate by a '/'
			if(id[0].indexOf('/') != -1) {
				var classes = id[0].split('/');
				for (var j = 0; j < classes.length; j++) {
					var json = {
						'class': classes[j],
						'level': id[1]
					};
					tab.push(json);
				}
			} else {
				var json = {
					'class': id[0],
					'level': id[1]
				};
				tab.push(json);
			}
		}
	}
	levelJSON["levels"] = tab;
	return levelJSON;
}

function splitComponent(components) {
	var componentsJSON = {};
	// First, remove useless parentheses and spaces.
	var components = components.replace(/\(.*\)/g,'').replace(/ /g,'');
	// then split
	var componentsArray = components.split(',');
	var tab = [];
	for (var i = 0, len = componentsArray.length; i<len; i++) {
		if (componentsArray[i].includes("M/DF")){
			tab[i]="M/DF";
		} else if (componentsArray[i].includes("DF")) {
			tab[i]="DF";
		} else {
			tab[i]=componentsArray[i];
		}
	}
	componentsJSON["components"] = tab;
	return componentsJSON
}

function splitRange(range) {
	var rangeJSON = {};
	var rangeArray = range.split(' ');
	rangeJSON["range"] = rangeArray[0];
	return rangeJSON;
}

/**
 * TODO later
 */
 /*
function splitComponents(components) {
	var arr = components.split(",").map(function (val) {
		materials = '';
		if(var val.indexOf('M') > -1) {
			// Retrieve materials for the spell
			var materials = splitParenthesis(val, "and|plus");
		}
		return val + ": " + materials + 1;
	});
	
	return arr
}*/

/**
 * Allow to merge properties of many JSON objects into one.
 * @param {object} mainValue - JSON object that will contains all the properties.
 * @param {array<object>} properties - JSON objects with properties.
 */
function JSONConcat(mainValue, properties) {
	// For each subcategorie we want to add.
	properties.forEach(function(elem) {
		for (var key in elem) {
			mainValue[key] = elem[key];
		}
	});
	return mainValue;
}

// ---------------------------------------------------------------
// PRIVATE FUNCTIONS
// ---------------------------------------------------------------

/**
 * 
 */
function splitContainer(line, leftContainer, rightContainer, regexp) {
	if (line.indexOf(leftContainer) > -1 && line.indexOf(rightContainer) > -1) {
		var substring = line.substring(line.indexOf(leftContainer)+1, line.indexOf(rightContainer));
		if (regexp != '') {
			var objects =  substring.split(regexp).map( function (val) {
				return val + 1;
			});
		} else {
			var objects = substring;
		}
	}
	return objects;
}

// Export module functions
exports.parseCurrentSpell = parseCurrentSpell;
