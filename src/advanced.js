const { XPLevels, getRank } = require('./ranks');
const { Enemies } = require('./enemies');
const { time } = require('console');
const readline = require('readline')
const Classifier = require("./classifier");


class Dice {
    #nsides;
    #result;

    constructor(nsides) {
        if(nsides < 1) {
            throw new Error("Number of sides must be positive")
         };
        this.#nsides = nsides
    }

    #wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    #generateRandInt(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    async #clearFrame() {
        process.stdout.moveCursor(0, -18)
        process.stdout.clearScreenDown()
    }

    #frame(isEnemy) {
        process.stdout.write(
`\x1b[1;${isEnemy ? 31 : 39}mRodando um D${this.#nsides}...
                             
                ,:::,
           ,,,:;  :  ;:,,, 
       ,,,:       :       :,,, 
    ,,;...........:...........;,,
    ; ;          ;';          ; ;
    ;  ;        ;   ;        ;  ;
    ;   ;      ;     ;      ;   ;
    ;    ;    ;       ;    ;    ;
    ;     ;  ;   ${this.#result.toString().padStart(2, '0')}    ;  ;     ;
    ;      ;:...........:;      ;
    ;     , ;           ; ,     ;
    ;   ,'   ;         ;   ',   ;
    '';'      ;       ;      ';''
       ''';    ;     ;    ;'''         
           ''':;;   ;;:'''
                ':::'\x1b[0m
`
        )
    }

    async roll(isEnemy) {
        const bounces = this.#generateRandInt(10, 30)
        for (let i = 0; i < bounces; i++){
            if (i != 0) { await this.#clearFrame() }
            this.#result = this.#generateRandInt(1, this.#nsides)
            this.#frame(isEnemy)
            await this.#wait(100);
        }
    }

    getResult() {
        return this.#result
    }

    getNsides() {
        return this.#nsides
    }
}

