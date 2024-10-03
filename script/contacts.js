const BASE_URL= "https://join-5800e-default-rtdb.europe-west1.firebasedatabase.app/"


async function loadContacts() {
    const response = await fetch(`${BASE_URL}/contacts.json`);
    const contacts = await response.json();

    if (contacts) {
        renderContacts(contacts);
    }
}


function renderContacts(contacts) {
    const contactContainer = document.querySelector('.contacts');
    contactContainer.innerHTML = ''; 
    const groupedContacts = groupContactsByFirstLetter(contacts);
    
    Object.entries(groupedContacts).forEach(([letter, contactList]) => {
        contactContainer.innerHTML += renderContactGroup(letter, contactList);
    });
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


function validateContactInput(name, email, phone) {
    return name && email && phone;
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


function getEditContactId() {
    return document.getElementById('edit-contact-id').value;
}


function generateAvatar(name) {
    return {
        initials: name.split(' ').map(n => n[0]).join(''),
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    };
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


function showAddContactOverlay() {
    document.getElementById('add-contact-overlay').style.display = 'flex';
}


function showEditContact(id, name, email, phone, initials, color) {
    document.getElementById('edit-contact-overlay').style.display = 'flex';
    
    document.getElementById('edit-name').value = name || ''; 
    document.getElementById('edit-email').value = email || ''; 
    document.getElementById('edit-phone').value = phone || ''; 
    document.getElementById('edit-contact-id').value = id;

    const avatarElement = document.getElementById('edit-avatar');
    avatarElement.style.backgroundColor = color;
    avatarElement.textContent = initials;
}


function showContactDetails(id, name, email, phone, initials, color) {
    document.querySelector('.contact-details').style.display = 'block';

    document.querySelector('.contact-name').textContent = name;
    document.querySelector('.contact-avatar').innerHTML = `<span class="avatar-details d-flex" style="background-color:${color};">${initials}</span>`;

    document.getElementById('contact-email').textContent = email;
    document.getElementById('contact-phone').textContent = phone;
    document.getElementById('edit-contact-id').value = id;

    document.querySelector('.edit-btn').onclick = function() {
        showEditContact(id, name, email, phone, initials, color);
    };
}


function hideOverlay() {
    document.getElementById('add-contact-overlay').style.display = 'none';
    document.getElementById('edit-contact-overlay').style.display = 'none';
    clearInputs();
}


function clearInputs() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-email').value = '';
    document.getElementById('add-phone').value = '';
    document.getElementById('edit-name').value = '';
    document.getElementById('edit-email').value = '';
    document.getElementById('edit-phone').value = '';
}