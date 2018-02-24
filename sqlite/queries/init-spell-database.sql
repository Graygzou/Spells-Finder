-------------------------------------
-- Create basic tables
-------------------------------------

-- Reset the database schema
DROP TABLE IF EXISTS UserClass;
DROP TABLE IF EXISTS Spell;
DROP TABLE IF EXISTS School;
DROP TABLE IF EXISTS Ingredient;
DROP TABLE IF EXISTS Invoque;				
DROP TABLE IF EXISTS Need;

-- Class table (Cleric, Wizard, ...)
CREATE TABLE IF NOT EXISTS UserClass (
	class_name TEXT PRIMARY KEY,
	description TEXT
);

-- Spell table
CREATE TABLE IF NOT EXISTS Spell (
	spell_name TEXT PRIMARY KEY,
	school_name TEXT,
	description TEXT, 
	provideResistance INTEGER,
	isVerbose INTEGER,
	isSomatic INTEGER,
	CHECK (provideResistance IN (0, 1)),
	CHECK (isVerbose IN (0, 1)),
	CHECK (isSomatic IN (0, 1)),
	FOREIGN KEY (school_name) REFERENCES School (school_name)
);

CREATE TABLE IF NOT EXISTS School (
	school_name TEXT PRIMARY KEY,
	description TEXT
);

CREATE TABLE IF NOT EXISTS Ingredient (
	ingredient_name TEXT PRIMARY KEY,
	description TEXT
);

-- Create "joining tables"
CREATE TABLE IF NOT EXISTS Invoque (
	class_name TEXT,
	spell_name TEXT,
	spellLevel INTEGER,
	FOREIGN KEY (class_name) REFERENCES UserClass (class_name),
	FOREIGN KEY (spell_name) REFERENCES Spell (spell_name),
	CHECK (spellLevel >= 0 AND spellLevel < 10),
	PRIMARY KEY (class_name, spell_name, spellLevel)
);
					
CREATE TABLE IF NOT EXISTS Need (
	ingredient_name TEXT,
	spell_name TEXT,
	ingredient_type TEXT,
	cost INTEGER,
	FOREIGN KEY (ingredient_name) REFERENCES Ingredients (ingredient_name),
	FOREIGN KEY (spell_name) REFERENCES Spell (spell_name),
	PRIMARY KEY (ingredient_name, spell_name)
);