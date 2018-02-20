-------------------------------------
-- Query used to insert a spell
-------------------------------------

-- spellLevel : Inside the json file, inside the "levels" key.
-- class_name : Inside the json file, inside the "levels" key.
-- spell_name : obtains by adding the spell before this query
INSERT INTO Invoque (spellLevel, class_name, spell_name) VALUES (?, ?, ?);