SELECT DISTINCT sp1.spell_name,
         sp1.school_name,
         Invoque.spellLevel,
         sp1.isVerbose,
         sp1.isSomatic,
         sp1.provideResistance
FROM Spell AS sp1
INNER JOIN Invoque
    ON Invoque.spell_name = sp1.spell_name
INNER JOIN School
    ON School.school_name = sp1.school_name
INNER JOIN UserClass
    ON UserClass.class_name = Invoque.class_name
WHERE 0 = 
    (SELECT count(*)
    FROM Ingredient AS ing
    INNER JOIN Need AS n1
        ON n1.ingredient_name = ing.ingredient_name
    INNER JOIN Spell AS sp2
        ON sp2.spell_name = n1.spell_name
    WHERE sp2.spell_name = sp1.spell_name)
	
/*
SELECT DISTINCT sp1.spell_name, n1.ingredient_type
FROM Spell AS sp1
INNER JOIN Need AS n1
	ON n1.spell_name = sp1.spell_name
INNER JOIN Ingredient AS ing1
	ON ing1.ingredient_name = n1.ingredient_name*/
