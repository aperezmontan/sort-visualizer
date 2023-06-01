var _a, _b, _c, _d, _e, _f;
import Visualizer from "./visualizer.js";
import { bubbleSort, mergeSort, quickSort, selectionSort } from "./sorts.js";
let visualizer = null;
const visualizerDomElement = document.getElementById('visualizer');
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
const resetBars = () => {
    if (isSorted()) {
        unsortBars();
        setSortingCapability({ allowSorting: true });
    }
    else {
        console.log("Already reset");
    }
};
const unsortBars = () => {
    if (visualizer) {
        visualizer.unsortBars();
    }
    else {
        alert("Visualizer is null");
    }
};
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
/////////////////////////////////////
// Running the sorts
const runBubbleSort = () => {
    if (visualizer) {
        visualizer.sort({ algorithm: bubbleSort });
        setSortingCapability({ allowSorting: false });
    }
    else {
        alert("Visualizer is null");
    }
};
const runMergeSort = () => {
    if (visualizer) {
        visualizer.sort({ algorithm: mergeSort });
        setSortingCapability({ allowSorting: false });
    }
    else {
        alert("Visualizer is null");
    }
};
const runQuickSort = () => {
    if (visualizer) {
        visualizer.sort({ algorithm: quickSort });
        setSortingCapability({ allowSorting: false });
    }
    else {
        alert("Visualizer is null");
    }
};
const runSelectionSort = () => {
    if (visualizer) {
        visualizer.sort({ algorithm: selectionSort });
        setSortingCapability({ allowSorting: false });
    }
    else {
        alert("Visualizer is null");
    }
};
///////////////////////////////////////////////////
// DOM setup
const setMaxBars = () => {
    const width = window.innerWidth;
    const maxBars = Math.floor(width / 3);
    console.log("setting max bars");
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
const bubble = document.getElementById('sort-speed-bubble');
const slider = document.getElementById('sort-speed');
const setBubble = (range, bubble) => {
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;
    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
    return debounce(setSortSpeed);
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
const setSortSpeed = () => {
    // TODO: Not sure how else to do this. Debounce won't pass event 
    // into this function. See if you can improve
    console.log("slide value", slider.value);
    const value = parseInt(slider.value);
    if (!isNaN(value) && visualizer) {
        const sortSpeed = 1000 - value;
        console.log("setting sort speed to", sortSpeed, "ms");
        visualizer.setSortSpeed({ sortSpeed });
    }
    else {
        alert("Visualizer is null");
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
const generateNewBarsButton = document.getElementById('generate-bars');
generateNewBarsButton === null || generateNewBarsButton === void 0 ? void 0 : generateNewBarsButton.addEventListener("click", () => generateNewBars());
const resetBarsButton = document.getElementById('reset-bars');
resetBarsButton === null || resetBarsButton === void 0 ? void 0 : resetBarsButton.addEventListener("click", () => resetBars());
(_a = document.getElementById('bubble-sort')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => runBubbleSort());
(_b = document.getElementById('dark-mode')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => setDarkMode(e));
(_c = document.getElementById('merge-sort')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => runMergeSort());
(_d = document.getElementById('quick-sort')) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => runQuickSort());
(_e = document.getElementById('selection-sort')) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => runSelectionSort());
(_f = document.getElementById('sort-speed')) === null || _f === void 0 ? void 0 : _f.addEventListener("input", 
// TODO: Look into this error
() => setBubble(slider, bubble));
// Set the max number of bars based on the screen width
window.addEventListener("resize", 
// TODO: Look into this error
debounce(setMaxBars, 250));
