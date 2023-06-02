var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const delay = ({ timeout }) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(''), timeout);
    });
};
const colorSelectBars = ({ bars, indexes }) => {
    indexes.forEach(index => bars[index].domElement.classList.add("selected"));
};
const deColorSelectBars = ({ bars, indexes }) => {
    indexes.forEach(index => bars[index].domElement.classList.remove("selected"));
};
const colorSortedBars = ({ bars, indexes }) => {
    indexes.forEach(index => bars[index].domElement.classList.add("sorted"));
};
const deColorSortedBars = ({ bars, indexes }) => {
    indexes.forEach(index => bars[index].domElement.classList.remove("sorted"));
};
export const bubbleSort = ({ bars, visualizer }) => __awaiter(void 0, void 0, void 0, function* () {
    const numberOfBars = bars.length;
    // The unsortedCount is the length of the part of the array that's not yet sorted
    let unsortedCount = numberOfBars - 1;
    // The unsortedCount just keeps track of which iteration we're on
    while (unsortedCount > 0) {
        // The index is what's really in charge of the manipulation
        for (let index = 0; index < unsortedCount; index++) {
            const nextIndex = index + 1;
            colorSelectBars({ bars, indexes: [index, nextIndex] });
            yield delay({ timeout: visualizer.sortDelay });
            if (bars[index].height > bars[nextIndex].height) {
                yield switchBars({ bars: bars, i: index, j: nextIndex, visualizer });
            }
            deColorSelectBars({ bars, indexes: [index, nextIndex] });
        }
        if (bars[unsortedCount].height > bars[unsortedCount - 1].height) {
            colorSortedBars({ bars, indexes: [unsortedCount] });
        }
        else {
            colorSortedBars({ bars, indexes: [unsortedCount - 1] });
        }
        if (bars[unsortedCount].height == bars[unsortedCount - 1].height) {
            colorSortedBars({ bars, indexes: [unsortedCount] });
        }
        unsortedCount--;
    }
    colorSortedBars({ bars, indexes: [0] });
});
const arrayRange = (start, stop, step = 1) => Array.from({ length: (stop - start) / step + 1 }, (value, index) => start + index * step);
// TODO: see if we can clean this up at all
const merge = ({ bars, startingIndex, pivot, endingIndex, visualizer }) => __awaiter(void 0, void 0, void 0, function* () {
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
            leftArray[leftArrayIndex] = bars[currentIndex];
            leftArrayIndex++;
        }
        else {
            rightArray[rightArrayIndex] = bars[currentIndex];
            rightArrayIndex++;
        }
    }
    leftArrayIndex = 0;
    rightArrayIndex = 0;
    // // Sort bars by left and right arrays
    deColorSortedBars({ bars, indexes: arrayRange(startingIndex, endingIndex) });
    for (let currentIndex = startingIndex; currentIndex <= endingIndex; currentIndex++) {
        // Ensure that the indexes are in range
        if ((leftArrayIndex < leftArraySize) && (rightArrayIndex < rightArraySize)) {
            // If they are, assign the correct bar
            if (leftArray[leftArrayIndex].height < rightArray[rightArrayIndex].height) {
                bars[currentIndex] = leftArray[leftArrayIndex];
                leftArrayIndex++;
            }
            else {
                bars[currentIndex] = rightArray[rightArrayIndex];
                rightArrayIndex++;
            }
            // If the indexes are not in range, then that means that either the left 
            // or the right array have elements remaining
            // Just need to go through and assign them one by one
        }
        else if (leftArrayIndex < leftArraySize) {
            bars[currentIndex] = leftArray[leftArrayIndex];
            leftArrayIndex++;
        }
        else {
            bars[currentIndex] = rightArray[rightArrayIndex];
            rightArrayIndex++;
        }
        bars[currentIndex].domElement.style.order = `${currentIndex}`;
        yield delay({ timeout: visualizer.sortDelay });
        colorSortedBars({ bars, indexes: [currentIndex] });
    }
});
export const mergeSort = ({ bars, startingIndex, endingIndex, visualizer }) => __awaiter(void 0, void 0, void 0, function* () {
    // Base case. Nothing left to do here
    if (startingIndex == endingIndex)
        return;
    const pivot = Math.floor((startingIndex + endingIndex) / 2);
    yield mergeSort({ bars, startingIndex, endingIndex: pivot, visualizer });
    yield mergeSort({ bars, startingIndex: pivot + 1, endingIndex, visualizer });
    yield merge({ bars, startingIndex, pivot, endingIndex, visualizer });
});
const partition = ({ bars, startingIndex, endingIndex, visualizer }) => __awaiter(void 0, void 0, void 0, function* () {
    const pivot = bars[endingIndex];
    let i = startingIndex - 1;
    for (let currentIndex = startingIndex; currentIndex <= endingIndex - 1; currentIndex++) {
        if (bars[currentIndex].height < pivot.height) {
            i++;
            yield switchBars({ bars, i, j: currentIndex, visualizer });
        }
    }
    i++;
    yield switchBars({ bars, i, j: endingIndex, visualizer });
    return i;
});
export const quickSort = ({ bars, startingIndex, endingIndex, visualizer }) => __awaiter(void 0, void 0, void 0, function* () {
    // Base case. Nothing left to do here
    if (endingIndex <= startingIndex)
        return;
    const pivot = yield partition({ bars, startingIndex, endingIndex, visualizer });
    // pivot is always the sorted element
    colorSortedBars({ bars, indexes: [pivot] });
    const firstRange = arrayRange(startingIndex, pivot - 1);
    deColorSortedBars({ bars, indexes: firstRange });
    yield quickSort({ bars, startingIndex, endingIndex: pivot - 1, visualizer });
    colorSortedBars({ bars, indexes: firstRange });
    const secondRange = arrayRange(pivot + 1, endingIndex);
    deColorSortedBars({ bars, indexes: secondRange });
    yield quickSort({ bars, startingIndex: pivot + 1, endingIndex, visualizer });
    colorSortedBars({ bars, indexes: secondRange });
});
export const selectionSort = ({ bars, visualizer }) => __awaiter(void 0, void 0, void 0, function* () {
    const numberOfBars = bars.length;
    for (let currentIndex = 0; currentIndex < numberOfBars; currentIndex++) {
        let minIndex = currentIndex;
        colorSelectBars({ bars, indexes: [currentIndex] });
        // Find the shortest bar in the unsorted array
        for (let unsortedIndex = currentIndex + 1; unsortedIndex < numberOfBars; unsortedIndex++) {
            if (bars[unsortedIndex].height < bars[minIndex].height) {
                if (minIndex != currentIndex) {
                    deColorSelectBars({ bars, indexes: [minIndex] });
                }
                minIndex = unsortedIndex;
                colorSelectBars({ bars, indexes: [minIndex] });
                yield delay({ timeout: visualizer.sortDelay });
            }
        }
        deColorSelectBars({ bars, indexes: [currentIndex, minIndex] });
        yield switchBars({ bars: bars, i: currentIndex, j: minIndex, visualizer });
        colorSortedBars({ bars, indexes: [currentIndex] });
    }
});
const colorSwapBars = ({ bars, indexes }) => {
    indexes.forEach(index => bars[index].domElement.classList.add("swapped"));
};
const deColorSwapBars = ({ bars, indexes }) => {
    indexes.forEach(index => bars[index].domElement.classList.remove("swapped"));
};
const switchBars = ({ bars, i, j, visualizer }) => __awaiter(void 0, void 0, void 0, function* () {
    colorSwapBars({ bars, indexes: [i, j] });
    const tempOrder = bars[i].domElement.style.order;
    bars[i].domElement.style.order = bars[j].domElement.style.order;
    bars[j].domElement.style.order = tempOrder;
    // TODO: one way to delay for animations
    yield delay({ timeout: visualizer.sortDelay });
    const temp = bars[i];
    bars[i] = bars[j];
    bars[j] = temp;
    deColorSwapBars({ bars, indexes: [i, j] });
});
