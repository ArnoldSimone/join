/**
 * Base URL for the Firebase Realtime Database.
 * @constant {string}
 */
const BASE_URL = "https://join-5800e-default-rtdb.europe-west1.firebasedatabase.app/"


/**
 * Loads data from the database at the specified path.
 * @async
 * @function
 * @param {string} [path=""] - The path to the data in the database.
 * @returns {Promise<Object>} The retrieved data.
 */
async function loadFromDatabase(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}


/**
 * Posts new data to the database at the specified path.
 * @async
 * @function
 * @param {string} [path=""] - The path to store the data.
 * @param {Object} [data={}] - The data to be posted.
 * @returns {Promise<Object>} The response data.
 */
async function postToDatabase(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    let responseToJson = await response.json();
    return responseToJson;
}


/**
 * Updates data in the database at the specified path.
 * @async
 * @function
 * @param {string} [path=""] - The path to the data to update.
 * @param {Object} [data={}] - The new data to replace the existing data.
 * @returns {Promise<Object>} The updated data.
 */
async function updateOnDatabase(path = "", data = {}) {

    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    let responseToJson = await response.json();
    return responseToJson;
}


/**
 * Deletes data from the database at the specified path.
 * @async
 * @function
 * @param {string} [path=""] - The path to the data to delete.
 * @returns {Promise<Object>} The response after deletion.
 */
async function deleteFromDatabase(path = "") {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "DELETE",
    });
    let responseToJson = await response.json();
    return responseToJson;
}