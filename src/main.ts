import Visualizer from "./visualizer.js";
import { bubbleSort, mergeSort, quickSort, selectionSort } from "./sorts.js";

let visualizer: Visualizer | null = null;

const runBubbleSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: bubbleSort });
  } else {
    alert("Visualizer is null")
  }
}

const debounce = (callback: Function, delay: number = 300): Function => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: any[]): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(args), delay);
  };
};

const generateBars = () => {
  if (visualizer) {
    const numberOfBars = visualizer.generateBars();
    writeMetric({ metric: numberOfBars, metricClassName: "total-bars", metricTitle: "Total Bars" });
  } else {
    alert("Visualizer is null")
  }
}

const runMergeSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: mergeSort });
  } else {
    alert("Visualizer is null")
  }
}

const runQuickSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: quickSort });
  } else {
    alert("Visualizer is null")
  }
}

const runSelectionSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: selectionSort });
  } else {
    alert("Visualizer is null")
  }
}

const setMaxBars = () => {
  const width = window.innerWidth;
  const maxBars = Math.floor(width / 5);

  console.log("setting max bars")

  if (visualizer) {
    visualizer.setMaxBars({ maxBars });
    writeMetric({ metric: width, metricClassName: "window-width", metricTitle: "Width" });
    writeMetric({ metric: maxBars, metricClassName: "max-bars", metricTitle: "Max Bars" });
  } else {
    alert("Visualizer is null")
  }
}

const setVisualizer = (): Visualizer => {
  const visualizerContainerQuery = document.getElementsByClassName("visualizer-container");
  visualizer = new Visualizer({ visualizerContainerQuery })
  setMaxBars();

  return visualizer;
}

const slider = (): void => {
  // TODO: Not sure how else to do this. Debounce won't pass event 
  // into this function. See if you can improve
  const slider = <HTMLInputElement>document.getElementById('sort-speed');
  const value = parseInt(slider.value)

  if (value && visualizer) {
    const sortSpeed = Math.floor(1000 - (value / 100) * 1000);
    console.log("setting sort speed to", sortSpeed, "ms")
    visualizer.setSortSpeed({ sortSpeed });
  } else {
    alert("Visualizer is null")
  }
}

// Writes the metrics to the screen
const writeMetric = ({ metric, metricClassName, metricTitle }: { metric: number | null, metricClassName: string, metricTitle: string }): void => {
  if (metric) {
    const query = document.getElementsByClassName(metricClassName);

    if (query.length > 0) {
      const element = query[0];
      element.innerHTML = `${metricTitle}: ${metric}`;
    }
  } else {
    alert(`${metricTitle} is null`)
  }
}

// Attach functions to the DOM 
document.addEventListener("DOMContentLoaded", () => visualizer = setVisualizer());
document.getElementById('generate-bars')?.addEventListener("click", () => generateBars());
document.getElementById('bubble-sort')?.addEventListener("click", () => runBubbleSort());
document.getElementById('merge-sort')?.addEventListener("click", () => runMergeSort());
document.getElementById('quick-sort')?.addEventListener("click", () => runQuickSort());
document.getElementById('selection-sort')?.addEventListener("click", () => runSelectionSort());
document.getElementById('sort-speed')?.addEventListener(
  "input",
  // TODO: Look into this error
  debounce(slider, 250)
);

// Set the max number of bars based on the screen width
window.addEventListener(
  "resize",
  // TODO: Look into this error
  debounce(setMaxBars, 250)
);
