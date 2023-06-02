import Visualizer from "./visualizer.js";
import { bubbleSort, mergeSort, quickSort, selectionSort } from "./sorts.js";

let visualizer: Visualizer | null = null;
const visualizerDomElement = <HTMLDivElement>document.getElementById('visualizer');
const generateNewBarsButton = <HTMLButtonElement>document.getElementById('generate-bars')
const resetBarsButton = <HTMLButtonElement>document.getElementById('reset-bars')
const darkModeToggle = <HTMLInputElement>document.getElementById('dark-mode');
const slider = <HTMLInputElement>document.getElementById('sort-speed');
const speedDescription = <HTMLOutputElement>document.getElementById('sort-speed-description');

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

const resetBars = (): void | undefined => {
  if (isSorted()) {
    resetVisualizerBars();
    setSortingCapability({ allowSorting: true });
  } else {
    console.log("Already reset");
  }
}

const resetVisualizerBars = () => {
  if (visualizer) {
    visualizer.resetBars();
  } else {
    alert("Visualizer is null")
  }
}
/////////////////////////////////////

const enableResetButton = (): void => {
  resetBarsButton.removeAttribute("disabled");
}

// Running the sorts
const runBubbleSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: bubbleSort, callback: enableResetButton });
    setSortingCapability({ allowSorting: false });
  } else {
    alert("Visualizer is null")
  }
}

const runMergeSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: mergeSort, callback: enableResetButton });
    setSortingCapability({ allowSorting: false });
  } else {
    alert("Visualizer is null")
  }
}

const runQuickSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: quickSort, callback: enableResetButton });
    setSortingCapability({ allowSorting: false });
  } else {
    alert("Visualizer is null")
  }
}

const runSelectionSort = (): void => {
  if (visualizer) {
    visualizer.sort({ algorithm: selectionSort, callback: enableResetButton });
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

const getSpeedLevelFromValue = ({ value }: { value: number }): string => {
  if (value < 1200) {
    return "Slowest";
  } else if (value < 1400) {
    return "Slower";
  } else if (value < 1600) {
    return "Normal";
  } else if (value < 1800) {
    return "Faster";
  } else {
    return "Fastest";
  }
}

const setSpeedDescription = (range: HTMLInputElement, speedDescription: HTMLOutputElement): void => {
  const value = parseInt(range.value);
  speedDescription.innerHTML = getSpeedLevelFromValue({ value });
}

const setSortDelay = (e: MouseEvent | TouchEvent): void => {
  console.log("slide value", (<HTMLInputElement>e.target).value)
  const value = parseInt((<HTMLInputElement>e.target).value)

  if (!isNaN(value) && visualizer) {
    const sortDelay = 2000 - value;
    visualizer.setSortDelay({ sortDelay });
  } else {
    alert("Visualizer is null")
  }
}

const setDarkMode = (e: MouseEvent): void => {
  if (visualizerDomElement && e.target) {
    if ((<HTMLInputElement>e.target).checked) {
      visualizerDomElement.classList.remove("light-mode");
    } else {
      visualizerDomElement.classList.add("light-mode");
    }
  } else {
    console.log("Visualizer DOM element not found")
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
    resetBarsButton?.setAttribute("disabled", "disabled");
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

generateNewBarsButton?.addEventListener("click", () => generateNewBars());
resetBarsButton?.addEventListener("click", () => resetBars());
darkModeToggle?.addEventListener("click", (e) => setDarkMode(e));
slider.addEventListener("mouseup", (e) => setSortDelay(e));
slider.addEventListener("touchend", (e) => setSortDelay(e));

document.getElementById('bubble-sort')?.addEventListener("click", () => runBubbleSort());
document.getElementById('merge-sort')?.addEventListener("click", () => runMergeSort());
document.getElementById('quick-sort')?.addEventListener("click", () => runQuickSort());
document.getElementById('selection-sort')?.addEventListener("click", () => runSelectionSort());
document.getElementById('sort-speed')?.addEventListener("input", () => setSpeedDescription(slider, speedDescription));

// Set the max number of bars based on the screen width
window.addEventListener(
  "resize",
  // TODO: Look into this error
  debounce(setMaxBars, 250)
);
