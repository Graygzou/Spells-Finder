-------------------------------------
-- Query used to insert a spell
-------------------------------------

-- If we don't specified first argument null because we want an autoincrement.
INSERT INTO Spell (name, description, provideResistance, isVerbose, isSomatic) VALUES (?, ?, ?, ?, ?);