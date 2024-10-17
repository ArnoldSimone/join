/**
 * Loads HTML content into elements with the `w3-include-html` attribute.
 * This function searches for all elements that have the `w3-include-html` attribute 
 * and asynchronously loads the specified HTML content from the given URL. * 
 * @returns {Promise<void>} A promise that resolves when all 
 *                         HTML content has been successfully loaded and inserted into the elements.
 * @throws {Error} If loading an HTML file fails, an error message is logged to the console.
 */
function includeHTML() {
    const elements = document.querySelectorAll("[w3-include-html]");
    let promises = [];
    elements.forEach(element => {
        const file = element.getAttribute("w3-include-html");
        if (file) {
            console.log(`Lade ${file}...`);
            const promise = fetch(file)
                .then(response => {
                    if (!response.ok) throw new Error(`Error loading ${file}`);
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                    element.removeAttribute("w3-include-html");
                    console.log(`${file} geladen!`);
                })
                .catch(error => console.error(error));
            promises.push(promise);
        }
    });
    return Promise.all(promises);
}

