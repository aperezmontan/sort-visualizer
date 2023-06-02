import Visualizer, { BarType } from "./visualizer";

export interface PartitionBasedSortFunction {
  ({ bars }: { bars: BarType[] }): void;
}

export interface TranspositionSortFunction {
  ({ bars, startingIndex, endingIndex }: { bars: BarType[], startingIndex: number, endingIndex: number }): void;
}

const delay = ({ timeout }: { timeout: number }): Promise<TimerHandler> | undefined => {
  if (timeout == 0) return;

  return new Promise(resolve => {
    setTimeout(() => resolve(''), timeout);
  })
}

const colorSelectBars = ({ bars, indexes }: { bars: BarType[], indexes: number[] }): void => {
  indexes.forEach(index => bars[index].domElement.classList.add("selected"));
}

const deColorSelectBars = ({ bars, indexes }: { bars: BarType[], indexes: number[] }): void => {
  indexes.forEach(index => bars[index].domElement.classList.remove("selected"));
}

const colorSortedBars = ({ bars, indexes }: { bars: BarType[], indexes: number[] }): void => {
  indexes.forEach(index => bars[index].domElement.classList.add("sorted"));
}

const deColorSortedBars = ({ bars, indexes }: { bars: BarType[], indexes: number[] }): void => {
  indexes.forEach(index => bars[index].domElement.classList.remove("sorted"));
}

export const bubbleSort = async ({ bars, visualizer }: { bars: BarType[], visualizer: Visualizer }): Promise<void> => {
  const numberOfBars = bars.length;

  // The unsortedCount is the length of the part of the array that's not yet sorted
  let unsortedCount = numberOfBars - 1;

  // The unsortedCount just keeps track of which iteration we're on
  while (unsortedCount > 0) {

    // The index is what's really in charge of the manipulation
    for (let index = 0; index < unsortedCount; index++) {
      const nextIndex = index + 1;

      colorSelectBars({ bars, indexes: [index, nextIndex] });

      // bars[index].domElement.classList.add("selected")
      // bars[nextIndex].domElement.classList.add("selected")

      await delay({ timeout: visualizer.sortDelay });

      if (bars[index].height > bars[nextIndex].height) {
        await switchBars({ bars: bars, i: index, j: nextIndex, visualizer })
      }

      // bars[index].domElement.classList.remove("selected")
      // bars[nextIndex].domElement.classList.remove("selected")
      deColorSelectBars({ bars, indexes: [index, nextIndex] });
    }

    if (bars[unsortedCount].height > bars[unsortedCount - 1].height) {
      colorSortedBars({ bars, indexes: [unsortedCount] });
      // bars[unsortedCount].domElement.classList.add("sorted");
    } else {
      // bars[unsortedCount - 1].domElement.classList.add("sorted");
      colorSortedBars({ bars, indexes: [unsortedCount - 1] });
    }

    if (bars[unsortedCount].height == bars[unsortedCount - 1].height) {
      colorSortedBars({ bars, indexes: [unsortedCount] });
      // bars[unsortedCount].domElement.classList.add("sorted");
    }

    unsortedCount--;
  }

  // bars[0].domElement.classList.add("sorted");
  colorSortedBars({ bars, indexes: [0] });
}

interface MergeType extends SortParamsType {
  pivot: number
}

const arrayRange = (start, stop, step = 1) => Array.from(
  { length: (stop - start) / step + 1 },
  (value, index) => start + index * step
);


// TODO: see if we can clean this up at all
const merge = async ({ bars, startingIndex, pivot, endingIndex, visualizer }: MergeType & { visualizer: Visualizer }): Promise<void> => {
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
      leftArray[leftArrayIndex] = bars[currentIndex]
      leftArrayIndex++;
    } else {
      rightArray[rightArrayIndex] = bars[currentIndex]
      rightArrayIndex++;
    }
  }

  leftArrayIndex = 0;
  rightArrayIndex = 0;

  // // Sort bars by left and right arrays
  deColorSortedBars({ bars, indexes: arrayRange(startingIndex, endingIndex) })

  for (let currentIndex = startingIndex; currentIndex <= endingIndex; currentIndex++) {
    // Ensure that the indexes are in range
    if ((leftArrayIndex < leftArraySize) && (rightArrayIndex < rightArraySize)) {
      // If they are, assign the correct bar
      if (leftArray[leftArrayIndex].height < rightArray[rightArrayIndex].height) {
        bars[currentIndex] = leftArray[leftArrayIndex]
        leftArrayIndex++;
      } else {
        bars[currentIndex] = rightArray[rightArrayIndex]
        rightArrayIndex++;
      }

      // If the indexes are not in range, then that means that either the left 
      // or the right array have elements remaining
      // Just need to go through and assign them one by one
    } else if (leftArrayIndex < leftArraySize) {
      bars[currentIndex] = leftArray[leftArrayIndex]
      leftArrayIndex++;
    } else {
      bars[currentIndex] = rightArray[rightArrayIndex]
      rightArrayIndex++;
    }

    bars[currentIndex].domElement.style.order = `${currentIndex}`

    await delay({ timeout: visualizer.sortDelay });

    colorSortedBars({ bars, indexes: [currentIndex] })
  }
}

