var _a, _b, _c, _d, _e;
import Visualizer from "./visualizer.js";
import { bubbleSort, mergeSort, quickSort, selectionSort } from "./sorts.js";
const BUBBLE_SORT_NAME = 'bubbleSort';
const MERGE_SORT_NAME = 'mergeSort';
const QUICK_SORT_NAME = 'quickSort';
const SELECTION_SORT_NAME = 'selectionSort';
let visualizer = null;
const visualizerDomElement = document.getElementById('visualizer');
const generateNewBarsButton = document.getElementById('generate-bars');
const resetBarsButton = document.getElementById('reset-bars');
const darkModeToggle = document.getElementById('dark-mode');
const slider = document.getElementById('sort-speed');
const speedDescription = document.getElementById('sort-speed-description');
const debounce = (callback, delay = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(args), delay);
    };
};
const hasBars = () => {
    if (visualizer) {
        return visualizer.hasBars();
    }
    console.log("Visualizer is null");
    return false;
};
const isSorted = () => {
    if (visualizer) {
        return visualizer.isSorted();
    }
    console.log("Visualizer is null");
    return false;
};
// Generating and resetting bars
const generateBars = () => {
    if (visualizer) {
        const numberOfBars = visualizer.generateBars();
        writeMetric({ metric: numberOfBars, metricClassName: "total-bars", metricTitle: "Total Bars" });
    }
    else {
        alert("Visualizer is null");
    }
};
const generateNewBars = () => {
    if (!isSorted()) {
        generateBars();
        setSortingCapability({ allowSorting: true });
    }
    else {
        console.log("Sorted!");
    }
};
const resetBars = () => {
    if (isSorted()) {
        resetVisualizerBars();
        setSortingCapability({ allowSorting: true });
    }
    else {
        console.log("Already reset");
    }
};
const resetVisualizerBars = () => {
    if (visualizer) {
        visualizer.resetBars();
    }
    else {
        alert("Visualizer is null");
    }
};
/////////////////////////////////////
const enableResetButton = () => {
    resetBarsButton.removeAttribute("disabled");
};
// Running the sorts
const getAlgorithm = ({ algorithmName }) => {
    switch (algorithmName) {
        case BUBBLE_SORT_NAME:
            return bubbleSort;
        case MERGE_SORT_NAME:
            return mergeSort;
        case QUICK_SORT_NAME:
            return quickSort;
        case SELECTION_SORT_NAME:
            return selectionSort;
        default:
            return null;
    }
};
const runSort = ({ algorithmName }) => {
    const algorithm = getAlgorithm({ algorithmName });
    if (visualizer && algorithm) {
        visualizer.sort({ algorithm, callback: enableResetButton });
        setSortingCapability({ allowSorting: false });
    }
    else {
        console.log("We've had a problem :/");
    }
};
///////////////////////////////////////////////////
// Front end viewing options
const setMaxBars = () => {
    const width = window.innerWidth;
    const maxBars = Math.floor(width / 3);
    if (visualizer) {
        visualizer.setMaxBars({ maxBars });
        writeMetric({ metric: width, metricClassName: "window-width", metricTitle: "Width" });
        writeMetric({ metric: maxBars, metricClassName: "max-bars", metricTitle: "Max Bars" });
    }
    else {
        alert("Visualizer is null");
    }
};
const setVisualizer = () => {
    const visualizerContainerQuery = document.getElementsByClassName("visualizer-container");
    visualizer = new Visualizer({ visualizerContainerQuery });
    setMaxBars();
    return visualizer;
};
const getSpeedLevelFromValue = ({ value }) => {
    if (value < 1200) {
        return "Slowest";
    }
    else if (value < 1400) {
        return "Slower";
    }
    else if (value < 1600) {
        return "Normal";
    }
    else if (value < 1800) {
        return "Faster";
    }
    else {
        return "Fastest";
    }
};
const setSpeedDescription = (range, speedDescription) => {
    const value = parseInt(range.value);
    speedDescription.innerHTML = getSpeedLevelFromValue({ value });
};
const setSortDelay = (e) => {
    console.log("slide value", e.target.value);
    const value = parseInt(e.target.value);
    if (!isNaN(value) && visualizer) {
        const sortDelay = 2000 - value;
        visualizer.setSortDelay({ sortDelay });
    }
    else {
        alert("Visualizer is null");
    }
};
const setDarkMode = (e) => {
    if (visualizerDomElement && e.target) {
        if (e.target.checked) {
            visualizerDomElement.classList.remove("light-mode");
        }
        else {
            visualizerDomElement.classList.add("light-mode");
        }
    }
    else {
        console.log("Visualizer DOM element not found");
    }
};
const setSortingCapability = ({ allowSorting }) => {
    const sortElementIds = [
        "bubble-sort",
        "merge-sort",
        "quick-sort",
        "selection-sort",
    ];
    const buttons = sortElementIds.map(id => document.getElementById(id));
    if (!hasBars()) {
        alert("no bars to sort");
        return;
    }
    if (allowSorting) {
        toggleBarButtons({ canGenerateBars: true });
        buttons.forEach(button => button && button.removeAttribute("disabled"));
    }
    else {
        toggleBarButtons({ canGenerateBars: false });
        buttons.forEach(button => button && button.setAttribute("disabled", "disabled"));
        resetBarsButton === null || resetBarsButton === void 0 ? void 0 : resetBarsButton.setAttribute("disabled", "disabled");
    }
};
const toggleBarButtons = ({ canGenerateBars }) => {
    if (canGenerateBars) {
        resetBarsButton === null || resetBarsButton === void 0 ? void 0 : resetBarsButton.setAttribute("hidden", "true");
        generateNewBarsButton === null || generateNewBarsButton === void 0 ? void 0 : generateNewBarsButton.removeAttribute("hidden");
    }
    else {
        generateNewBarsButton === null || generateNewBarsButton === void 0 ? void 0 : generateNewBarsButton.setAttribute("hidden", "true");
        resetBarsButton === null || resetBarsButton === void 0 ? void 0 : resetBarsButton.removeAttribute("hidden");
    }
};
//////////////////////////////////////////////////////////////
// Writes the metrics to the screen
const writeMetric = ({ metric, metricClassName, metricTitle }) => {
    if (metric) {
        const query = document.getElementsByClassName(metricClassName);
        if (query.length > 0) {
            const element = query[0];
            element.innerHTML = `${metricTitle}: ${metric}`;
        }
    }
    else {
        alert(`${metricTitle} is null`);
    }
};
//////////////////////////////////////////////////////////////
// Attach functions to the DOM 
document.addEventListener("DOMContentLoaded", () => {
    visualizer = setVisualizer();
    generateBars();
    setSortingCapability({ allowSorting: true });
});
generateNewBarsButton === null || generateNewBarsButton === void 0 ? void 0 : generateNewBarsButton.addEventListener("click", () => generateNewBars());
resetBarsButton === null || resetBarsButton === void 0 ? void 0 : resetBarsButton.addEventListener("click", () => resetBars());
darkModeToggle === null || darkModeToggle === void 0 ? void 0 : darkModeToggle.addEventListener("click", (e) => setDarkMode(e));
slider.addEventListener("mouseup", (e) => setSortDelay(e));
slider.addEventListener("touchend", (e) => setSortDelay(e));
(_a = document.getElementById('bubble-sort')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => runSort({ algorithmName: BUBBLE_SORT_NAME }));
(_b = document.getElementById('merge-sort')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => runSort({ algorithmName: MERGE_SORT_NAME }));
(_c = document.getElementById('quick-sort')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => runSort({ algorithmName: QUICK_SORT_NAME }));
(_d = document.getElementById('selection-sort')) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => runSort({ algorithmName: SELECTION_SORT_NAME }));
(_e = document.getElementById('sort-speed')) === null || _e === void 0 ? void 0 : _e.addEventListener("input", () => setSpeedDescription(slider, speedDescription));
// Set the max number of bars based on the screen width
window.addEventListener("resize", 
// TODO: Look into this error
debounce(setMaxBars, 250));
