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
            output.value = `${size} x ${size}`;
            currentSize = size;
            makeGrid(size);
        }
    });
}

function makeGrid(sideSize) {
    if (!sideSize) return;
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
            addHoverListener(currentCell);
        }
    }
}

function addHoverListener(node) {
    let accumulators = [];
    node.addEventListener('mouseover', e => {
        if (clickMode) {
            if (!mouseDown) {
                return;
            }
        }
        switch (currentMode) {
            case 'rainbow':
                paintRainbow(e, accumulators);
                break;
            case 'rtb':
                accumulators = paintRainbowToBlack(e, accumulators);
                break;
            case 'rainbow-fade':
                paintRainbowFade(e, accumulators);
                break;
            case 'single-ink':
                paintCustomInk(e, 'input.current-color');
                break;
            case 'eraser':
                paintCustomInk(e, 'input.current-background');
                break;
        }
    });
}

function paintCustomInk(e, wheel) {
    const node = e.target;
    const color = document.querySelector(wheel).value;
    node.style.backgroundColor = color;
}

function paintRainbow(e) {
    const node = e.target;
    node.style.backgroundColor = `rgb(${getRandom256()}, ${getRandom256()}, ${getRandom256()})`;
}

function paintRainbowToBlack(e, rates) {
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
        r > 0 && (r = r-rRate);
        g > 0 && (g = g-gRate);
        b > 0 && (b = b-bRate);
        node.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
    return [rRate, gRate, bRate];
}

function paintRainbowFade(e) {
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
    currentMode = gameMode;
}

function eraseBoard() {
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
    const singleInkButton = document.querySelector('button#single-ink');
    const rainbowButton = document.querySelector('button#rainbow');
    const rainbowFadeButton = document.querySelector('button#rainbow-fade');
    const rtbButton = document.querySelector('button#rtb');
    const eraserButton = document.querySelector('button#eraser');
    const eraseBoardButton = document.querySelector('button#erase-board');
    createButtonListener(handleClickFlags, clickButton, hoverButton);
    createButtonListener(handleGameModeChange, singleInkButton, rainbowButton, rainbowFadeButton, rtbButton, eraserButton);
    createButtonListener(eraseBoard, eraseBoardButton);
}

function monitorBGColorWheel() {
    const backgroundColorWheel = document.querySelector('input.current-background');
    const grid = document.querySelector('.grid');
    backgroundColorWheel.addEventListener('change', () => (grid, backgroundColorWheel.value));
}

function changeBackgroundColour(grid, colour) {
    grid.style.backgroundColor = colour;
}

function monitorInkColorWheel() {
    const inkColorWheel = document.querySelector('input.current-color');
    inkColorWheel.addEventListener('change', () => handleGameModeChange('single-ink'));
}

function main() {
    monitorSliderValue();
    createAllButtonListeners();
    makeGrid(currentSize, currentMode);
    monitorBGColorWheel();
    monitorInkColorWheel();
}


// Main program;
main();