/**
 * Renders a group of contacts by their starting letter.
 *
 * @param {string} letter - The starting letter of the contact group.
 * @param {Array} contactList - The list of contacts belonging to this group.
 * @param {Object} contactList[].id - The unique identifier of the contact.
 * @param {Object} contactList[].name - The name of the contact.
 * @param {Object} contactList[].email - The email of the contact.
 * @param {Object} contactList[].phone - The phone number of the contact.
 * @param {Object} contactList[].avatar - The avatar details of the contact.
 * @param {string} contactList[].avatar.initials - The initials displayed in the avatar.
 * @param {string} contactList[].avatar.color - The background color of the avatar.
 * @returns {string} The HTML string for the contact group.
 */
function renderContactGroup(letter, contactList) {
    return `
        <div class="contact-group">
            <h2>${letter}</h2>
            <hr>
            ${contactList.map(contact => renderContact(contact)).join('')}
        </div>
    `;
}


/**
 * Renders a single contact's information.
 *
 * @param {Object} contact - The contact object to render.
 * @param {string} contact.id - The unique identifier of the contact.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.email - The email of the contact.
 * @param {string} contact.phone - The phone number of the contact.
 * @param {Object} contact.avatar - The avatar details of the contact.
 * @param {string} contact.avatar.initials - The initials displayed in the avatar.
 * @param {string} contact.avatar.color - The background color of the avatar.
 * @returns {string} The HTML string for the single contact.
 */
function renderContact(contact) {
    return `
        <div class="contact" onclick="showContactDetails('${contact.id}', '${contact.name}', '${contact.email}', '${contact.phone}', '${contact.avatar.initials}', '${contact.avatar.color}')">
            <span class="avatar" style="background-color:${contact.avatar.color};">${contact.avatar.initials}</span>
            <div class="contact-info">
                <span class="name">${contact.name}</span>
                <span class="email">${contact.email}</span>
            </div>
        </div>
    `;
}


/**
 * Create an avatar element with the given initials and background color.
 * @param {string} initials - The avatar initials.
 * @param {string} color - The avatar background color.
 * @returns {string} The avatar HTML element.
 */
function createAvatar(initials, color) {
    return `<span class="avatar-details d-flex" style="background-color:${color};">${initials}</span>`;
}