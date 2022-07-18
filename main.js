/*
16 divs horizontally
16 divs in each said div 
*/


const container = document.querySelector('.container');

let horizontalDiv;
let currentCell;

for (i = 0; i < 16; i++) {
    horizontalDiv = document.createElement('div');
    horizontalDiv.classList.add('horizontal');
    container.appendChild(horizontalDiv);
    for (j = 0; j < 16; j++) {
        currentCell = document.createElement('div');
        currentCell.classList.add('gridCell');
        horizontalDiv.appendChild(currentCell);
    }
}