class Classifier {
    _name;
    _xp;

    constructor(name, xp) {
        if(this.constructor == Classifier) {
           throw new Error("Class is of abstract type and can't be instantiated")
        };
        if(this.play == undefined) {
            throw new Error("play method must be implemented")
        };
        this._name = name
        this._xp = xp
    }

    getName() {
        return this._name
    }

    setName(value) {
        this._name = value
    }

    getXP() {
        return this._xp
    }

    setXP(value) {
        this._xp = value
    }

}

module.exports = Classifier