function manageMainSlider() {
    const slider = document.querySelector('input.changeSize');
    const output = document.querySelector('.output');
    let size;
    slider.addEventListener('change', function () {
        size = slider.value; 
        if (size <= 100) {
            output.value = size;
            makeGrid(size);
        }
    });
}

function makeGrid(sideSize) {
    if (!sideSize) return;
    const container = document.querySelector('.container');

    removeChildren(container);
    let horizontalDiv;
    let currentCell;

    for (i = 0; i < sideSize; i++) {
        horizontalDiv = document.createElement('div');
        horizontalDiv.classList.add('horizontal');
        container.appendChild(horizontalDiv);
        for (j = 0; j < sideSize; j++) {
            currentCell = document.createElement('div');
            currentCell.classList.add('gridCell');
            horizontalDiv.appendChild(currentCell);
            addHoverListener(currentCell);
        }
    }
}

function addHoverListener(node) {
    let nodeColour;
    let r, g, b;
    let rRate, gRate, bRate;
    node.addEventListener('mouseover', function () {
        // Rainbow to black
        if (!nodeColour) {
            r = getRandom256();
            g = getRandom256();
            b = getRandom256();
            node.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            nodeColour = node.style.backgroundColor;
            rRate = r/10;
            gRate = g/10;
            bRate = b/10;
            return;
        }
        r <= 0 || (r = (r-rRate).toFixed(1));
        g <= 0 || (g = (g-gRate).toFixed(1));
        b <= 0 || (b = (b-bRate).toFixed(1));
        node.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        console.log(r, g, b);
    });
}

function getRandom256() {
    return getRandomInteger(0, 256);
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function removeChildren(parent) {
    let child = parent.firstElementChild;
    while (child) {
        parent.removeChild(child);
        child = parent.firstElementChild;
    }
}

function main() {
    manageMainSlider();
    makeGrid(16);
}


// Main program;
main();