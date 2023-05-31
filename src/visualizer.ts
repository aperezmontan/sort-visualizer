interface BarType {
  domElement: HTMLDivElement | null,
  height: number,
  heightPercentOfViewport: number,
}

interface QuicksortParamsType {
  bars: BarType[],
  startingIndex: number,
  endingIndex: number
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

  getRandomBarValues = (): BarType[] => {
    return Array.from({ length: this.getRandomNumberBetween(1, this.maxBars) }, (x) => {
      const height = this.getRandomNumberBetween(1, this.maxBars);
      const heightPercentOfViewport = height / this.maxBars * 100;

      return {
        domElement: null,
        height,
        heightPercentOfViewport
      }
    });
  }

  generateBars = (): number | null => {
    this.bars = this.getRandomBarValues();

    if (this.visualizerContainerQuery.length > 0) {
      const visualizerContainer = this.visualizerContainerQuery[0];

      // Clear all of the bars that might be there from a previous run
      visualizerContainer.innerHTML = "";

      // // Put the "Generate Bars" button on the DOM which randomly generates a set of bars
      // visualizerContainer?.appendChild(placeGenerateBarsButton());

      this.bars.forEach((bar: BarType, index): void => {
        const { heightPercentOfViewport } = bar;

        // Create the bar div element
        const domElement = document.createElement('div');
        domElement.className = "bar";

        // Let's make this a tooltip because text doesn't look great at this pixel width
        // bar.innerHTML = `${height}`;

        // Style it
        // const styledDiv = this.styler(bar, this.styleObj)

        domElement.style.height = `${heightPercentOfViewport}%`;
        domElement.style.minWidth = "5px";
        domElement.style.order = `${index}`;
        bar.domElement = domElement;

        visualizerContainer?.appendChild(domElement);
      });

      return this.bars.length;
    }

    return null;
  }

  getRandomNumberBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
  }

  bubbleSort = (): void => {
    const numberOfBars = this.bars.length;

    // The unsortedCount is the length of the part of the array that's not yet sorted
    let unsortedCount = numberOfBars - 1;

    // The unsortedCount just keeps track of which iteration we're on
    while (unsortedCount > 0) {

      // The index is what's really in charge of the manipulation
      for (let index = 0; index < unsortedCount; index++) {
        const nextIndex = index + 1;

        if (this.bars[index].height > this.bars[nextIndex].height) {
          this.switchBars({ bars: this.bars, i: index, j: nextIndex })
        }
      }

      unsortedCount--;
    }
  }

  delay = (currentIndex: number, minIndex: number): void => {

  }

  // TODO: see if we can clean this up at all
  merge = ({ startingIndex, pivot, endingIndex }: { startingIndex: number, pivot: number, endingIndex: number }) => {
    let leftArraySize = pivot - startingIndex + 1;
    let rightArraySize = endingIndex - pivot;

    // Create temp arrays
    const leftArray = new Array(leftArraySize);
    const rightArray = new Array(rightArraySize);
    let leftArrayIndex = 0;
    let rightArrayIndex = 0;

    // Set the left and right arrays
    for (let currentIndex = startingIndex; currentIndex <= endingIndex; currentIndex++) {
      if (currentIndex <= pivot) {
        leftArray[leftArrayIndex] = this.bars[currentIndex]
        leftArrayIndex++;
      } else {
        rightArray[rightArrayIndex] = this.bars[currentIndex]
        rightArrayIndex++;
      }
    }

    leftArrayIndex = 0;
    rightArrayIndex = 0;

    // // Sort bars by left and right arrays
    for (let currentIndex = startingIndex; currentIndex <= endingIndex; currentIndex++) {

      // Ensure that the indexes are in range
      if ((leftArrayIndex < leftArraySize) && (rightArrayIndex < rightArraySize)) {
        // If they are, assign the correct bar
        if (leftArray[leftArrayIndex].height < rightArray[rightArrayIndex].height) {
          this.bars[currentIndex] = leftArray[leftArrayIndex]
          leftArrayIndex++;
        } else {
          this.bars[currentIndex] = rightArray[rightArrayIndex]
          rightArrayIndex++;
        }

        // If the indexes are not in range, then that means that either the left 
        // or the right array have elements remaining
        // Just need to go through and assign them one by one
      } else if (leftArrayIndex < leftArraySize) {
        this.bars[currentIndex] = leftArray[leftArrayIndex]
        leftArrayIndex++;
      } else {
        this.bars[currentIndex] = rightArray[rightArrayIndex]
        rightArrayIndex++;
      }

      this.bars[currentIndex].domElement?.style.order = `${currentIndex}`
    }
  }

  mergeSort = ({ startingIndex, endingIndex }: { startingIndex: number, endingIndex: number } = { startingIndex: 0, endingIndex: this.bars.length - 1 }): void => {
    // Base case. Nothing left to do here
    if (startingIndex == endingIndex) return;

    const pivot: number = Math.floor((startingIndex + endingIndex) / 2);

    this.mergeSort({ startingIndex, endingIndex: pivot })
    this.mergeSort({ startingIndex: pivot + 1, endingIndex })
    this.merge({ startingIndex, pivot, endingIndex })
  }

  partition = ({ bars, startingIndex, endingIndex }: QuicksortParamsType): number => {
    const pivot = bars[endingIndex]
    let i = startingIndex - 1;

    for (let currentIndex = startingIndex; currentIndex <= endingIndex - 1; currentIndex++) {
      if (bars[currentIndex].height < pivot.height) {
        i++;
        this.switchBars({ bars: this.bars, i, j: currentIndex })
      }
    }

    i++;
    this.switchBars({ bars, i, j: endingIndex })

    return i;
  }

  // TODO: Fix this algo
  quickSort = ({ bars, startingIndex, endingIndex }: QuicksortParamsType = { bars: this.bars, startingIndex: 0, endingIndex: this.bars.length - 1 }): void => {
    // Base case. Nothing left to do here
    if (endingIndex <= startingIndex) return;

    const pivot: number = this.partition({ bars, startingIndex, endingIndex });

    this.quickSort({ bars, startingIndex, endingIndex: pivot - 1 })
    this.quickSort({ bars, startingIndex: pivot + 1, endingIndex })
  }

  selectionSort = (): void => {
    const numberOfBars = this.bars.length;

    for (let currentIndex = 0; currentIndex < numberOfBars; currentIndex++) {
      let minIndex = currentIndex;
      const currentBarElement = this.bars[currentIndex].domElement;
      currentBarElement.style.backgroundColor = "red";

      // Find the shortest bar in the unsorted array
      for (let unsortedIndex = currentIndex + 1; unsortedIndex < numberOfBars; unsortedIndex++) {
        if (this.bars[unsortedIndex].height < this.bars[minIndex].height) {
          minIndex = unsortedIndex;
        }
      }

      this.switchBars({ bars: this.bars, i: currentIndex, j: minIndex })
      currentBarElement.style.backgroundColor = "white";
    }
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

  switchBars = ({ bars, i, j }: { bars: BarType[], i: number, j: number }) => {
    const tempOrder = bars[i].domElement?.style.order
    bars[i].domElement?.style.order = bars[j].domElement.style.order
    bars[j].domElement.style.order = tempOrder

    const temp = bars[i]
    bars[i] = bars[j]
    bars[j] = temp
  }
}

