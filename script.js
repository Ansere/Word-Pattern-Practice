let words = new Map();
let lastWord = "";
let answered = false

document.addEventListener("DOMContentLoaded", () => {
    console.log(getPattern("away"))
    jQuery.get('https://raw.githubusercontent.com/Ansere/Word-Pattern-Practice/main/words.txt', function(data) {
        let wordArr = data.toLowerCase().split("\n")
        wordArr.forEach(function(word) {
            if (word === "" || word === undefined || word === NaN) {
                return
            }
            let pattern = getPattern(word) 
            if (words.has(pattern)) {
                words.get(pattern).push(word)
            } else {
                words.set(pattern, [word])
            }
        });
        nextWord()
    }, 'text');
    $("input").on('keyup', function (e) {
        if ((e.key === 'Enter' || e.keyCode === 13) && !answered) {
            document.getElementById("answer_label").innerText = ((lastWord.includes(document.getElementById("input").value.toLowerCase())) ? "Correct! The word was "  : "Incorrect, the word was ") + lastWord.join(", ")
            document.getElementById("input").value = ""
            nextWord()
        }
    });
})

function nextWord(){
    let ciphertext = document.getElementById("ciphertext")
    let keys = Array.from(words.keys()).map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)
    let key = keys.pop()
    let word = words.get(key);
    console.log(words)
    while (lastWord === word) {
        key = keys.pop()
        word = words.get(key);
    }
    lastWord = word
    ciphertext.innerText = encrypt(word[0])
}

function encrypt(word){
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)
    let cipher = []
    for (let i = 0; i < word.length; i++){
        cipher[i] = ""
    }
    for (let i = 0; i < cipher.length; i++){
        if (!"abcdefghijklmnopqrstuvwxyz".includes(word.substring(i, i + 1)) || cipher[i] !== "") {
            continue
        }
        let letter = letters.pop()
        while (letter.toLowerCase() === word.substring(i, i + 1)) {
            letters.push(letter)
            letters = letters.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)
            letter = letters.pop()
        }
        for (let j = i; j < cipher.length; j++) {
            if (word.substring(j, j + 1) === word.substring(i, i+1)) {
                cipher[j] = letter
            }
        }
    }
    return cipher.join("")
}

function getPattern(word){
    let letters = "ZYXWVUTSRQPONMLKJIHGFEDCBA".split("")
    let cipher = []
    for (let i = 0; i < word.length; i++){
        cipher[i] = ""
    }
    for (let i = 0; i < cipher.length; i++){
        if (!"abcdefghijklmnopqrstuvwxyz".includes(word.substring(i, i + 1)) || cipher[i] !== "") {
            continue
        }
        let letter = letters.pop()
        for (let j = i; j < cipher.length; j++) {
            if (word.substring(j, j + 1) === word.substring(i, i+1)) {
                cipher[j] = letter
            }
        }
    }
    return cipher.join("").toLowerCase()
}
