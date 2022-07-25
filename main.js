let clickMode = false;
let mouseDown = false;
let currentMode = 'rainbow';
let currentSize = 16;

function monitorSliderValue() {
    const slider = document.querySelector('input.slider');
    const output = document.querySelector('.output');
    let size;
    slider.addEventListener('change', function () {
        size = slider.value; 
        if (size <= 100) {
            output.value = size;
            currentSize = size;
            makeGrid(size, currentMode);
        }
    });
}

function makeGrid(sideSize, mode) {
    if (!sideSize) return;
    currentMode = mode;
    const grid = document.querySelector('.grid');

    removeChildren(grid);
    let horizontalDiv;
    let currentCell;

    for (i = 0; i < sideSize; i++) {
        horizontalDiv = document.createElement('div');
        horizontalDiv.classList.add('row');
        grid.appendChild(horizontalDiv);
        for (j = 0; j < sideSize; j++) {
            currentCell = document.createElement('div');
            currentCell.classList.add('gridCell');
            horizontalDiv.appendChild(currentCell);
            addHoverListener(currentCell, mode);
        }
    }
}

function addHoverListener(node, mode) {
    let accumulators = [];
    node.addEventListener('mouseover', e => {
        if (clickMode) {
            if (!mouseDown) {
                return;
            }
        }
        switch (mode) {
            case 'rainbow':
                rainbow(e, accumulators);
                break;
            case 'rtb':
                accumulators = rainbowToBlack(e, accumulators);
                break;
            case 'rainbow-fade':
                rainbowFade(e, accumulators);
                break;
            default:
                customInk(e, mode);
        }
    });
}

function customInk(e, color) {
    const node = e.target;
    node.style.backgroundColor = color;
}

function rainbow(e) {
    const node = e.target;
    node.style.backgroundColor = `rgb(${getRandom256()}, ${getRandom256()}, ${getRandom256()})`;
}

function rainbowToBlack(e, rates) {
    const node = e.target;
    let r, g, b, rRate, gRate, bRate;
    const rgbValues = getBackgroundColorPart(node, "r", "g", "b");
    if (!rgbValues) {
        r = getRandom256();
        g = getRandom256();
        b = getRandom256();
        node.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        rRate = r/10;
        gRate = g/10;
        bRate = b/10;
    }
    else {
        [rRate, gRate, bRate] = rates;
        [r, g, b] = rgbValues;
        r > 0 && (r = (r-rRate).toFixed(1));
        g > 0 && (g = (g-gRate).toFixed(1));
        b > 0 && (b = (b-bRate).toFixed(1));
        node.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
    return [rRate, gRate, bRate];
}

function rainbowFade(e) {
    const node = e.target;
    const alphaValue = getBackgroundColorPart(node, "a");
    node.style.backgroundColor = `rgba(${getRandom256()}, ${getRandom256()}, ${getRandom256()}, ${alphaValue < 1 ? +alphaValue + 0.1 : 1})`;
}

function getBackgroundColorPart(node, ...parts) {
    let backgroundColor = node.style.backgroundColor;
    if (!backgroundColor) return null;
    backgroundColor = backgroundColor.slice(backgroundColor.indexOf('(') + 1, backgroundColor.indexOf(')'));
    const individualColorParts = backgroundColor.split(",");
    let returnValues = [];
    parts.forEach(part => {
        switch (part) {
            case "r":
                returnValues.push(individualColorParts[0]);
                break;
            case "g":
                returnValues.push(individualColorParts[1]);
                break;
            case "b":
                returnValues.push(individualColorParts[2]);
                break;
            case "a":
                returnValues.push(individualColorParts[3]);
                break;
            default:
                returnValues.push(null);
        }
    });
    return returnValues;
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

function handleClickFlags(buttonType) {
    switch (buttonType) {
        case 'click':
            clickMode = true;
            document.body.onmousedown = () => mouseDown = true;
            document.body.onmouseup = () => mouseDown = false;
            break;
        case 'hover':
            clickMode = false;
            mouseDown = false;
            break;
    }
}

function handleGameModeChange(gameMode) {
    const currentMode = gameMode;
    makeGrid(currentSize, currentMode);
}

function createButtonListener(listenerFunction, ...buttons) {
    buttons.forEach(button => {
        button.addEventListener('click', () => listenerFunction(button.getAttribute('id')));
    });
}

function createAllButtonListeners() {
    const clickButton = document.querySelector('button#click');
    const hoverButton = document.querySelector('button#hover');
    const rainbowButton = document.querySelector('button#rainbow');
    const rainbowFadeButton = document.querySelector('button#rainbow-fade');
    const rtbButton = document.querySelector('button#rtb');
    createButtonListener(handleClickFlags, clickButton, hoverButton);
    createButtonListener(handleGameModeChange, rainbowButton, rainbowFadeButton, rtbButton);
}

function monitorBGColorWheel() {
    const backgroundColorWheel = document.querySelector('input.change-background');
    const grid = document.querySelector('.grid');
    backgroundColorWheel.addEventListener('change', () => changeBackgroundColour(grid, backgroundColorWheel.value));
}

function changeBackgroundColour(grid, colour) {
    grid.style.backgroundColor = colour;
}

function monitorInkColorWheel() {
    const inkColorWheel = document.querySelector('input.change-ink');
    inkColorWheel.addEventListener('change', () => makeGrid(currentSize, inkColorWheel.value));
} 

function main() {
    monitorSliderValue();
    createAllButtonListeners();
    makeGrid(16, currentMode);
    monitorBGColorWheel();
    monitorInkColorWheel();
    // Erase board
    // Custom slider
}


// Main program;
main();