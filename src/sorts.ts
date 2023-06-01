import { BarType } from "./visualizer";

export interface PartitionBasedSortFunction {
  ({ bars }: { bars: BarType[] }): void;
}

export interface TranspositionSortFunction {
  ({ bars, startingIndex, endingIndex }: { bars: BarType[], startingIndex: number, endingIndex: number }): void;
}

export const bubbleSort = ({ bars }: { bars: BarType[] }): void => {
  const numberOfBars = bars.length;

  // The unsortedCount is the length of the part of the array that's not yet sorted
  let unsortedCount = numberOfBars - 1;

  // The unsortedCount just keeps track of which iteration we're on
  while (unsortedCount > 0) {

    // The index is what's really in charge of the manipulation
    for (let index = 0; index < unsortedCount; index++) {
      const nextIndex = index + 1;

      if (bars[index].height > bars[nextIndex].height) {
        switchBars({ bars: bars, i: index, j: nextIndex })
      }
    }

    unsortedCount--;
  }
}

interface MergeType extends SortParamsType {
  pivot: number
}

// TODO: see if we can clean this up at all
const merge = ({ bars, startingIndex, pivot, endingIndex }: MergeType): void => {
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
  }
}

export const mergeSort = ({ bars, startingIndex, endingIndex }: SortParamsType): void => {
  // Base case. Nothing left to do here
  if (startingIndex == endingIndex) return;

  const pivot: number = Math.floor((startingIndex + endingIndex) / 2);

  mergeSort({ bars, startingIndex, endingIndex: pivot })
  mergeSort({ bars, startingIndex: pivot + 1, endingIndex })
  merge({ bars, startingIndex, pivot, endingIndex })
}

interface SortParamsType {
  bars: BarType[],
  startingIndex: number,
  endingIndex: number
}

const partition = ({ bars, startingIndex, endingIndex }: SortParamsType): number => {
  const pivot = bars[endingIndex]
  let i = startingIndex - 1;

  for (let currentIndex = startingIndex; currentIndex <= endingIndex - 1; currentIndex++) {
    if (bars[currentIndex].height < pivot.height) {
      i++;
      switchBars({ bars, i, j: currentIndex })
    }
  }

  i++;
  switchBars({ bars, i, j: endingIndex })

  return i;
}

export const quickSort = ({ bars, startingIndex, endingIndex }: SortParamsType): void => {
  // Base case. Nothing left to do here
  if (endingIndex <= startingIndex) return;

  const pivot: number = partition({ bars, startingIndex, endingIndex });

  quickSort({ bars, startingIndex, endingIndex: pivot - 1 })
  quickSort({ bars, startingIndex: pivot + 1, endingIndex })
}

export const selectionSort = ({ bars }: { bars: BarType[] }): void => {
  const numberOfBars = bars.length;

  for (let currentIndex = 0; currentIndex < numberOfBars; currentIndex++) {
    let minIndex = currentIndex;

    // Find the shortest bar in the unsorted array
    for (let unsortedIndex = currentIndex + 1; unsortedIndex < numberOfBars; unsortedIndex++) {
      if (bars[unsortedIndex].height < bars[minIndex].height) {
        minIndex = unsortedIndex;
      }
    }

    switchBars({ bars: bars, i: currentIndex, j: minIndex })
  }
}

const switchBars = ({ bars, i, j }: { bars: BarType[], i: number, j: number }) => {
  console.log("Switching bars", i, j)

  const tempOrder = bars[i].domElement.style.order
  bars[i].domElement.style.order = bars[j].domElement.style.order
  bars[j].domElement.style.order = tempOrder

  // TODO: one way to delay for animations
  // await delay();

  const temp = bars[i]
  bars[i] = bars[j]
  bars[j] = temp
}
