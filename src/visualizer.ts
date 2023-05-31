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

  bubbleSort = async (): Promise<void> => {
    const numberOfBars = this.bars.length;

    // The unsortedCount is the length of the part of the array that's not yet sorted
    let unsortedCount = numberOfBars - 1;

    // The unsortedCount just keeps track of which iteration we're on
    while (unsortedCount > 0) {

      // The index is what's really in charge of the manipulation
      for (let index = 0; index < unsortedCount; index++) {
        const nextIndex = index + 1;

        this.setCurrentBarColor({ index: nextIndex, color: "red" })

        if (this.bars[index].height > this.bars[nextIndex].height) {
          await this.switchBars({ bars: this.bars, i: index, j: nextIndex })
        }

        this.setCurrentBarColor({ index: nextIndex, color: "white" })
      }

      unsortedCount--;
    }
  }

  delay = (): Promise<TimerHandler> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(''), this.sortSpeed);
    })
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

  getRandomNumberBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
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

  partition = async ({ bars, startingIndex, endingIndex }: QuicksortParamsType): Promise<number> => {
    const pivot = bars[endingIndex]
    let i = startingIndex - 1;

    for (let currentIndex = startingIndex; currentIndex <= endingIndex - 1; currentIndex++) {
      this.setCurrentBarColor({ index: currentIndex, color: "red" })

      if (bars[currentIndex].height < pivot.height) {
        i++;
        await this.switchBars({ bars: this.bars, i, j: currentIndex })
      }

      this.setCurrentBarColor({ index: currentIndex, color: "white" })
    }

    i++;

    this.setCurrentBarColor({ index: endingIndex, color: "red" })
    await this.switchBars({ bars, i, j: endingIndex })
    this.setCurrentBarColor({ index: endingIndex, color: "white" })

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

  setCurrentBarColor = ({ bars = this.bars, index, color }) => {
    const currentBarElement = bars[index].domElement;
    currentBarElement.style.backgroundColor = color;
  }

  selectionSort = async (): Promise<void> => {
    const numberOfBars = this.bars.length;

    for (let currentIndex = 0; currentIndex < numberOfBars; currentIndex++) {
      let minIndex = currentIndex;

      this.setCurrentBarColor({ index: currentIndex, color: "red" })

      // Find the shortest bar in the unsorted array
      for (let unsortedIndex = currentIndex + 1; unsortedIndex < numberOfBars; unsortedIndex++) {
        if (this.bars[unsortedIndex].height < this.bars[minIndex].height) {
          minIndex = unsortedIndex;
        }
      }

      await this.switchBars({ bars: this.bars, i: currentIndex, j: minIndex })
      this.setCurrentBarColor({ index: currentIndex, color: "white" })
    }
  }

  setMaxBars = ({ maxBars }: { maxBars: number }): void => {
    this.maxBars = maxBars;
  }

  setSortSpeed = ({ sortSpeed }: { sortSpeed: number }): void => {
    this.sortSpeed = sortSpeed;
  }

  styler = (element: HTMLDivElement, style: StyleType): HTMLDivElement => {
    for (const styleProperty in style) {
      // TODO: figure out this issue
      element.style[styleProperty] = style[styleProperty];
    }

    return element;
  }

  switchBars = async ({ bars, i, j }: { bars: BarType[], i: number, j: number }) => {
    const tempOrder = bars[i].domElement?.style.order
    bars[i].domElement?.style.order = bars[j].domElement.style.order
    bars[j].domElement.style.order = tempOrder

    await this.delay();

    const temp = bars[i]
    bars[i] = bars[j]
    bars[j] = temp
  }
}

