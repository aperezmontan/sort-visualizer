import Visualizer from "./visualizer.js";

let visualizer: Visualizer | null = null;

const debounce = (callback: Function, delay: number = 300): Function => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
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

const quickSort = (): void => {
  if (visualizer) {
    visualizer.quickSort();
  } else {
    alert("Visualizer is null")
  }
}

const selectionSort = (): void => {
  if (visualizer) {
    visualizer.selectionSort();
  } else {
    alert("Visualizer is null")
  }
}

const setMaxBars = () => {
  const width = window.innerWidth;
  const maxBars = Math.floor(width / 5);

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
window.addEventListener(
  "resize",
  // TODO: Look into this error
  debounce(() => setMaxBars(), 250)
);

document.addEventListener("DOMContentLoaded", () => {
  visualizer = setVisualizer();
});
document.getElementById('generate-bars')?.addEventListener("click", () => generateBars());
document.getElementById('quick-sort')?.addEventListener("click", () => quickSort());
document.getElementById('selection-sort')?.addEventListener("click", () => selectionSort());