"use strict";
const debounce = (callback, delay = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(args), delay);
    };
};
// Handling the different options depending on the size of the window:
let width = 2000;
let maxBars = 400;
const getMaxBars = () => (Math.floor(width / 5));
const optionsSetter = () => {
    width = window.innerWidth;
    const windowWidthQuery = document.getElementsByClassName("window-width");
    if (windowWidthQuery.length > 0) {
        const windowWidthElement = windowWidthQuery[0];
        windowWidthElement.innerHTML = `Width: ${width}`;
    }
    maxBars = getMaxBars();
    const maxBarsQuery = document.getElementsByClassName("max-bars");
    if (maxBarsQuery.length > 0) {
        const maxBarsElement = maxBarsQuery[0];
        maxBarsElement.innerHTML = `Max Bars: ${maxBars}`;
    }
};
document.addEventListener("DOMContentLoaded", () => {
    optionsSetter();
});
const setNewWidth = () => {
    optionsSetter();
    generateBars();
};
// const changeWidth = (): Function => debounce();
// const changeWidth = (): Function => debounce(() => setNewWidth());
window.addEventListener("resize", 
// TODO: Look into this error
debounce(() => setNewWidth(), 250));
const getRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};
const getBars = () => {
    maxBars = getMaxBars();
    return Array.from({ length: getRandomNumberBetween(1, maxBars) }, (x) => {
        const barHeight = getRandomNumberBetween(1, maxBars);
        const barHeightPercentOfViewport = barHeight / maxBars * 100;
        return {
            barHeight,
            barHeightPercentOfViewport
        };
    });
};
const styler = (element, style) => {
    for (const styleProperty in style) {
        // TODO: figure out this issue
        element.style[styleProperty] = style[styleProperty];
    }
    return element;
};
const styleObj = {
    'background-color': 'blue',
    'color': 'red'
};
const visualizerContainerQuery = document.getElementsByClassName("visualizer-container");
const setTotalBarsMetric = (totalBars) => {
    const totalBarsQuery = document.getElementsByClassName("total-bars");
    if (totalBarsQuery.length > 0) {
        const totalBarsElement = totalBarsQuery[0];
        totalBarsElement.innerHTML = `Total Bars: ${totalBars}`;
    }
};
const generateBars = () => {
    if (visualizerContainerQuery.length > 0) {
        const visualizerContainer = visualizerContainerQuery[0];
        // Clear all of the bars that might be there from a previous run
        visualizerContainer.innerHTML = "";
        // // Put the "Generate Bars" button on the DOM which randomly generates a set of bars
        // visualizerContainer?.appendChild(placeGenerateBarsButton());
        const bars = getBars();
        bars.forEach(({ barHeight, barHeightPercentOfViewport }) => {
            // Create the bar div element
            const bar = document.createElement('div');
            bar.className = "bar";
            // Let's make this a tooltip because text doesn't look great at this pixel width
            // bar.innerHTML = `${barHeight}`;
            // Style it
            const styledDiv = styler(bar, styleObj);
            styledDiv.style.height = `${barHeightPercentOfViewport}%`;
            styledDiv.style.minWidth = "5px";
            visualizerContainer === null || visualizerContainer === void 0 ? void 0 : visualizerContainer.appendChild(styledDiv);
        });
        setTotalBarsMetric(bars.length);
    }
};
