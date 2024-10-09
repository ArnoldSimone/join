let allContacts = [];
let assignedContacts = [];
let selectedContacts = [];
let filteredContacts = [];


function showEditTaskOverlay(taskId) {
    document.getElementById('overlay-board-detail').classList.add('d-none');
    let overlayBoardEditRef = document.getElementById('overlay-board-edit');
    overlayBoardEditRef.classList.remove('d-none');
    overlayBoardEditRef.innerHTML = "";
    let task = tasks.find(t => t.id === taskId);
    overlayBoardEditRef.innerHTML = getEditOverlayTemplate(task);
    updateAssignedContacts();
}

function changePrio(selectedPrio) {
    toggleDropdown
    let btnUrgentRef = document.getElementById('btn-urgent');
    let btnMediumRef = document.getElementById('btn-medium');
    let btnLowRef = document.getElementById('btn-low');
    removeAllActivButtons(btnUrgentRef, btnMediumRef, btnLowRef);
    if (selectedPrio === 'Urgent') {
        changePrioUrgent(btnUrgentRef, btnMediumRef, btnLowRef);
    } else if (selectedPrio === 'Medium') {
        changePrioMedium(btnUrgentRef, btnMediumRef, btnLowRef)
    } else if (selectedPrio === 'Low') {
        changePrioLow(btnUrgentRef, btnMediumRef, btnLowRef);
    }
}

function changePrioUrgent(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnUrgentRef.classList.add('urgent-active');
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentwhitesym.png';
    btnMediumRef.querySelector('img').src = '../assets/img/mediumsym.png';
    btnLowRef.querySelector('img').src = '../assets/img/lowsym.png';
}

function changePrioMedium(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnMediumRef.classList.add('medium-active');
    btnMediumRef.querySelector('img').src = '../assets/img/mediumwhitesym.png';
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentsym.png';
    btnLowRef.querySelector('img').src = '../assets/img/lowsym.png';
}

function changePrioLow(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnLowRef.classList.add('low-active');
    btnLowRef.querySelector('img').src = '../assets/img/lowwhitesym.png';
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentsym.png';
    btnMediumRef.querySelector('img').src = '../assets/img/mediumsym.png';
}

function removeAllActivButtons(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnUrgentRef.classList.remove('urgent-active');
    btnMediumRef.classList.remove('medium-active');
    btnLowRef.classList.remove('low-active');
}

function renderAllContactsInAssignedTo(taskId) {
    let task = tasks.find(t => t.id === taskId);
    let allContactsContent = "";
    allContacts = [];
    selectedContacts = [];
    assignedContacts = [];
    assignedContacts.push(task.assignedTo);
    for (let iContact = 0; iContact < contacts.length; iContact++) {
        let name = contacts[iContact].name;
        let initial = contacts[iContact].avatar.initials;
        let color = contacts[iContact].avatar.color;
        allContacts.push({ 'contactId': iContact, 'name': (contacts[iContact].name), 'initial': (contacts[iContact].avatar.initials), 'color': (contacts[iContact].avatar.color) });
        let isChecked = assignedContacts[0].includes(contacts[iContact].name) ? 'checked' : '';
        if (isChecked) {
            selectedContacts.push({ 'contactId': iContact, 'name': (contacts[iContact].name), 'initial': (contacts[iContact].avatar.initials), 'color': (contacts[iContact].avatar.color) });
        }
        allContactsContent += getAssignedToEditTemplateOverlay(initial, color, name, iContact, isChecked);
    }
    return allContactsContent;
}

function searchContact() {
    let inputRef = document.getElementById('input-assigned-edit');
    input = inputRef.value.toLowerCase();
    if (input.length > 0) {
        showDropdown();
        filteredContacts = allContacts.filter(c => c.name.toLowerCase().includes(input));
        renderFilteredContactsinAssignedTo();
    }
}

function renderFilteredContactsinAssignedTo() {
    let dropdownContactsRef = document.getElementById("dropdown-contacts");
    dropdownContactsRef.innerHTML = "";
    for (let iFilter = 0; iFilter < filteredContacts.length; iFilter++) {
        let name = filteredContacts[iFilter].name;
        let initial = filteredContacts[iFilter].initial;
        let color = filteredContacts[iFilter].color;
        let iContact = filteredContacts[iFilter].contactId;
        let isChecked = assignedContacts[0].includes(filteredContacts[iFilter].name) ? 'checked' : '';
        dropdownContactsRef.innerHTML += getAssignedToEditTemplateOverlay(initial, color, name, iContact, isChecked);
    }
}

function toggleCheckboxContact(iContact) {
    let checkbox = document.getElementById(`checkboxContact${iContact}`);
    let contactRef = document.getElementById(`contact${iContact}`);
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        contactRef.classList.add('checked');
        selectedContacts.push({ 'contactId': iContact, 'name': (contacts[iContact].name), 'initial': (contacts[iContact].avatar.initials), 'color': (contacts[iContact].avatar.color) });
        updateAssignedContacts()
    } else {
        contactRef.classList.remove('checked');
        selectedContacts = selectedContacts.filter(c => c.contactId !== iContact);
        updateAssignedContacts()
    }
    updateAssignedContacts();
}

function updateAssignedContacts() {
    let assignedContentRef = document.getElementById('assigned-content');
    assignedContentRef.innerHTML = '';
    if (selectedContacts.length > 0) {
        selectedContacts.sort((a, b) => a.name.localeCompare(b.name));
        for (let iChecked = 0; iChecked < selectedContacts.length; iChecked++) {
            let color = selectedContacts[iChecked].color;
            let initial = selectedContacts[iChecked].initial;
            assignedContentRef.innerHTML += `<div class="assigned-to d-flex" style="background-color:${color};">${initial}</div>`;
        }
    } else {
        assignedContentRef.innerHTML = 'No Contact in Assign To';
    }
}

function toggleDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.toggle("show");
}

function closeDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.remove("show");
}

function showDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.add("show");
}

function renderSubtasks(taskId) {
    let task = tasks.find(t => t.id === taskId);
    console.log(task);

}



