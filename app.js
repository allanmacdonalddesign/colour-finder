// Add this to your JavaScript
document.addEventListener("DOMContentLoaded", function() {



    const apiKey = 'Your Google API';
    const cx = 'Your Google CX';

    let currentColorScheme = 'complementary';

    // The new event listener 

    document.querySelectorAll('#color-scheme-options input').forEach((input) => {
      input.addEventListener('click', function(event) {
        // stop the event from bubbling up to parent elements
        event.stopPropagation(); 

        currentColorScheme = this.value;
        console.log('Current Color Scheme:', currentColorScheme);  // Added console log

        const baseColorElement = document.querySelector('.base-color');
        if (baseColorElement) {
          const baseColor = chroma(baseColorElement.getAttribute('data-color'));
          showColorScheme(baseColor);
        } else {
          console.log('No base color element found.');  // Added console log
        }
      });
    });



function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function generateColorScheme(baseColor) {
  switch(currentColorScheme) {
    case 'monochromatic':
      return generateMonochromaticColors(baseColor);
    case 'complementary':
      return generateComplementaryColors(baseColor);
    case 'analogous':
      return generateAnalogousColors(baseColor);
    case 'split-complementary':
      return generateSplitComplementaryColors(baseColor);
    case 'triadic':
      return generateTriadicColors(baseColor);
    default:
      return [];
  }
}

function generateMonochromaticColors(baseColor) {
  return chroma.scale([baseColor, baseColor.brighten(2)]).colors(5).map(color => chroma(color));
      console.log("Monochromatic clicked");
}

function generateSplitComplementaryColors(baseColor) {
  const splitComplementaryColors = [];

  splitComplementaryColors.push(chroma(baseColor));
  splitComplementaryColors.push(chroma(baseColor).set('hsl.h', (baseColor.get('hsl.h') + 210) % 360));

  console.log("split complimentary clicked");
  return splitComplementaryColors;
}

function generateTriadicColors(baseColor) {
  const triadicColors = [];

  triadicColors.push(chroma(baseColor));
  triadicColors.push(chroma(baseColor).set('hsl.h', (baseColor.get('hsl.h') + 240) % 360));
  console.log("triadic clicked");
  return triadicColors;
}


function generateComplementaryColors(baseColor) {
  const numColors = 5;
  const hueShift = 180 / numColors;
  const complementaryColors = [];

  for (let i = 0; i < numColors; i++) {
    const shiftedHue = (baseColor.get('hsl.h') + hueShift * i) % 360;
    const complementaryColor = chroma(baseColor).set('hsl.h', shiftedHue);
    complementaryColors.push(complementaryColor);
  }
   console.log("complimentary clicked");
  return complementaryColors;
}

function generateAnalogousColors(baseColor) {
  const analogousColors = [];
  for(let i = 0; i < 5; i++) {
    analogousColors.push(chroma(baseColor).set('hsl.h', (baseColor.get('hsl.h') + i*20)%360));
  }
  console.log("analogous Clicked")
  return analogousColors;
}

function showColorScheme(baseColor) {
  // Use the generateColorScheme function to generate the color scheme
  const colorScheme = generateColorScheme(baseColor);

  const baseColorContainer = document.getElementById('base-color-container');
  if (baseColorContainer) {
    baseColorContainer.innerHTML = '';

    const baseColorElement = document.createElement('div');
    baseColorElement.classList.add('base-color');
    baseColorElement.setAttribute('data-color', baseColor.hex());
    baseColorElement.innerHTML = baseColor.hex();
    baseColorElement.style.backgroundColor = baseColor.hex();
    baseColorElement.style.padding = '25px';
    baseColorContainer.appendChild(baseColorElement);
  } else {
    console.error("Element with id 'base-color-container' not found");
  }

  const complementaryColorSchemeContainer = document.getElementById('complementary-color-scheme');
  if (complementaryColorSchemeContainer) {
    complementaryColorSchemeContainer.innerHTML = '';

    const schemeColorsContainer = document.createElement('div');
    schemeColorsContainer.classList.add('scheme-colors');

    colorScheme.forEach(color => {
      const colorElement = document.createElement('div');
      colorElement.innerHTML = color.hex ? color.hex() : color;
      colorElement.style.backgroundColor = color.hex ? color.hex() : color;
      colorElement.style.padding = '25px';
      schemeColorsContainer.appendChild(colorElement);
    });

    complementaryColorSchemeContainer.appendChild(schemeColorsContainer);

    const drawer = document.getElementById('drawer');
    drawer.classList.add('drawer-open');
    console.log('Drawer classList after adding drawer-open:', drawer.classList);

  } else {
    console.error("Element with id 'complementary-color-scheme' not found");
  }
}

    function searchImages() {
      const query = document.getElementById('search-input').value;
      searchGoogleImages(query);
    }

    document.getElementById('search-input').addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        searchImages();
      }
    });


    async function searchGoogleImages(query) {
      const numResults = 20;
      const resultsPerPage = 10;
      const dataItems = [];

      for (let start = 1; start <= numResults; start += resultsPerPage) {
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&searchType=image&q=${encodeURIComponent(
            query
          )}&start=${start}`
        );
        const data = await response.json();

        if (data.items) {
          dataItems.push(...data.items);
        }
      }

      const resultsContainer = document.getElementById("results-container");
      resultsContainer.innerHTML = "";

      for (const item of dataItems) {
          const dominantColor = await getDominantColor(item.link);
          const colorBox = document.createElement("div");
          colorBox.classList.add("color-box");

          const imgElement = document.createElement("img");
          imgElement.src = item.link;
          imgElement.alt = "Sampled image";
          imgElement.style.width = "100px";
          imgElement.style.height = "100px";
          colorBox.appendChild(imgElement);

          const colorLabel = document.createElement("div");
          colorLabel.setAttribute('data-color', dominantColor);
          colorLabel.innerHTML = dominantColor;
          colorLabel.style.backgroundColor = dominantColor;
          colorLabel.style.padding = "25px";
          colorLabel.style.marginTop = "25px";
          colorBox.appendChild(colorLabel);

          colorBox.addEventListener('click', function() {
              const baseColor = chroma(colorLabel.getAttribute('data-color'));
              showColorScheme(baseColor);
              const drawer = document.getElementById('drawer');
              drawer.classList.add('drawer-open');
          });

          resultsContainer.appendChild(colorBox);
      }
    }

    async function getDominantColor(imgUrl) {
      return new Promise((resolve, reject) => {
        const corsProxyUrl = 'http://localhost:8080/';
        const corsImgUrl = corsProxyUrl + imgUrl;

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = corsImgUrl;

        img.onload = () => {
          const colorThief = new ColorThief();
          const rgbColor = colorThief.getColor(img);
          const hexColor = rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]);
          resolve(hexColor);
        };

        img.onerror = (event) => {
          console.error(`Error loading image: ${imgUrl}`);
          reject(new Error(`Error loading image: ${imgUrl}`));
        };
      });
    }

 document.getElementById('drawer-close').addEventListener('click', function() {
   const drawer = document.getElementById('drawer');
   drawer.classList.remove('drawer-open');  // explicitly close the drawer
 });


 console.log('Running color picker code...');

const baseColorPicker = document.querySelector('#base-color-picker');
if (baseColorPicker) {
  console.log('Found base color picker.');
  baseColorPicker.addEventListener('input', function(event) {
    const baseColor = chroma(this.value);
    showColorScheme(baseColor);
  });
} else {
  console.log('Did not find base color picker.');
}

const drawer = document.getElementById('drawer');
drawer.classList.add('drawer-open'); 



    });
