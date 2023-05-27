let username = "Ari"
console.log(`Hello, ${username} !!`)

interface styleType {
  [key: string]: string;
}

const getRandomNumberBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
}

const getBarHeights = (): number[] => {
  return Array.from({ length: getRandomNumberBetween(1, 500) }, (x, i) => {
    return getRandomNumberBetween(1, 1000);
  });
}


const styler = (element: HTMLDivElement, style: styleType): HTMLDivElement => {
  for (const styleProperty in style) {
    // TODO: figure out this issue
    element.style[styleProperty] = style[styleProperty];
  }

  return element;
}

const styleObj: styleType = {
  'background-color': 'blue',
  'color': 'red'
}

const visualizerContainerQuery = document.getElementsByClassName("visualizer-container");

// const placeGenerateBarsButton = (): HTMLButtonElement => {
//   const generateButton = document.createElement('button');
//   generateButton.innerHTML = "Generate Bars";
//   generateButton.onclick = generateBars;
//   return generateButton;
// }

const generateBars = () => {
  if (visualizerContainerQuery.length > 0) {
    const visualizerContainer = visualizerContainerQuery[0];

    // Clear all of the bars that might be there from a previous run
    visualizerContainer.innerHTML = "";

    // // Put the "Generate Bars" button on the DOM which randomly generates a set of bars
    // visualizerContainer?.appendChild(placeGenerateBarsButton());

    getBarHeights().forEach(barHeight => {
      // Create the bar div element
      const mainDiv = document.createElement('div');

      // Insert it's height as text
      mainDiv.innerHTML = `${barHeight}`;

      // Style it
      const styledDiv = styler(mainDiv, styleObj)
      styledDiv.style.width = `${barHeight}px`;

      visualizerContainer?.appendChild(styledDiv);
    });
  }
}
