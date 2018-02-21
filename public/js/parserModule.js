/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.2
 */

/**
 * Allow to split the school of the spell from the subschool and the descriptor if there are some.
 */
function splitSchool(school) {
	// Get the school of the spell
	schoolJSON = {"school": school.replace(/\(.*\)/g,'').replace(/\[.*\]/g,'').replace(/ /g,'') };
	
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
	var componentsArray = components.split(', ');
	var tab = [];
	for (var i = 0, len = componentsArray.length; i<len;i++ ) {
		if (componentsArray[i].includes("M/DF")){
			tab[i]="M/DF";
		} else if (componentsArray[i].includes("DF")) {
			tab[i]="DF";
		} else {
			tab[i]=componentsArray[i].charAt(0);
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
exports.splitSchool = splitSchool;
exports.splitLevel = splitLevel;
exports.splitComponent = splitComponent;
exports.splitRange = splitRange;

exports.JSONConcat = JSONConcat;
