export default class Visualizer {
    constructor({ maxBars, visualizerContainerQuery }) {
        this.bars = [];
        this.delay = () => {
            return new Promise(resolve => {
                setTimeout(() => resolve(''), this.sortSpeed);
            });
        };
        this.generateBars = () => {
            // TODO: stop any running sorts
            // this.stopSorts()
            if (this.visualizerContainerQuery.length > 0) {
                const visualizerContainer = this.visualizerContainerQuery[0];
                // Clear all of the bars that might be there from a previous run
                visualizerContainer.innerHTML = "";
                // Put the "Generate Bars" button on the DOM which randomly generates a set of bars
                this.bars = this.getRandomBarValues().map((barValue, index) => {
                    const { heightPercentOfViewport } = barValue;
                    // Create the bar div element
                    const domElement = document.createElement('div');
                    domElement.className = "bar";
                    domElement.style.height = `${heightPercentOfViewport}%`;
                    domElement.style.order = `${index}`;
                    const bar = Object.assign({ domElement }, barValue);
                    return bar;
                });
                // Put bars on the DOM
                visualizerContainer === null || visualizerContainer === void 0 ? void 0 : visualizerContainer.append(...this.bars.map(bar => bar.domElement));
                return this.bars.length;
            }
            return null;
        };
        this.getRandomBarValues = () => {
            return Array.from({ length: this.getRandomNumberBetween(1, this.maxBars) }, (x, originalOrder) => {
                const height = this.getRandomNumberBetween(1, this.maxBars);
                const heightPercentOfViewport = height / this.maxBars * 100;
                return {
                    height,
                    heightPercentOfViewport,
                    originalOrder
                };
            });
        };
        this.getRandomNumberBetween = (min, max) => {
            return Math.floor(Math.random() * (max - min) + min);
        };
        this.hasBars = () => {
            return this.bars.length > 0;
        };
        this.isSorted = () => {
            if (!this.hasBars()) {
                alert("No bars");
                return false;
            }
            let lastBar = this.bars[0];
            return this.bars.every((bar) => {
                const nextBarTaller = bar.height >= lastBar.height;
                lastBar = bar;
                return nextBarTaller;
            });
        };
        this.unsortBars = () => {
            // Only merge sort can be reset by changing style.order. 
            // All the other sorts actually change the order of the bar in place, 
            // so this needs to be undone.
            this.bars.sort((barA, barB) => {
                return barA.originalOrder - barB.originalOrder;
            }).forEach((bar, index) => this.bars[index].domElement.style.order = `${bar.originalOrder}`);
        };
        // setCurrentBarColor = ({ bars = this.bars, index, color }) => {
        //   const currentBarElement = bars[index].domElement;
        //   currentBarElement.style.backgroundColor = color;
        // }
        this.setMaxBars = ({ maxBars }) => {
            this.maxBars = maxBars;
        };
        this.setSortSpeed = ({ sortSpeed }) => {
            this.sortSpeed = sortSpeed;
        };
        this.sort = ({ algorithm }) => {
            const args = {
                bars: this.bars,
                startingIndex: 0,
                endingIndex: this.bars.length - 1
            };
            algorithm(args);
        };
        this.maxBars = maxBars || 0;
        this.sortSpeed = 100;
        this.visualizerContainerQuery = visualizerContainerQuery;
    }
}
