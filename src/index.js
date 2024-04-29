const SimpleClassifier = require("./simple");
const AdvancedClassifier = require("./advanced");
const readline = require('readline')

rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getStringInput(msg) {
    return new Promise((resolve) => {
        this.rl.question(msg, (response) => {
            resolve(response);
        });
    });
}

async function getLimitedStringInput(msg, options) {
    return new Promise(async (resolve) => {
        let r = ''
        while (r.length == 0) {
            let input = await getStringInput(msg)
            if (options.includes(input.toLowerCase())) {
                r = input.toLowerCase()
            }
        }
        resolve(r);
    });
}

console.log('Qual classificador você deseja executar?')
console.log('1 - simples')
console.log('2 - interativo')
getLimitedStringInput('Opção escolhida: ', ['1', '2']).then( (op) => {
    let classifier
    if (op == 1) {
        getStringInput('\x1b[1;33mComo você se chama?\x1b[0m ').then( (name) => {
            getStringInput('\x1b[1;33mQuanto de xp você tem?\x1b[0m ').then( (xp) => {
                rl.close();
                classifier = new SimpleClassifier(name, Number(xp))
                classifier.play()
            })
        })
        
    } else {
        rl.close();
        classifier = new AdvancedClassifier()
        classifier.play()
    }
    
})