class AdvancedClassifier extends Classifier {
    #hp = 100;
    #rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    constructor() {
        super("", 0)
    }

    async #startBattle() {
        const keys = Object.keys(Enemies);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        let enemie = {
            display: Enemies[randomKey].display,
            hp: Enemies[randomKey].hp,
            dest: Enemies[randomKey].dest,
            def: Enemies[randomKey].def,
            str: Enemies[randomKey].str,
            xp: Enemies[randomKey].xp
        }
        console.log(`Um(a) ${enemie.display} apareceu!`)

        while (true) {
            const d20 = new Dice(20)
            console.log(`\x1b[1;36mHP:\x1b[22m ${this.#hp}\x1b[0m`)
            console.log("\x1b[1;37mO que você fará agora?\x1b[0m")
            console.log("\x1b[31m1 - atacar\x1b[0m")
            console.log("\x1b[33m2 - examinar\x1b[0m")
            console.log("\x1b[34m3 - fugir\x1b[0m")
            let op = await this.#getLimitedStringInput(`\x1b[1mOpção escolhida:\x1b[0m `, ['1', '2', '3'])

            if (op == 1) {
                await d20.roll()
                let r = d20.getResult()
                let damage = r - enemie.def
                damage = damage < 0 ? 0 : damage

                console.log(`\x1b[32m${enemie.display} sofreu ${damage} de dano!\x1b[0m`)
                enemie.hp -= damage

                if (enemie.hp <= 0) {
                    console.log(`\x1b[32m$Você ganhou ${enemie.xp} de XP!\x1b[0m`)
                    this._xp += enemie.xp
                    break
                }

                await d20.roll(true)
                r = d20.getResult()
                damage = r + enemie.str - 5
                damage = damage < 0 ? 0 : damage
                console.log(`\x1b[31mVocê sofreu ${damage} de dano!\x1b[0m`)
                this.#hp -= damage

                if (this.#hp <= 0) { break }

            } else if (op == 2) {
                console.log("-------------------------------");
                console.log("Nome:", enemie.display);
                console.log("HP:", enemie.hp);
                console.log("Nível de Destreza:", enemie.dest);
                console.log("Nível de Defesa:", enemie.def);
                console.log("Nível de Força:", enemie.str);
                console.log("-------------------------------");
            } else {
                await d20.roll()
                let r = d20.getResult()
                if (r > enemie.dest) {
                    console.log(`\x1b[32mVocê conseguiu escapar!\x1b[0m`)
                    break
                }
                console.log(`\x1b[31mVocê não conseguiu escapar!\x1b[0m`)
                await d20.roll(true)
                r = d20.getResult()
                damage = r - 5
                damage = damage < 0 ? 0 : damage
                console.log(`\x1b[31mVocê sofreu ${damage} de dano!\x1b[0m`)
                this.#hp -= damage

                if (this.#hp <= 0) { break }
            }
        }
        
        return this.#hp > 0
    }

    #displayResult() {
        this.#rl.close();
        let rank = getRank(this._xp)
        console.log(`O Herói de nome \x1b[1m${this._name}\x1b[0m está no nível de ${rank.format}${rank.rankName}\x1b[0m`)
    }

    async #getStringInput(msg) {
        return new Promise((resolve) => {
            this.#rl.question(msg, (response) => {
                resolve(response);
            });
        });
    }

    async #getLimitedStringInput(msg, options) {
        return new Promise(async (resolve) => {
            let r = ''
            while (r.length == 0) {
                let input = await this.#getStringInput(msg)
                if (options.includes(input.toLowerCase())) {
                    r = input.toLowerCase()
                }
            }
            resolve(r);
        });
    }

    async play() {
        console.log('\x1b[1;33mMestre da Guilda:\x1b[22m Olá aventureiro! Como você se chama?\x1b[0m')
        this._name = await this.#getStringInput('\x1b[1m???:\x1b[0m ')
        console.log(`\x1b[1;33mMestre da Guilda:\x1b[22m Bem vindo à gulda de aventureiros ${this._name}!\x1b[0m`)
        console.log(`\x1b[1;33mMestre da Guilda:\x1b[22m Para se registrar como aventureiro precisamos primeiro determinar o seu ranking\x1b[0m`)
        console.log(`\x1b[1;33mMestre da Guilda:\x1b[22m Para isso você precisa entrar naquela dungeon e coletar o máximo de xp possível\x1b[0m`)
        console.log(`\x1b[1;33mMestre da Guilda:\x1b[22m Não se preocupe! caso seu hp chegue a 0 você será teletransportado de volta para cá, mas todo seu xp será perdido\x1b[0m`)
        
        console.log('\x1b[1;33mMestre da Guilda:\x1b[22m E então você quer participar da avaliação? (s/n)\x1b[0m')
        let r = await this.#getLimitedStringInput(`\x1b[1m${this._name}:\x1b[0m `, ['s', 'n'])

        if (r === 'n') {
            console.log('\x1b[1;33mMestre da Guilda:\x1b[22m Você tem certeza? se você não participar você terá que começar do rank mais baixo (s/n)\x1b[0m')
            r = await this.#getLimitedStringInput(`\x1b[1m${this._name}:\x1b[0m `, ['s', 'n'])
            if (r === 's') {
                this.#displayResult()
                return
            }
        }
        
        let last = 0;
        while (true) {
            let currRoom = Math.round(Math.random())
            console.log(`\x1b[1;32mXP:\x1b[22m ${this._xp}\x1b[0m`)
            if (last == 0 || currRoom == 1) {
                const result = await this.#startBattle()
                if (result) {
                    console.log('\x1b[1;33mMestre da Guilda:\x1b[22m Você quer encerrar o teste? (s/n)\x1b[0m')
                    r = await this.#getLimitedStringInput(`\x1b[1m${this._name}:\x1b[0m `, ['s', 'n'])
                    if (r === 's') {
                        break
                    }
                } else {
                    break
                }
            } else {
                console.log('\x1b[1;34mVocê encontrou uma sala vazia!\x1b[0m')
                r = await this.#getLimitedStringInput(`\x1b[1mDescansar (s/n)? \x1b[0m `, ['s', 'n'])
                if (r === 's') {
                    this.#hp += Math.round(Math.random() * 90 + 10);
                    console.log('\x1b[1;34mVocê se sente revigorado!\x1b[0m')
                }
            }
            last = currRoom
            
        }
        this.#displayResult()
    }
}

module.exports = AdvancedClassifier