-------------------------------------
-- Query used to insert a spell
-------------------------------------

-- If we don't specified first argument null because we want an autoincrement.
INSERT INTO Need (name, description, provideResistance, isVerbose, isSomatic) VALUES (?, ?, ?, ?, ?);