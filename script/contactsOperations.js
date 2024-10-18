/**
 * Load and render contacts from the server.
 */
async function loadContacts() {
    const contacts = await fetchContacts();
    if (contacts) renderContacts(contacts);
}


/**
 * Fetch contacts from the server.
 * @returns {Promise<Object>} The contacts data.
 */
async function fetchContacts() {
    const response = await fetch(`${BASE_URL}/contacts.json`);
    return response.json();
}


/**
 * Render contacts into the DOM.
 * @param {Object} contacts - The contacts to render.
 */
function renderContacts(contacts) {
    const contactContainer = document.querySelector('.contacts');
    contactContainer.innerHTML = '';
    const groupedContacts = groupContactsByFirstLetter(contacts);

    Object.entries(groupedContacts).forEach(([letter, contactList]) => {
        contactContainer.innerHTML += renderContactGroup(letter, contactList);
    });
}


/**
 * Group contacts by the first letter of their names.
 * @param {Object} contacts - The contacts to group.
 * @returns {Object} The grouped contacts.
 */
function groupContactsByFirstLetter(contacts) {
    const groupedContacts = groupByFirstLetter(contacts);
    return sortGroupedContacts(groupedContacts);
}


/**
 * Group contacts by their first letter.
 * @param {Object} contacts - The contacts to group.
 * @returns {Object} The grouped contacts.
 */
function groupByFirstLetter(contacts) {
    return Object.entries(contacts).reduce((groups, [id, contact]) => {
        if (isValidContactName(contact.name)) {
            const firstLetter = getFirstLetter(contact.name);
            groups[firstLetter] = groups[firstLetter] || [];
            groups[firstLetter].push({ ...contact, id });
        }
        return groups;
    }, {});
}


/**
 * Sort the grouped contacts alphabetically by their first letter.
 * @param {Object} groupedContacts - The contacts grouped by letter.
 * @returns {Object} The sorted grouped contacts.
 */
function sortGroupedContacts(groupedContacts) {
    return Object.keys(groupedContacts)
        .sort()
        .reduce((sortedGroups, letter) => {
            sortedGroups[letter] = groupedContacts[letter].sort(compareNames);
            return sortedGroups;
        }, {});
}


/**
 * Show the overlay for adding a new contact with a slide-in animation.
 */
function showAddContactOverlay() {
    const addContactOverlay = document.getElementById('add-contact-overlay');
    addContactOverlay.style.display = 'flex';
    addContactOverlay.classList.remove('slide-out');
    addContactOverlay.classList.add('slide-in');
    setTimeout(() => {
        addContactOverlay.classList.remove('slide-in');
    }, 200);
}


/**
 * Show the overlay for editing a contact with a slide-in animation.
 * @param {string} id - The contact ID.
 * @param {string} name - The contact name.
 * @param {string} email - The contact email.
 * @param {string} phone - The contact phone.
 * @param {string} initials - The contact initials.
 * @param {string} color - The avatar color.
 */
function showEditContact(id, name, email, phone, initials, color) {
    const editContactOverlay = document.getElementById('edit-contact-overlay');
    editContactOverlay.style.display = 'flex';
    editContactOverlay.classList.remove('slide-out');
    editContactOverlay.classList.add('slide-in');
    setTimeout(() => {
        editContactOverlay.classList.remove('slide-in');
    }, 200);

    updateEditContactFields(id, name, email, phone, initials, color);
}


/**
 * Hide the overlay for adding or editing a contact with a slide-out animation.
 * @param {Event} [event] - The event object if triggered by an event.
 */
function hideOverlay(event) {
    if (event) {
        event.stopPropagation();
    }
    handleOverlayAnimation('add-contact-overlay', 'edit-contact-overlay');
}


/**
 * Handles the overlay animation by adding and removing CSS classes and updating the display property.
 * @param {string} addOverlayId - The ID of the add contact overlay element.
 * @param {string} editOverlayId - The ID of the edit contact overlay element.
 */
function handleOverlayAnimation(addOverlayId, editOverlayId) {
    const addContactOverlay = document.getElementById(addOverlayId);
    const editContactOverlay = document.getElementById(editOverlayId);

    addContactOverlay.classList.add('slide-out');
    editContactOverlay.classList.add('slide-out');

    setTimeout(() => {
        addContactOverlay.style.display = 'none';
        editContactOverlay.style.display = 'none';
        addContactOverlay.classList.remove('slide-out');
        editContactOverlay.classList.remove('slide-out');
    }, 200);
}


/**
 * Validate the input fields for adding or editing a contact.
 * @param {string} name - The contact name.
 * @param {string} email - The contact email.
 * @param {string} phone - The contact phone.
 * @returns {boolean} Whether the input is valid.
 */
function validateContactInput(name, email, phone) {
    let isValid = true;

    if (!validateName(name)) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (!validatePhone(phone)) isValid = false;

    return isValid;
}


/**
 * Validates the name input to ensure only letters and spaces are allowed.
 * @param {string} name - The contact name to validate.
 * @returns {boolean} Whether the name is valid.
 */
function validateName(name) {
    if (!/^[A-Za-z\s]+$/.test(name)) {
        displayError('add-name', 'name-error', 'Only text allowed.');
        return false;
    }
    hideError('add-name', 'name-error');
    return true;
}


/**
 * Validates the email input to ensure it follows a valid email format.
 * @param {string} email - The contact email to validate.
 * @returns {boolean} Whether the email is valid.
 */
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        displayError('add-email', 'email-error', 'Please enter a valid email.');
        return false;
    }
    hideError('add-email', 'email-error');
    return true;
}


/**
 * Validates the phone input to ensure only numbers, spaces, and '+' are allowed.
 * @param {string} phone - The contact phone number to validate.
 * @returns {boolean} Whether the phone number is valid.
 */
function validatePhone(phone) {
    if (!/^[\d\s+]+$/.test(phone)) {
        displayError('add-phone', 'phone-error', 'Only numbers allowed.');
        return false;
    }
    hideError('add-phone', 'phone-error');
    return true;
}


/**
 * Displays an error message and adds a red border to the invalid input field.
 * @param {string} inputId - The ID of the input element to mark as invalid.
 * @param {string} errorId - The ID of the error message element.
 * @param {string} message - The error message to display.
 */
function displayError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add('invalid');
    document.getElementById(errorId).textContent = message;
    document.getElementById(errorId).style.display = 'block';
}


/**
 * Hides the error message and removes the red border from the input field.
 * @param {string} inputId - The ID of the input element to mark as valid.
 * @param {string} errorId - The ID of the error message element.
 */
function hideError(inputId, errorId) {
    document.getElementById(inputId).classList.remove('invalid');
    document.getElementById(errorId).style.display = 'none';
}


/**
 * Clears error messages and removes the red border from input fields.
 */
function clearValidationErrors() {
    const inputs = ['add-name', 'add-email', 'add-phone'];
    const errorMessages = ['name-error', 'email-error', 'phone-error'];

    inputs.forEach((inputId, index) => {
        const inputElement = document.getElementById(inputId);
        const errorElement = document.getElementById(errorMessages[index]);
        errorElement.style.display = 'none';

        inputElement.classList.remove('invalid');
    });
}
