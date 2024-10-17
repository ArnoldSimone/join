async function loadContacts() {
    const contacts = await fetchContacts();
    if (contacts) renderContacts(contacts);
}


async function fetchContacts() {
    const response = await fetch(`${BASE_URL}/contacts.json`);
    return response.json();
}


function renderContacts(contacts) {
    const contactContainer = document.querySelector('.contacts');
    contactContainer.innerHTML = '';
    const groupedContacts = groupContactsByFirstLetter(contacts);

    Object.entries(groupedContacts).forEach(([letter, contactList]) => {
        contactContainer.innerHTML += renderContactGroup(letter, contactList);
    });
}


function groupContactsByFirstLetter(contacts) {
    const groupedContacts = Object.entries(contacts).reduce((groups, [id, contact]) => {
        if (contact.name && typeof contact.name === 'string') {
            const firstLetter = contact.name[0].toUpperCase();
            groups[firstLetter] = groups[firstLetter] || [];
            groups[firstLetter].push({ ...contact, id });
        }
        return groups;
    }, {});

    Object.keys(groupedContacts).forEach(letter =>
        groupedContacts[letter].sort((a, b) => a.name.localeCompare(b.name))
    );
    return groupedContacts;
}


function renderContactGroup(letter, contactList) {
    return `
        <div class="contact-group">
            <h2>${letter}</h2>
            <hr>
            ${contactList.map(contact => renderContact(contact)).join('')}
        </div>
    `;
}


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


function showContactDetails(id, name, email, phone, initials, color) {
    selectContact(id);
    toggleContactListVisibility();
    updateContactDetails(id, name, email, phone, initials, color);
}


function toggleContactListVisibility() {
    if (window.innerWidth <= 1000) {
        document.querySelector('.contact-list').style.display = 'none';
        document.querySelector('.close-btn').style.display = 'block';
    }
}


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


function createAvatar(initials, color) {
    return `<span class="avatar-details d-flex" style="background-color:${color};">${initials}</span>`;
}


function displayContactDetailContainer(contactDetails) {
    document.querySelector('#contactDetail').style.display = 'block';
    contactDetails.style.display = 'block';
    contactDetails.classList.remove('slide-out');
    contactDetails.classList.add('slide-in');

    setTimeout(() => {
        contactDetails.classList.remove('slide-in');
    }, 200);
}


function hideContactDetails() {
    const contactDetails = document.getElementById('contact-details');

    contactDetails.style.display = 'none';

    if (window.innerWidth <= 1000) {
        document.querySelector('.contact-list').style.display = 'block';
    }

    const closeButton = document.querySelector('.close-btn');
    closeButton.style.display = 'none';
}


function selectContact(id) {
    const contacts = document.querySelectorAll('.contact');
    contacts.forEach(contact => contact.classList.remove('selected-contact'));

    const selectedContact = document.querySelector(`.contact[onclick*="'${id}'"]`);
    if (selectedContact) {
        selectedContact.classList.add('selected-contact');
    }
}

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
  

function validateContactInput(name, email, phone) {
    return name && email && phone;
}


async function addNewContact() {
    const name = document.getElementById('add-name').value.trim();
    const email = document.getElementById('add-email').value.trim();
    const phone = document.getElementById('add-phone').value.trim();

    if (!validateContactInput(name, email, phone)) return false;

    const contact = { name, email, phone, avatar: generateAvatar(name) };
    const response = await saveContact(contact);

    if (response) {
        hideOverlay();
        loadContacts();
        return true;
    }
    return false;
}


async function saveContact(contact) {
    const response = await fetch(`${BASE_URL}/contacts.json`, {
        method: 'POST',
        body: JSON.stringify(contact),
        headers: { 'Content-Type': 'application/json' }
    });

    return response.ok;
}


async function editContact() {
    const contactData = getContactData();
    if (!contactData) return false;

    const response = await updateContact(contactData);
    if (response.ok) {
        hideOverlay();
        loadContacts();
        return true;
    }

    return false;
}


function getContactData() {
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const id = document.getElementById('edit-contact-id').value;

    if (!name || !email || !phone) return null;

    return { name, email, phone, avatar: generateAvatar(name), id };
}


async function updateContact({ name, email, phone, avatar, id }) {
    return await fetch(`${BASE_URL}/contacts/${id}.json`, {
        method: 'PATCH',
        body: JSON.stringify({ name, email, phone, avatar }),
        headers: { 'Content-Type': 'application/json' }
    });
}


function getEditContactId() {
    return document.getElementById('edit-contact-id').value;
}


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


function generateAvatar(name) {
    return {
        initials: name.split(' ').map(n => n[0]).join(''),
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    };
}


function showAddContactOverlay() {
    const addContactOverlay = document.getElementById('add-contact-overlay');
    addContactOverlay.style.display = 'flex';
    addContactOverlay.classList.remove('slide-out');
    addContactOverlay.classList.add('slide-in');
    setTimeout(() => {
        addContactOverlay.classList.remove('slide-in');
    }, 200);
}


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


function updateEditContactFields(id, name, email, phone, initials, color) {
    document.getElementById('edit-name').value = name || '';
    document.getElementById('edit-email').value = email || '';
    document.getElementById('edit-phone').value = phone || '';
    document.getElementById('edit-contact-id').value = id;

    const avatarElement = document.getElementById('edit-avatar');
    avatarElement.style.backgroundColor = color;
    avatarElement.textContent = initials;
}


function hideOverlay(event) {
    const addContactOverlay = document.getElementById('add-contact-overlay');
    const editContactOverlay = document.getElementById('edit-contact-overlay');

    if (event) {
        event.stopPropagation();
    }

    addContactOverlay.classList.add('slide-out');
    editContactOverlay.classList.add('slide-out');

    setTimeout(() => {
        addContactOverlay.style.display = 'none';
        editContactOverlay.style.display = 'none';
        addContactOverlay.classList.remove('slide-out');
        editContactOverlay.classList.remove('slide-out');
    }, 200);
}


function clearInputs() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-email').value = '';
    document.getElementById('add-phone').value = '';
    document.getElementById('edit-name').value = '';
    document.getElementById('edit-email').value = '';
    document.getElementById('edit-phone').value = '';
}