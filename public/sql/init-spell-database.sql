-- Create basic tables
CREATE TABLE Class (name TEXT PRIMARY KEY);
CREATE TABLE Spell (name TEXT, 
					description TEXT, 
					provideResistance INT,
					isVerbose INT ,
					isSomatic INT,
					CHECK (provideResistance IN (0, 1)),
					CHECK (isVerbose IN (0, 1)),
					CHECK (isSomatic IN (0, 1)),
					PRIMARY KEY (name));
CREATE TABLE School (name TEXT, description TEXT);
CREATE TABLE Ingredients (name TEXT PRIMARY KEY, description TEXT);

-- Create "joining tables"
CREATE TABLE Use (level INT,
					class_name TEXT,
					spell_name TEXT,
					FOREIGN KEY (class_name) REFERENCES Class (name),
					FOREIGN KEY (spell_name) REFERENCES Spell (name),
					PRIMARY KEY (class_name, spell_name),
					CHECK (level >= 0 AND level < 10));
CREATE TABLE Need (type TEXT,
					scost INT,
					ingredient_name TEXT,
					spell_name TEXT,
					FOREIGN KEY (ingredient_name) REFERENCES Ingredients (name),
					FOREIGN KEY (spell_name) REFERENCES Spell (id),
					PRIMARY KEY (ingredient_name, spell_name));