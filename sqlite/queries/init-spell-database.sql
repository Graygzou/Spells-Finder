-------------------------------------
-- Create basic tables
-------------------------------------

-- Class table (Cleric, Wizard, ...)
CREATE TABLE IF NOT EXISTS UserClass (
	class_id INT PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT
);

-- Spell table
CREATE TABLE IF NOT EXISTS Spell (
	spell_id INT PRIMARY KEY,
	school_id INT,
	name TEXT, 
	description TEXT, 
	provideResistance INT,
	isVerbose INT ,
	isSomatic INT,
	CHECK (provideResistance IN (0, 1)),
	CHECK (isVerbose IN (0, 1)),
	CHECK (isSomatic IN (0, 1)),
	FOREIGN KEY (school_id) REFERENCES School (school_id)
);

CREATE TABLE IF NOT EXISTS School (
	school_id INT PRIMARY KEY,
	name TEXT NOT NULL, 
	description TEXT
);

CREATE TABLE IF NOT EXISTS Ingredient (
	ingredient_id INT PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT
);

-- Create "joining tables"
CREATE TABLE IF NOT EXISTS Invoque (
	class_id TEXT,
	spell_id INT,
	spellLevel INT,
	FOREIGN KEY (class_id) REFERENCES UserClass (class_id),
	FOREIGN KEY (spell_id) REFERENCES Spell (spell_id),
	CHECK (spellLevel >= 0 AND spellLevel < 10),
	PRIMARY KEY (class_id, spell_id)
);
					
CREATE TABLE IF NOT EXISTS Need (
	indregient_type TEXT,
	cost INT,
	ingredient_id TEXT,
	spell_id TEXT,
	FOREIGN KEY (ingredient_id) REFERENCES Ingredients (ingredient_id),
	FOREIGN KEY (spell_id) REFERENCES Spell (spell_id),
	PRIMARY KEY (ingredient_id, spell_id)
);