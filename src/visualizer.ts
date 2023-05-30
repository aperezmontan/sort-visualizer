interface BarType {
  barHeight: number,
  barHeightPercentOfViewport: number
}

interface StyleType {
  [key: string]: string;
}

export default class Visualizer {
  bars: BarType[] = [];
  maxBars: number;
  styleObj: StyleType;
  visualizerContainerQuery: HTMLCollectionOf<Element>;

  constructor({ maxBars, styleObj, visualizerContainerQuery }: { maxBars?: number, styleObj?: StyleType, visualizerContainerQuery: HTMLCollectionOf<Element> }) {
    this.maxBars = maxBars || 0;
    this.visualizerContainerQuery = visualizerContainerQuery;
    this.styleObj = styleObj || {
      'background-color': 'blue',
      'color': 'red'
    }
  }

  getBars = (): BarType[] => {
    return Array.from({ length: this.getRandomNumberBetween(1, this.maxBars) }, (x) => {
      const barHeight = this.getRandomNumberBetween(1, this.maxBars);
      const barHeightPercentOfViewport = barHeight / this.maxBars * 100;

      return {
        barHeight,
        barHeightPercentOfViewport
      }
    });
  }

  generateBars = (): number | null => {
    this.bars = this.getBars();

    if (this.visualizerContainerQuery.length > 0) {
      const visualizerContainer = this.visualizerContainerQuery[0];

      // Clear all of the bars that might be there from a previous run
      visualizerContainer.innerHTML = "";

      // // Put the "Generate Bars" button on the DOM which randomly generates a set of bars
      // visualizerContainer?.appendChild(placeGenerateBarsButton());

      this.bars.forEach(({ barHeight, barHeightPercentOfViewport }) => {
        // Create the bar div element
        const bar = document.createElement('div');
        bar.className = "bar";

        // Let's make this a tooltip because text doesn't look great at this pixel width
        // bar.innerHTML = `${barHeight}`;

        // Style it
        const styledDiv = this.styler(bar, this.styleObj)
        styledDiv.style.height = `${barHeightPercentOfViewport}%`;
        styledDiv.style.minWidth = "5px";

        visualizerContainer?.appendChild(styledDiv);
      });

      return this.bars.length;
    }

    return null;
  }

  getRandomNumberBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
  }

  selectionSort = (): void => {
    const numberOfBars = this.bars.length;

    for (let currentIndex = 0; currentIndex < numberOfBars; currentIndex++) {
      const currentBar = currentIndex;
      let minimumUnsortedIndex = null;

      for (let unsortedIndex = 1; unsortedIndex < numberOfBars; unsortedIndex++) {
        if (!minimumUnsortedIndex || (this.bars[unsortedIndex] < this.bars[minimumUnsortedIndex])) {
          minimumUnsortedIndex = unsortedIndex;
        }
      }

      if (minimumUnsortedIndex && this.bars[minimumUnsortedIndex].barHeight < this.bars[currentIndex].barHeight) {
        const temp = this.bars[currentIndex];
        this.bars[currentIndex] = this.bars[minimumUnsortedIndex];
        this.bars[minimumUnsortedIndex] = temp;
      }
    }

    // this.generateBars(this.bars);
  }

  setMaxBars = ({ maxBars }: { maxBars: number }): void => {
    this.maxBars = maxBars;
  }

  styler = (element: HTMLDivElement, style: StyleType): HTMLDivElement => {
    for (const styleProperty in style) {
      // TODO: figure out this issue
      element.style[styleProperty] = style[styleProperty];
    }

    return element;
  }
}

