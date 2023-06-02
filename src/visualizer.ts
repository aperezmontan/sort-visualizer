interface BarValueType {
  height: number,
  heightPercentOfViewport: number,
  originalOrder: number
}

export interface BarType extends BarValueType {
  domElement: HTMLDivElement
}

interface StyleType {
  [key: string]: string;
}

import { PartitionBasedSortFunction, TranspositionSortFunction } from "./sorts";

export default class Visualizer {
  bars: BarType[] = [];
  maxBars: number;
  sortDelay: number;
  visualizerContainerQuery: HTMLCollectionOf<Element>;

  constructor({ maxBars, visualizerContainerQuery }: { maxBars?: number, styleObj?: StyleType, visualizerContainerQuery: HTMLCollectionOf<Element> }) {
    this.maxBars = maxBars || 0;
    this.sortDelay = 1000;
    this.visualizerContainerQuery = visualizerContainerQuery;
  }

  generateBars = (): number | null => {
    // TODO: stop any running sorts
    // this.stopSorts()

    if (this.visualizerContainerQuery.length > 0) {
      const visualizerContainer = this.visualizerContainerQuery[0];

      // Clear all of the bars that might be there from a previous run
      visualizerContainer.innerHTML = "";

      // Put the "Generate Bars" button on the DOM which randomly generates a set of bars
      this.bars = this.getRandomBarValues().map((barValue: BarValueType, index: number): BarType => {

        const { heightPercentOfViewport } = barValue;

        // Create the bar div element
        const domElement = document.createElement('div');
        domElement.className = "bar";
        domElement.style.height = `${heightPercentOfViewport}%`;
        domElement.style.order = `${index}`;

        const bar: BarType = {
          domElement,
          ...barValue
        }

        return bar;
      });

      // Put bars on the DOM
      visualizerContainer?.append(...this.bars.map(bar => bar.domElement));

      return this.bars.length;
    }

    return null;
  }

  getRandomBarValues = (): BarValueType[] => {
    return Array.from({ length: this.getRandomNumberBetween(1, this.maxBars) }, (x, originalOrder: number) => {
      const height = this.getRandomNumberBetween(1, this.maxBars);
      const heightPercentOfViewport = height / this.maxBars * 100;

      return {
        height,
        heightPercentOfViewport,
        originalOrder
      }
    });
  }

  getRandomNumberBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
  }

  hasBars = (): boolean => {
    return this.bars.length > 0
  }

  isSorted = (): boolean => {
    if (!this.hasBars()) {
      alert("No bars");
      return false;
    }

    let lastBar = this.bars[0]

    return this.bars.every((bar) => {
      const nextBarTaller = bar.height >= lastBar.height;
      lastBar = bar;
      return nextBarTaller;
    })
  }

  resetBars = (): void => {
    // Only merge sort can be reset by changing style.order. 
    // All the other sorts actually change the order of the bar in place, 
    // so this needs to be undone.
    this.bars.sort((barA: BarType, barB: BarType) => {
      return barA.originalOrder - barB.originalOrder;
    }).forEach((bar: BarType, index: number) => {
      this.bars[index].domElement.style.order = `${bar.originalOrder}`;
      this.bars[index].domElement.classList.remove("sorted");
    });
  }

  setMaxBars = ({ maxBars }: { maxBars: number }): void => {
    this.maxBars = maxBars;
  }

  setSortDelay = ({ sortDelay }: { sortDelay: number }): void => {
    this.sortDelay = sortDelay;
  }

  sort = ({ algorithm }: { algorithm: PartitionBasedSortFunction | TranspositionSortFunction }): void => {
    const args = {
      bars: this.bars,
      startingIndex: 0,
      endingIndex: this.bars.length - 1,
      visualizer: this
    }

    algorithm(args);
  }
}
