var _a, _b, _c, _d, _e, _f;
import Visualizer from "./visualizer.js";
import { bubbleSort, mergeSort, quickSort, selectionSort } from "./sorts.js";
let visualizer = null;
const runBubbleSort = () => {
    if (visualizer) {
        visualizer.sort({ algorithm: bubbleSort });
    }
    else {
        alert("Visualizer is null");
    }
};
const debounce = (callback, delay = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(args), delay);
    };
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
const runMergeSort = () => {
    if (visualizer) {
        visualizer.sort({ algorithm: mergeSort });
    }
    else {
        alert("Visualizer is null");
    }
};
const runQuickSort = () => {
    if (visualizer) {
        visualizer.sort({ algorithm: quickSort });
    }
    else {
        alert("Visualizer is null");
    }
};
const runSelectionSort = () => {
    if (visualizer) {
        visualizer.sort({ algorithm: selectionSort });
    }
    else {
        alert("Visualizer is null");
    }
};
const setMaxBars = () => {
    const width = window.innerWidth;
    const maxBars = Math.floor(width / 5);
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
const slider = () => {
    // TODO: Not sure how else to do this. Debounce won't pass event 
    // into this function. See if you can improve
    const slider = document.getElementById('sort-speed');
    const value = parseInt(slider.value);
    if (value && visualizer) {
        const sortSpeed = Math.floor(1000 - (value / 100) * 1000);
        console.log("setting sort speed to", sortSpeed, "ms");
        visualizer.setSortSpeed({ sortSpeed });
    }
    else {
        alert("Visualizer is null");
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
// Attach functions to the DOM 
document.addEventListener("DOMContentLoaded", () => visualizer = setVisualizer());
(_a = document.getElementById('generate-bars')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => generateBars());
(_b = document.getElementById('bubble-sort')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => runBubbleSort());
(_c = document.getElementById('merge-sort')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => runMergeSort());
(_d = document.getElementById('quick-sort')) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => runQuickSort());
(_e = document.getElementById('selection-sort')) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => runSelectionSort());
(_f = document.getElementById('sort-speed')) === null || _f === void 0 ? void 0 : _f.addEventListener("input", 
// TODO: Look into this error
debounce(slider, 250));
// Set the max number of bars based on the screen width
window.addEventListener("resize", 
// TODO: Look into this error
debounce(setMaxBars, 250));
