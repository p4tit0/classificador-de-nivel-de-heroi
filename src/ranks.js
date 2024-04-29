const XPLevels = {
    FERRO: { minXP: -Infinity, maxXP: 1000, rankName: "Ferro", format: "\x1b[1;30m" },
    BRONZE: { minXP: 1001, maxXP: 2000, rankName: "Bronze", format: "\x1b[1;31m" },
    PRATA: { minXP: 2001, maxXP: 5000, rankName: "Prata", format: "\x1b[1;32m" },
    OURO: { minXP: 5001, maxXP: 7000, rankName: "Ouro", format: "\x1b[1;33m" },
    PLATINA: { minXP: 7001, maxXP: 8000, rankName: "Platina", format: "\x1b[1;34m" },
    ASCENDENTE: { minXP: 8001, maxXP: 9000, rankName: "Ascendente", format: "\x1b[1;35m" },
    IMORTAL: { minXP: 9001, maxXP: 10000, rankName: "Imortal", format: "\x1b[1;36m" },
    RADIANTE: { minXP: 10001, maxXP: Infinity, rankName: "Radiante", format: "\x1b[1;37m" }
};

function getRank(xp) {
    for (const level in XPLevels) {
        const { minXP, maxXP, rankName, format} = XPLevels[level];
        if (xp >= minXP && xp <= maxXP) {
            return XPLevels[level];
        }
    }
    return null;
}

module.exports = { XPLevels, getRank };