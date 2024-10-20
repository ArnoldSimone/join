/**
 * Loads external HTML content into elements that have the 'w3-include-html' attribute.
 * Fetches the HTML file specified in the attribute and includes it into the element's innerHTML.
 * If the file is not found, sets the element's innerHTML to 'Page not found'.
 * After loading all content, it calls the `menuColor()` function to set the appropriate menu styling.
 * 
 * @async
 * @function includeHTML
 * @returns {Promise<void>} A promise that resolves when all HTML content is included and `menuColor` is called.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    menuColor();
    await initializeUserFeatures();
}