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
 * Check if the contact has a valid name.
 * @param {string} name - The name to validate.
 * @returns {boolean} Whether the name is valid.
 */
function isValidContactName(name) {
    return name && typeof name === 'string';
}


/**
 * Get the first letter of a name in uppercase.
 * @param {string} name - The name to process.
 * @returns {string} The first letter of the name.
 */
function getFirstLetter(name) {
    return name[0].toUpperCase();
}


/**
 * Compare two contact names alphabetically.
 * @param {Object} a - The first contact object.
 * @param {Object} b - The second contact object.
 * @returns {number} The comparison result.
 */
function compareNames(a, b) {
    return a.name.localeCompare(b.name);
}


/**
 * Display contact details in the contact detail view.
 * @param {string} id - The contact ID.
 * @param {string} name - The contact name.
 * @param {string} email - The contact email.
 * @param {string} phone - The contact phone.
 * @param {string} initials - The contact initials.
 * @param {string} color - The avatar color.
 */
function showContactDetails(id, name, email, phone, initials, color) {
    selectContact(id);
    toggleContactListVisibility();
    updateContactDetails(id, name, email, phone, initials, color);
}


/**
 * Toggle the visibility of the contact list for smaller screens.
 */
function toggleContactListVisibility() {
    if (window.innerWidth <= 1000) {
        document.querySelector('.contact-list').style.display = 'none';
        document.querySelector('.close-btn').style.display = 'block';
    }
}


/**
 * Update the contact details section with the selected contact's data.
 * @param {string} id - The contact ID.
 * @param {string} name - The contact name.
 * @param {string} email - The contact email.
 * @param {string} phone - The contact phone.
 * @param {string} initials - The contact initials.
 * @param {string} color - The avatar color.
 */
function updateContactDetails(id, name, email, phone, initials, color) {
    const contactDetails = document.getElementById('contact-details');
    document.querySelector('.contact-name').textContent = name;
    document.querySelector('.contact-avatar').innerHTML = createAvatar(initials, color);
    document.getElementById('contact-email').textContent = email;
    document.getElementById('contact-phone').textContent = phone;
    document.getElementById('edit-contact-id').value = id;
    document.querySelector('.edit-btn').onclick = () => showEditContact(id, name, email, phone, initials, color);
    displayContactDetailContainer(contactDetails);
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


/**
 * Display the contact detail container with a slide-in animation.
 * @param {HTMLElement} contactDetails - The contact details container element.
 */
function displayContactDetailContainer(contactDetails) {
    document.querySelector('#contactDetail').style.display = 'block';
    contactDetails.style.display = 'block';
    contactDetails.classList.remove('slide-out');
    contactDetails.classList.add('slide-in');

    setTimeout(() => {
        contactDetails.classList.remove('slide-in');
    }, 200);
}


/**
 * Hide the contact details and show the contact list on smaller screens.
 */
function hideContactDetails() {
    const contactDetails = document.getElementById('contact-details');
    contactDetails.style.display = 'none';
    if (window.innerWidth <= 1000) {
        document.querySelector('.contact-list').style.display = 'block';
    }
    const closeButton = document.querySelector('.close-btn');
    closeButton.style.display = 'none';
    const editBtn = document.getElementById("edit-btn");
    const deleteBtn = document.getElementById("delete-btn");

    editBtn.classList.remove("show");
    deleteBtn.classList.remove("show");
}



/**
 * Select a contact by adding a selected class.
 * @param {string} id - The ID of the contact to select.
 */
function selectContact(id) {
    const contacts = document.querySelectorAll('.contact');
    contacts.forEach(contact => contact.classList.remove('selected-contact'));

    const selectedContact = document.querySelector(`.contact[onclick*="'${id}'"]`);
    if (selectedContact) {
        selectedContact.classList.add('selected-contact');
    }
}


/**
 * Check button position and update background colors for edit and delete buttons.
 */
function checkButtonPositionAndSetColor() {
    var editBtn = document.getElementById('edit-btn');
    var deleteBtn = document.getElementById('delete-btn');
  
    function updateButtonBackgroundColor() {
      if (getComputedStyle(editBtn).position === 'fixed') {
        editBtn.style.backgroundColor = 'white';
        deleteBtn.style.backgroundColor = 'white';
      } else {
        editBtn.style.backgroundColor = ''; 
        deleteBtn.style.backgroundColor = ''; 
      }
    }
  
    updateButtonBackgroundColor();

    window.addEventListener('resize', updateButtonBackgroundColor); 
}
  

/**
 * Toggle the visibility of edit and delete buttons.
 */
function toggleEditDelete() {
    const editBtn = document.getElementById("edit-btn");
    const deleteBtn = document.getElementById("delete-btn");
  
    if (editBtn.classList.contains("show")) {
      editBtn.classList.remove("show");
      deleteBtn.classList.remove("show");
    } else {
      editBtn.classList.add("show");
      deleteBtn.classList.add("show");
    }
  }
  

/**
 * Validate the input fields for adding or editing a contact.
 * @param {string} name - The contact name.
 * @param {string} email - The contact email.
 * @param {string} phone - The contact phone.
 * @returns {boolean} Whether the input is valid.
 */
function validateContactInput(name, email, phone) {
    return name && email && phone;
}


/**
 * Add a new contact and save it to the server.
 * @returns {Promise<boolean>} Whether the contact was added successfully.
 */
async function addNewContact() {
    const name = document.getElementById('add-name').value.trim();
    const email = document.getElementById('add-email').value.trim();
    const phone = document.getElementById('add-phone').value.trim();
    if (!validateContactInput(name, email, phone)) return false;
    const contact = { name, email, phone, avatar: generateAvatar(name) };
    const response = await saveContact(contact);
    if (response) {
        clearInputFields();
        hideOverlay();
        loadContacts();
        return true;
    }
    return false;
}


/**
 * Clear the input fields for adding or editing contacts.
 */
function clearInputFields() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-email').value = '';
    document.getElementById('add-phone').value = '';
}


