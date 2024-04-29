const Enemies = {
    SKELETON: {
        display: "Esqueleto",
        hp: 50,
        dest: 2,
        def: 1,
        str: 2,
        xp: 700
    },
    ORC: {
        display: "Orc",
        hp: 80,
        dest: 1,
        def: 2,
        str: 3,
        xp: 1000
    },
    GOBLIN: {
        display: "Goblin",
        hp: 20,
        dest: 3,
        def: 1,
        str: 1,
        xp: 300
    },
    DRAGAO: {
        display: "Dragão",
        hp: 150,
        dest: 14,
        def: 5,
        str: 5,
        xp: 5000
    },
    LICH: {
        display: "Lich",
        hp: 50,
        dest: 5,
        def: 2,
        str: 4,
        xp: 700
    },
    DEMONIO: {
        display: "Demônio",
        hp: 100,
        dest: 10,
        def: 4,
        str: 4,
        xp: 3000
    },
    HOMUNCULUS: {
        display: "Humanoide",
        hp: 30,
        dest: 2,
        def: 2,
        str: 2,
        xp: 450
    }
};

module.exports = { Enemies };