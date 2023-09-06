# colour-finder

This code is a color scheme generator and image searcher combined into one application. Here's a breakdown of what the code does:

Initialization:

1. After the DOM (Document Object Model) is fully loaded (DOMContentLoaded), the script begins.
apiKey and cx are placeholders where the user is expected to put in their own Google API key and cx (Custom Search engine ID) respectively.
currentColorScheme holds the currently chosen color scheme. It defaults to 'complementary'.

Event Listeners:

1. It listens for clicks on color scheme options (e.g. monochromatic, complementary, analogous, etc.), changes the currentColorScheme accordingly, and then generates the appropriate color scheme.
2. An event listener is attached to an input field (search-input) that triggers the searchImages function when the 'Enter' key is pressed.
3. Another listener is attached to a drawer close button to close a UI drawer when clicked.
4. A color picker (base-color-picker) is setup to listen for color changes. When the user selects a color using this picker, the chosen color scheme is generated using the picked color.

Color Scheme Generation:

1. There are various functions dedicated to generating specific types of color schemes (monochromatic, complementary, etc.).
2. All of these functions take a base color as input and return an array of colors fitting the chosen scheme.
3. These colors are then displayed using the showColorScheme function, which updates the DOM to show the base color and the generated color scheme.

Image Search:

1. The searchGoogleImages function fetches images from Google's Custom Search API based on the query entered by the user.
2. Once the images are fetched, the dominant color from each image is extracted using the getDominantColor function.
3. The fetched images, along with their dominant colors, are displayed in the results-container. When a user clicks on one of these dominant colors, it becomes the new base color and the chosen color scheme is generated using this color.

CORS Handling:

1. The getDominantColor function uses a CORS (Cross-Origin Resource Sharing) proxy (corsProxyUrl). This is used because fetching images directly from external sources can lead to CORS issues. This part requires the user to set up a local CORS proxy (on localhost:8080) or use a public one.

Color Extraction:

1. The getDominantColor function extracts the dominant color from an image using the ColorThief library (not included in the given code but assumed to be part of the project).

Utility Functions:

1. rgbToHex converts RGB values to their HEX representation.

**How to Get Your Own APIs:**

Google Custom Search:

1. Go to Google Cloud Console.
2. Create a new project.
3. Navigate to "APIs & Services" and enable the "Custom Search API".
4. Create an API key for authentication.
5. Next, set up a Custom Search Engine to get the cx (context) value. This can be done from Google's CSE tool.
6. Enter your website or the websites you want the search to be scoped to.
7. Once set up, you'll receive a cx value which is your Custom Search engine ID.

CORS Proxy:

The code uses a local CORS proxy. If you don't want to set one up locally, you can use public services like https://cors-anywhere.herokuapp.com/. Replace the corsProxyUrl with the public service's URL. Please note that using public proxies can come with risks and limitations.

Lastly, make sure to include libraries or dependencies (like chroma and ColorThief) required for this code to work.
