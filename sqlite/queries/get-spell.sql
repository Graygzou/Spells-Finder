SELECT * 
FROM Spell
	INNER JOIN Invoque 		on Invoque.spell_id = Spell.spell_id
	INNER JOIN UserClass 	on UserClass.class_id = Invoque.class_id
	--INNER JOIN Need 		on Need.spell_id = Spell.spell_id
	--INNER JOIN Ingredient 	on Ingredient.ingredient_id = Need.ingredient_id;
WHERE Spell.provideResistance = ?
	AND	  Spell.isVerbal = ?
	AND	  Spell.isSomatic = ?
	AND	  UserClass.name = ?;
	--AND   Ingredient
	