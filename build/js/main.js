var _a, _b, _c;
import Visualizer from "./visualizer.js";
let visualizer = null;
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
const quickSort = () => {
    if (visualizer) {
        visualizer.quickSort();
    }
    else {
        alert("Visualizer is null");
    }
};
const selectionSort = () => {
    if (visualizer) {
        visualizer.selectionSort();
    }
    else {
        alert("Visualizer is null");
    }
};
const setMaxBars = () => {
    const width = window.innerWidth;
    const maxBars = Math.floor(width / 5);
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
window.addEventListener("resize", 
// TODO: Look into this error
debounce(() => setMaxBars(), 250));
document.addEventListener("DOMContentLoaded", () => {
    visualizer = setVisualizer();
});
(_a = document.getElementById('generate-bars')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => generateBars());
(_b = document.getElementById('quick-sort')) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => quickSort());
(_c = document.getElementById('selection-sort')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => selectionSort());
