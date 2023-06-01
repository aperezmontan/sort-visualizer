interface BarValueType {
  height: number,
  heightPercentOfViewport: number,
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
  styleObj: StyleType;
  sortSpeed: number;
  visualizerContainerQuery: HTMLCollectionOf<Element>;

  constructor({ maxBars, styleObj, visualizerContainerQuery }: { maxBars?: number, styleObj?: StyleType, visualizerContainerQuery: HTMLCollectionOf<Element> }) {
    this.maxBars = maxBars || 0;
    this.sortSpeed = 100;
    this.visualizerContainerQuery = visualizerContainerQuery;
    this.styleObj = styleObj || {
      'background-color': 'blue',
      'color': 'red'
    }
  }

  delay = (): Promise<TimerHandler> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(''), this.sortSpeed);
    })
  }

  generateBars = (): number | null => {
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

        // Let's make this a tooltip because text doesn't look great at this pixel width
        // bar.innerHTML = `${height}`;

        // Style it
        // const styledDiv = this.styler(bar, this.styleObj)

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
    return Array.from({ length: this.getRandomNumberBetween(1, this.maxBars) }, (x) => {
      const height = this.getRandomNumberBetween(1, this.maxBars);
      const heightPercentOfViewport = height / this.maxBars * 100;

      return {
        height,
        heightPercentOfViewport
      }
    });
  }

  getRandomNumberBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
  }

  // setCurrentBarColor = ({ bars = this.bars, index, color }) => {
  //   const currentBarElement = bars[index].domElement;
  //   currentBarElement.style.backgroundColor = color;
  // }

  setMaxBars = ({ maxBars }: { maxBars: number }): void => {
    this.maxBars = maxBars;
  }

  setSortSpeed = ({ sortSpeed }: { sortSpeed: number }): void => {
    this.sortSpeed = sortSpeed;
  }

  sort = ({ algorithm }: { algorithm: PartitionBasedSortFunction | TranspositionSortFunction }): void => {
    const args = {
      bars: this.bars,
      startingIndex: 0,
      endingIndex: this.bars.length - 1
    }

    algorithm(args);
  }

  styler = (element: HTMLDivElement, style: StyleType): HTMLDivElement => {
    for (const styleProperty in style) {
      // TODO: figure out this issue
      element.style[styleProperty] = style[styleProperty];
    }

    return element;
  }
}
