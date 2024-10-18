/**
 * Navigates the user back to the previous page in their browser history.
 * If there is no previous page, the function does nothing.
 *
 * @function goBack
 * @returns {void}
 */
function goBack() {
    window.history.back();
}