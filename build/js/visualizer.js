var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class Visualizer {
    constructor({ maxBars, styleObj, visualizerContainerQuery }) {
        this.bars = [];
        this.bubbleSort = () => __awaiter(this, void 0, void 0, function* () {
            const numberOfBars = this.bars.length;
            // The unsortedCount is the length of the part of the array that's not yet sorted
            let unsortedCount = numberOfBars - 1;
            // The unsortedCount just keeps track of which iteration we're on
            while (unsortedCount > 0) {
                // The index is what's really in charge of the manipulation
                for (let index = 0; index < unsortedCount; index++) {
                    const nextIndex = index + 1;
                    this.setCurrentBarColor({ index: nextIndex, color: "red" });
                    if (this.bars[index].height > this.bars[nextIndex].height) {
                        yield this.switchBars({ bars: this.bars, i: index, j: nextIndex });
                    }
                    this.setCurrentBarColor({ index: nextIndex, color: "white" });
                }
                unsortedCount--;
            }
        });
        this.delay = () => {
            return new Promise(resolve => {
                setTimeout(() => resolve(''), this.sortSpeed);
            });
        };
        this.generateBars = () => {
            this.bars = this.getRandomBarValues();
            if (this.visualizerContainerQuery.length > 0) {
                const visualizerContainer = this.visualizerContainerQuery[0];
                // Clear all of the bars that might be there from a previous run
                visualizerContainer.innerHTML = "";
                // // Put the "Generate Bars" button on the DOM which randomly generates a set of bars
                // visualizerContainer?.appendChild(placeGenerateBarsButton());
                this.bars.forEach((bar, index) => {
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
                    visualizerContainer === null || visualizerContainer === void 0 ? void 0 : visualizerContainer.appendChild(domElement);
                });
                return this.bars.length;
            }
            return null;
        };
        this.getRandomBarValues = () => {
            return Array.from({ length: this.getRandomNumberBetween(1, this.maxBars) }, (x) => {
                const height = this.getRandomNumberBetween(1, this.maxBars);
                const heightPercentOfViewport = height / this.maxBars * 100;
                return {
                    domElement: null,
                    height,
                    heightPercentOfViewport
                };
            });
        };
        this.getRandomNumberBetween = (min, max) => {
            return Math.floor(Math.random() * (max - min) + min);
        };
        // TODO: see if we can clean this up at all
        this.merge = ({ startingIndex, pivot, endingIndex }) => {
            var _a;
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
                    leftArray[leftArrayIndex] = this.bars[currentIndex];
                    leftArrayIndex++;
                }
                else {
                    rightArray[rightArrayIndex] = this.bars[currentIndex];
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
                        this.bars[currentIndex] = leftArray[leftArrayIndex];
                        leftArrayIndex++;
                    }
                    else {
                        this.bars[currentIndex] = rightArray[rightArrayIndex];
                        rightArrayIndex++;
                    }
                    // If the indexes are not in range, then that means that either the left 
                    // or the right array have elements remaining
                    // Just need to go through and assign them one by one
                }
                else if (leftArrayIndex < leftArraySize) {
                    this.bars[currentIndex] = leftArray[leftArrayIndex];
                    leftArrayIndex++;
                }
                else {
                    this.bars[currentIndex] = rightArray[rightArrayIndex];
                    rightArrayIndex++;
                }
                (_a = this.bars[currentIndex].domElement) === null || _a === void 0 ? void 0 : _a.style.order = `${currentIndex}`;
            }
        };
        this.mergeSort = ({ startingIndex, endingIndex } = { startingIndex: 0, endingIndex: this.bars.length - 1 }) => {
            // Base case. Nothing left to do here
            if (startingIndex == endingIndex)
                return;
            const pivot = Math.floor((startingIndex + endingIndex) / 2);
            this.mergeSort({ startingIndex, endingIndex: pivot });
            this.mergeSort({ startingIndex: pivot + 1, endingIndex });
            this.merge({ startingIndex, pivot, endingIndex });
        };
        this.partition = ({ bars, startingIndex, endingIndex }) => __awaiter(this, void 0, void 0, function* () {
            const pivot = bars[endingIndex];
            let i = startingIndex - 1;
            for (let currentIndex = startingIndex; currentIndex <= endingIndex - 1; currentIndex++) {
                this.setCurrentBarColor({ index: currentIndex, color: "red" });
                if (bars[currentIndex].height < pivot.height) {
                    i++;
                    yield this.switchBars({ bars: this.bars, i, j: currentIndex });
                }
                this.setCurrentBarColor({ index: currentIndex, color: "white" });
            }
            i++;
            this.setCurrentBarColor({ index: endingIndex, color: "red" });
            yield this.switchBars({ bars, i, j: endingIndex });
            this.setCurrentBarColor({ index: endingIndex, color: "white" });
            return i;
        });
        // TODO: Fix this algo
        this.quickSort = ({ bars, startingIndex, endingIndex } = { bars: this.bars, startingIndex: 0, endingIndex: this.bars.length - 1 }) => {
            // Base case. Nothing left to do here
            if (endingIndex <= startingIndex)
                return;
            const pivot = this.partition({ bars, startingIndex, endingIndex });
            this.quickSort({ bars, startingIndex, endingIndex: pivot - 1 });
            this.quickSort({ bars, startingIndex: pivot + 1, endingIndex });
        };
        this.setCurrentBarColor = ({ bars = this.bars, index, color }) => {
            const currentBarElement = bars[index].domElement;
            currentBarElement.style.backgroundColor = color;
        };
        this.selectionSort = () => __awaiter(this, void 0, void 0, function* () {
            const numberOfBars = this.bars.length;
            for (let currentIndex = 0; currentIndex < numberOfBars; currentIndex++) {
                let minIndex = currentIndex;
                this.setCurrentBarColor({ index: currentIndex, color: "red" });
                // Find the shortest bar in the unsorted array
                for (let unsortedIndex = currentIndex + 1; unsortedIndex < numberOfBars; unsortedIndex++) {
                    if (this.bars[unsortedIndex].height < this.bars[minIndex].height) {
                        minIndex = unsortedIndex;
                    }
                }
                yield this.switchBars({ bars: this.bars, i: currentIndex, j: minIndex });
                this.setCurrentBarColor({ index: currentIndex, color: "white" });
            }
        });
        this.setMaxBars = ({ maxBars }) => {
            this.maxBars = maxBars;
        };
        this.setSortSpeed = ({ sortSpeed }) => {
            this.sortSpeed = sortSpeed;
        };
        this.styler = (element, style) => {
            for (const styleProperty in style) {
                // TODO: figure out this issue
                element.style[styleProperty] = style[styleProperty];
            }
            return element;
        };
        this.switchBars = ({ bars, i, j }) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const tempOrder = (_a = bars[i].domElement) === null || _a === void 0 ? void 0 : _a.style.order;
            (_b = bars[i].domElement) === null || _b === void 0 ? void 0 : _b.style.order = bars[j].domElement.style.order;
            bars[j].domElement.style.order = tempOrder;
            yield this.delay();
            const temp = bars[i];
            bars[i] = bars[j];
            bars[j] = temp;
        });
        this.maxBars = maxBars || 0;
        this.sortSpeed = 100;
        this.visualizerContainerQuery = visualizerContainerQuery;
        this.styleObj = styleObj || {
            'background-color': 'blue',
            'color': 'red'
        };
    }
}
