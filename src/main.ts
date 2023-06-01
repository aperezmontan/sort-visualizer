import Visualizer from "./visualizer.js";
import { bubbleSort, mergeSort, quickSort, selectionSort } from "./sorts.js";

let visualizer: Visualizer | null = null;
const visualizerDomElement = document.getElementById('visualizer');

const debounce = (callback: Function, delay: number = 300): Function => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: any[]): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback.apply(args), delay);
  };
};

const hasBars = (): boolean => {
  if (visualizer) {
    return visualizer.hasBars();
  }

  console.log("Visualizer is null");
  return false;
}

const isSorted = (): boolean => {
  if (visualizer) {
    return visualizer.isSorted();
  }

  console.log("Visualizer is null");
  return false;
}

// Generating and resetting bars
const resetBars = (): void | undefined => {
  if (isSorted()) {
    unsortBars();
    setSortingCapability({ allowSorting: true });
  } else {
    console.log("Already reset");
  }
}

const unsortBars = () => {
  if (visualizer) {
    visualizer.unsortBars();
  } else {
    alert("Visualizer is null")
  }
}

const generateBars = () => {
  if (visualizer) {
    const numberOfBars = visualizer.generateBars();
    writeMetric({ metric: numberOfBars, metricClassName: "total-bars", metricTitle: "Total Bars" });
  } else {
    alert("Visualizer is null")
  }
}

const generateNewBars = (): void | undefined => {
  if (!isSorted()) {
    generateBars();
    setSortingCapability({ allowSorting: true });
  } else {
    console.log("Sorted!");
  }
}
/////////////////////////////////////

// Running the sorts
const runBubbleSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: bubbleSort });
    setSortingCapability({ allowSorting: false });
  } else {
    alert("Visualizer is null")
  }
}

const runMergeSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: mergeSort });
    setSortingCapability({ allowSorting: false });
  } else {
    alert("Visualizer is null")
  }
}

const runQuickSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: quickSort });
    setSortingCapability({ allowSorting: false });
  } else {
    alert("Visualizer is null")
  }
}

const runSelectionSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: selectionSort });
    setSortingCapability({ allowSorting: false });
  } else {
    alert("Visualizer is null")
  }
}
///////////////////////////////////////////////////

// DOM setup
const setMaxBars = () => {
  const width = window.innerWidth;
  const maxBars = Math.floor(width / 3);

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

const bubble = <HTMLOutputElement>document.getElementById('sort-speed-bubble');
const slider = <HTMLInputElement>document.getElementById('sort-speed');

const setBubble = (range: HTMLInputElement, bubble: HTMLOutputElement) => {
  const val = range.value;
  const min = range.min ? range.min : 0;
  const max = range.max ? range.max : 100;
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = val;

  // Sorta magic numbers based on size of the native UI thumb
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;

  return debounce(setSortSpeed);
}

const setDarkMode = (e): void => {
  if (visualizerDomElement && e.target) {
    if (e.target.checked) {
      visualizerDomElement.classList.remove("light-mode");
    } else {
      visualizerDomElement.classList.add("light-mode");
    }
  } else {
    console.log("Visualizer DOM element not found")
  }
}

const setSortSpeed = (): void => {
  // TODO: Not sure how else to do this. Debounce won't pass event 
  // into this function. See if you can improve
  console.log("slide value", slider.value)
  const value = parseInt(slider.value)

  if (!isNaN(value) && visualizer) {
    const sortSpeed = 1000 - value;
    console.log("setting sort speed to", sortSpeed, "ms")
    visualizer.setSortSpeed({ sortSpeed });
  } else {
    alert("Visualizer is null")
  }
}

const setSortingCapability = ({ allowSorting }: { allowSorting: boolean }): void => {
  const sortElementIds = [
    "bubble-sort",
    "merge-sort",
    "quick-sort",
    "selection-sort",
  ]
  const buttons = sortElementIds.map(id => document.getElementById(id));

  if (!hasBars()) {
    alert("no bars to sort");
    return;
  }

  if (allowSorting) {
    toggleBarButtons({ canGenerateBars: true });
    buttons.forEach(button => button && button.removeAttribute("disabled"));
  } else {
    toggleBarButtons({ canGenerateBars: false });
    buttons.forEach(button => button && button.setAttribute("disabled", "disabled"));
  }
}

const toggleBarButtons = ({ canGenerateBars }: { canGenerateBars: boolean }): void => {
  if (canGenerateBars) {
    resetBarsButton?.setAttribute("hidden", "true");
    generateNewBarsButton?.removeAttribute("hidden");
  } else {
    generateNewBarsButton?.setAttribute("hidden", "true");
    resetBarsButton?.removeAttribute("hidden");
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
//////////////////////////////////////////////////////////////

// Attach functions to the DOM 
document.addEventListener("DOMContentLoaded", () => {
  visualizer = setVisualizer();
  generateBars();
  setSortingCapability({ allowSorting: true });
});

const generateNewBarsButton = document.getElementById('generate-bars')
generateNewBarsButton?.addEventListener("click", () => generateNewBars());
const resetBarsButton = document.getElementById('reset-bars')
resetBarsButton?.addEventListener("click", () => resetBars());

document.getElementById('bubble-sort')?.addEventListener("click", () => runBubbleSort());
document.getElementById('dark-mode')?.addEventListener("click", (e) => setDarkMode(e));
document.getElementById('merge-sort')?.addEventListener("click", () => runMergeSort());
document.getElementById('quick-sort')?.addEventListener("click", () => runQuickSort());
document.getElementById('selection-sort')?.addEventListener("click", () => runSelectionSort());
document.getElementById('sort-speed')?.addEventListener(
  "input",
  // TODO: Look into this error
  () => setBubble(slider, bubble)
);

// Set the max number of bars based on the screen width
window.addEventListener(
  "resize",
  // TODO: Look into this error
  debounce(setMaxBars, 250)
);
