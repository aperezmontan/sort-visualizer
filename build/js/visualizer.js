export default class Visualizer {
    constructor({ maxBars, styleObj, visualizerContainerQuery }) {
        this.bars = [];
        this.delay = () => {
            return new Promise(resolve => {
                setTimeout(() => resolve(''), this.sortSpeed);
            });
        };
        this.generateBars = () => {
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
                    // Let's make this a tooltip because text doesn't look great at this pixel width
                    // bar.innerHTML = `${height}`;
                    // Style it
                    // const styledDiv = this.styler(bar, this.styleObj)
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
            return Array.from({ length: this.getRandomNumberBetween(1, this.maxBars) }, (x) => {
                const height = this.getRandomNumberBetween(1, this.maxBars);
                const heightPercentOfViewport = height / this.maxBars * 100;
                return {
                    height,
                    heightPercentOfViewport
                };
            });
        };
        this.getRandomNumberBetween = (min, max) => {
            return Math.floor(Math.random() * (max - min) + min);
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
        this.styler = (element, style) => {
            for (const styleProperty in style) {
                // TODO: figure out this issue
                element.style[styleProperty] = style[styleProperty];
            }
            return element;
        };
        this.maxBars = maxBars || 0;
        this.sortSpeed = 100;
        this.visualizerContainerQuery = visualizerContainerQuery;
        this.styleObj = styleObj || {
            'background-color': 'blue',
            'color': 'red'
        };
    }
}
