const decrementButton = document.getElementById('decrement');
const incrementButton = document.getElementById('increment');
const resetButton = document.getElementById("reset");
const counter = document.querySelector('h3');

let count = 0;

decrementButton.onclick = () => {
    count--;
    counter.textContent = count;
};

incrementButton.onclick = () => {
    count++;
    counter.textContent = count;
};

resetButton.onclick = () => {
    count = 0;
    counter.textContent = count;
};