/**
 * Save a new contact to the server.
 * @param {Object} contact - The contact object.
 * @returns {Promise<boolean>} Whether the contact was saved successfully.
 */
async function saveContact(contact) {
    const response = await fetch(`${BASE_URL}/contacts.json`, {
        method: 'POST',
        body: JSON.stringify(contact),
        headers: { 'Content-Type': 'application/json' }
    });

    return response.ok;
}


/**
 * Edit an existing contact and save changes to the server.
 * @returns {Promise<boolean>} Whether the contact was edited successfully.
 */
async function editContact() {
    const contactData = getContactData();
    if (!contactData) return false;

    const response = await updateContact(contactData);
    if (response.ok) {
        hideOverlay();
        loadContacts();
        updateContactDetails(contactData.id, contactData.name, contactData.email, contactData.phone, contactData.avatar.initials, contactData.avatar.color);
        return true;
    }

    return false;
}


/**
 * Get contact data from the input fields for editing.
 * @returns {Object|null} The contact data or null if invalid.
 */
function getContactData() {
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const id = document.getElementById('edit-contact-id').value;

    if (!name || !email || !phone) return null;

    return { name, email, phone, avatar: generateAvatar(name), id };
}


/**
 * Update an existing contact on the server.
 * @param {Object} contact - The contact object.
 * @returns {Promise<Response>} The fetch response.
 */
async function updateContact({ name, email, phone, avatar, id }) {
    return await fetch(`${BASE_URL}/contacts/${id}.json`, {
        method: 'PATCH',
        body: JSON.stringify({ name, email, phone, avatar }),
        headers: { 'Content-Type': 'application/json' }
    });
}


/**
 * Get the ID of the contact being edited.
 * @returns {string} The contact ID.
 */
function getEditContactId() {
    return document.getElementById('edit-contact-id').value;
}


/**
 * Delete a contact from the server.
 * @returns {Promise<boolean>} Whether the contact was deleted successfully.
 */
async function deleteContact() {
    const id = getEditContactId();
    if (!id) return false;

    const response = await fetch(`${BASE_URL}/contacts/${id}.json`, { method: 'DELETE' });
    if (response.ok) {
        hideOverlay();
        loadContacts();
        document.getElementById('contact-details').style.display = 'none';
        return true;
    }

    return false;
}


/**
 * Generate an avatar object with initials and a random color.
 * @param {string} name - The contact name.
 * @returns {Object} The avatar object.
 */
function generateAvatar(name) {
    return {
        initials: name.split(' ').map(n => n[0]).join(''),
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    };
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
 * Update the input fields and avatar for editing a contact.
 * @param {string} id - The contact ID.
 * @param {string} name - The contact name.
 * @param {string} email - The contact email.
 * @param {string} phone - The contact phone.
 * @param {string} initials - The contact initials.
 * @param {string} color - The avatar background color.
 */
function updateEditContactFields(id, name, email, phone, initials, color) {
    document.getElementById('edit-name').value = name || '';
    document.getElementById('edit-email').value = email || '';
    document.getElementById('edit-phone').value = phone || '';
    document.getElementById('edit-contact-id').value = id;

    const avatarElement = document.getElementById('edit-avatar');
    avatarElement.style.backgroundColor = color;
    avatarElement.textContent = initials;
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
 * Clear the input fields for both adding and editing contacts.
 */
function clearInputs() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-email').value = '';
    document.getElementById('add-phone').value = '';
    document.getElementById('edit-name').value = '';
    document.getElementById('edit-email').value = '';
    document.getElementById('edit-phone').value = '';
}