export const mergeSort = async ({ bars, startingIndex, endingIndex, visualizer }: SortParamsType & { visualizer: Visualizer }): Promise<void> => {
  // Base case. Nothing left to do here
  if (startingIndex == endingIndex) return;

  const pivot: number = Math.floor((startingIndex + endingIndex) / 2);

  await mergeSort({ bars, startingIndex, endingIndex: pivot, visualizer })
  await mergeSort({ bars, startingIndex: pivot + 1, endingIndex, visualizer })
  await merge({ bars, startingIndex, pivot, endingIndex, visualizer })
}

interface SortParamsType {
  bars: BarType[],
  startingIndex: number,
  endingIndex: number
}

const partition = async ({ bars, startingIndex, endingIndex, visualizer }: SortParamsType & { visualizer: Visualizer }): Promise<number> => {
  const pivot = bars[endingIndex]
  let i = startingIndex - 1;

  for (let currentIndex = startingIndex; currentIndex <= endingIndex - 1; currentIndex++) {
    if (bars[currentIndex].height < pivot.height) {
      i++;
      await switchBars({ bars, i, j: currentIndex, visualizer })
    }
  }

  i++;
  await switchBars({ bars, i, j: endingIndex, visualizer })

  return i;
}

export const quickSort = async ({ bars, startingIndex, endingIndex, visualizer }: SortParamsType & { visualizer: Visualizer }): Promise<number | undefined> => {
  // Base case. Nothing left to do here
  if (endingIndex <= startingIndex) return;

  const pivot: number = await partition({ bars, startingIndex, endingIndex, visualizer });

  await quickSort({ bars, startingIndex, endingIndex: pivot - 1, visualizer })
  await quickSort({ bars, startingIndex: pivot + 1, endingIndex, visualizer })
}

export const selectionSort = async ({ bars, visualizer }: { bars: BarType[], visualizer: Visualizer }): Promise<void> => {
  const numberOfBars = bars.length;

  for (let currentIndex = 0; currentIndex < numberOfBars; currentIndex++) {
    let minIndex = currentIndex;

    colorSelectBars({ bars, indexes: [currentIndex] });

    // Find the shortest bar in the unsorted array
    for (let unsortedIndex = currentIndex + 1; unsortedIndex < numberOfBars; unsortedIndex++) {
      // colorSelectBars({ bars, indexes: [unsortedIndex] });

      if (bars[unsortedIndex].height < bars[minIndex].height) {
        if (minIndex != currentIndex) {
          deColorSelectBars({ bars, indexes: [minIndex] });
        }

        minIndex = unsortedIndex;
        colorSelectBars({ bars, indexes: [minIndex] });
        await delay({ timeout: visualizer.sortDelay });
      }
    }

    deColorSelectBars({ bars, indexes: [currentIndex, minIndex] });

    await switchBars({ bars: bars, i: currentIndex, j: minIndex, visualizer })

    colorSortedBars({ bars, indexes: [currentIndex] });
  }
}

const colorSwapBars = ({ bars, indexes }: { bars: BarType[], indexes: number[] }): void => {
  indexes.forEach(index => bars[index].domElement.classList.add("swapped"));
}

const deColorSwapBars = ({ bars, indexes }: { bars: BarType[], indexes: number[] }): void => {
  indexes.forEach(index => bars[index].domElement.classList.remove("swapped"));
}

const switchBars = async ({ bars, i, j, visualizer }: { bars: BarType[], i: number, j: number, visualizer: Visualizer }) => {
  colorSwapBars({ bars, indexes: [i, j] });

  const tempOrder = bars[i].domElement.style.order
  bars[i].domElement.style.order = bars[j].domElement.style.order
  bars[j].domElement.style.order = tempOrder

  // TODO: one way to delay for animations
  await delay({ timeout: visualizer.sortDelay });

  const temp = bars[i]
  bars[i] = bars[j]
  bars[j] = temp

  deColorSwapBars({ bars, indexes: [i, j] });
}
