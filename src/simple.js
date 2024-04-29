const { XPLevels, getRank } = require('./ranks.js');
const Classifier = require("./classifier");

class SimpleClassifier extends Classifier {
    constructor(name, xp) {
        super(name, xp)
    }

    play() {
        let rank = getRank(this._xp)
        console.log(`O Herói de nome \x1b[1m${this._name}\x1b[0m está no nível de ${rank.format}${rank.rankName}\x1b[0m`)
    }
}

module.exports = SimpleClassifier