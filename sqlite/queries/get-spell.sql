SELECT DISTINCT sp1.spell_name,
         sp1.school_name,
         spellLevel,
         isVerbose,
         isSomatic,
         provideResistance
FROM Spell AS sp1
INNER JOIN Invoque
    ON Invoque.spell_name = sp1.spell_name
INNER JOIN School
    ON School.school_name = sp1.school_name
INNER JOIN UserClass
    ON UserClass.class_name = Invoque.class_name
WHERE 0 = 
    (SELECT count(*)
    FROM Ingredients AS ing
    INNER JOIN Need
        ON Need.ingredient_name = ing.ingredient_name
    INNER JOIN Spell
        ON Spell.spell_name = Need.spell_name
    WHERE Spell.spell_name = sp1.spell_name)