/*
console.log("Hello, World!");
console.log("I like pizza!");

window.alert("This is an alert box!");
window.alert("I like pizza!");
*/
/*
document.getElementById("myH1").innerHTML = "Hello, World!";
document.getElementById("myP").innerHTML = "I like pizza!";
*/

let numberToGuess = Math.round(Math.random() * 10);
// alert(numberToGuess);
let attempts = 0;

function guessTheNumber() {
    attempts++;
    displayAttempts.innerHTML = "Versuche: " + attempts;
    
    if(numberToGuess == guessInput.value) {
        headLine.innerHTML = "Du hast gewonnen! 👌";

        let jsConfetti = new JSConfetti();
        jsConfetti.addConfetti();
    } else if(numberToGuess > guessInput.value) {
        headLine.innerHTML = "Die gesuchte Zahl ist größer! ⬆️";
    } else {
        headLine.innerHTML = "Die gesuchte Zahl ist kleiner! ⬇️";
    }
    guessInput.value = "";
}