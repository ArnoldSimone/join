/**
 * Check if the contact has a valid name.
 * @param {string} name - The name to validate.
 */
function isValidContactName(name) {
    return name && typeof name === 'string';
}


/**
 * Get the first letter of a name in uppercase.
 * @param {string} name - The name to process.
 */
function getFirstLetter(name) {
    return name[0].toUpperCase();
}


/**
 * Compare two contact names alphabetically.
 * @param {Object} a - The first contact object.
 * @param {Object} b - The second contact object.
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
    document.querySelector('.contact-avatar').style.backgroundColor = color; 
    document.querySelector('.contact-avatar').textContent = initials;
    document.getElementById('contact-email').textContent = email;
    document.getElementById('contact-phone').textContent = phone;
    document.getElementById('edit-contact-id').value = id;
    document.querySelector('.edit-btn').onclick = () => showEditContact(id, name, email, phone, initials, color);
    displayContactDetailContainer(contactDetails);
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
 * Adds a new contact by validating the input, saving the contact to Firebase,
 * and displaying a success message upon completion.
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
        showPopup('Contact added successfully');
        return true;
    }
    return false;
}


/**
 * Saves a contact to Firebase by making a POST request to the Firebase contacts endpoint.
 * 
 * @async
 * @param {Object} contact - The contact object to be saved.
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
 * Clear the input fields for adding or editing contacts.
 */
function clearInputFields() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-email').value = '';
    document.getElementById('add-phone').value = '';
}


/**
 * Edits a contact's details and updates the contact in the backend.
 * @async
 */
async function editContact() {
    const contactData = getContactData();
    if (!contactData) return false;

    setContactAvatar(contactData);
    const response = await updateContact(contactData);
    if (response.ok && contactData.name !== document.getElementById('edit-name').getAttribute('data-original-name')) {
        await updateContactNameInTasks(contactData.id, contactData.name);
    }

    return handleContactUpdate(response, contactData);
}


/**
 * Sets the contact's avatar based on whether the name has changed.
 * @param {Object} contactData - The data of the contact being edited.
 */
function setContactAvatar(contactData) {
    const currentName = document.getElementById('edit-name').getAttribute('data-original-name');

    if (contactData.name !== currentName) {
        contactData.avatar = generateAvatar(contactData.name);
    } else {
        contactData.avatar = { 
            initials: document.getElementById('edit-avatar').textContent, 
            color: document.getElementById('edit-avatar').style.backgroundColor 
        };
    }
}


/**
 * Handles the contact update process after an update request.
 * @param {Response} response - The response from the backend after attempting to update the contact.
 * @param {Object} contactData - The data of the contact being edited.
 */
function handleContactUpdate(response, contactData) {
    if (response.ok) {
        hideOverlay();
        loadContacts();
        updateContactDetails(contactData.id, contactData.name, contactData.email, contactData.phone, contactData.avatar.initials, contactData.avatar.color);
        return true;
    }
    return false;
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
    const nameField = document.getElementById('edit-name');
    nameField.value = name || '';
    nameField.setAttribute('data-original-name', name);

    document.getElementById('edit-email').value = email || '';
    document.getElementById('edit-phone').value = phone || '';
    document.getElementById('edit-contact-id').value = id;

    const avatarElement = document.getElementById('edit-avatar');
    avatarElement.style.backgroundColor = color;
    avatarElement.textContent = initials;
}


/**
 * Get contact data from the input fields for editing.
 */
function getContactData() {
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const id = document.getElementById('edit-contact-id').value;

    if (!name || !email || !phone) return null;

    const avatarElement = document.getElementById('edit-avatar');
    const initials = avatarElement.textContent;
    const color = avatarElement.style.backgroundColor;

    return { name, email, phone, avatar: { initials, color }, id };
}


/**
 * Update an existing contact on the server.
 * @param {Object} contact - The contact object.
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
 */
function getEditContactId() {
    const contactId = document.getElementById('edit-contact-id').value;
    console.log(`Kontakt-ID: ${contactId}`); 
    return contactId;
}


/**
 * Deletes a contact by its ID. Removes the contact from all associated tasks
 */
async function deleteContact() {
    const id = getEditContactId();
    if (!id) return false;
    await removeContactFromTasks(id);
    return await deleteContactFromDatabase(id);
}


/**
 * Deletes a contact from the database using its ID.
 * @param {string} contactId - The ID of the contact to be deleted.
 */
async function deleteContactFromDatabase(contactId) {
    const response = await fetch(`${BASE_URL}/contacts/${contactId}.json`, { method: 'DELETE' });

    if (response.ok) {
        handleContactDeletionSuccess();
        return true;
    }
    
    return false;
}


/**
 * Handles the success of a contact deletion.
 */
function handleContactDeletionSuccess() {
    hideOverlay();
    loadContacts();
    document.getElementById('contact-details').style.display = 'none';
    showPopup('Contact successfully deleted');
}


/**
 * Generate an avatar object with initials and a random color.
 * @param {string} name - The contact name.
 */
function generateAvatar(name) {
    return {
        initials: name.split(' ').map(n => n[0]).join(''),
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    };
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