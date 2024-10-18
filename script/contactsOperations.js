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
