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

