/**
 * @author : Grégoire Boiron <gregoire.boiron@gmail.com>
 * @version : 0.1.0
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
		schoolJSON = jsonConcat(schoolJSON, [
			{"subschool": subschool}, 
			{"descriptor": descriptor}
		]);
	}
	return schoolJSON;
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

// Export module functions
exports.splitSchool = splitSchool;

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

/**
 *
 */
function jsonConcat(mainValue, properties) {
	// For each subcategorie we want to add.
	properties.forEach(function(elem) {
		for (var key in elem) {
			mainValue[key] = elem[key];
		}
	});
	return mainValue;
}