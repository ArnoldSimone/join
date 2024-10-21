function changePrio(selectedPrio) {
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



function toggleCheckboxContact(contactIdSelected) {
    let checkbox = document.getElementById(`checkboxContact${contactIdSelected}`);
    let contactRef = document.getElementById(`contact${contactIdSelected}`);
    checkbox.checked = !checkbox.checked;
    updateContactSelection(contactIdSelected, checkbox.checked, contactRef);
    updateAssignedContacts();
}


//Check
function updateContactSelection(contactIdSelected, isChecked, contactRef) {
    if (isChecked) {
        contactRef.classList.add('checked');
        if (!selectedContacts.some(contact => contact.contactId === contactIdSelected)) {
            let contact = contacts.find(c => c.id === contactIdSelected);
            selectedContacts.push({
                contactId: contact.id, name: contact.name, initial: contact.avatar.initials, color: contact.avatar.color
            });
        }
    } else {
        contactRef.classList.remove('checked');
        selectedContacts = selectedContacts.filter(c => c.contactId !== contactIdSelected);
    }
}

//check
function toggleDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    let isDropdownVisible = dropdown.classList.toggle("show");
    if (isDropdownVisible) {
        changeDropdownImage(true);
    } else {
        changeDropdownImage(false);
    }
}

//check
function changeDropdownImage(isOpened) {
    let dropdownImage = document.getElementById("input-assigned-edit");
    if (isOpened) {
        dropdownImage.style.backgroundImage = "url('../assets/img/drop-up-arrow.png')";
    } else {
        dropdownImage.style.backgroundImage = "url('../assets/img/drop-down-arrow.png')";
    }
}


//check
function handleKeyDown(event) {
    if (event.key === "Enter") {
        addSubtask();
    }
}


//check
function handleKeyDownEditSubtask(event, iSubtasks) {
    if (event.key === "Enter") {
        saveSubtask(iSubtasks);
    }
}


//check
function buttonAktiv() {
    document.getElementById("btn-update-task").classList.remove('btn-disabled');
    document.getElementById("btn-update-task").classList.add('btn-active');
    document.getElementById("btn-update-task").disabled = false;
}

//check
function buttonNotAktiv() {
    document.getElementById("btn-update-task").classList.add('btn-disabled');
    document.getElementById("btn-update-task").classList.remove('btn-active');
    document.getElementById("btn-update-task").disabled = true;
}



function updateButtonToggleActive(title, dueDate) {
    let updateButton = document.getElementById('btn-update-task');
    if (title && dueDate) {
        updateButton.disabled = false;
        updateButton.classList.add('btn-active');
        updateButton.classList.remove('btn-disabled');
    } else {
        updateButton.disabled = true;
        updateButton.classList.remove('btn-active');
        updateButton.classList.add('btn-disabled');
    }
}



function checkInputTitle(title, titleInput) {
    let errorTitle = document.getElementById('error-title');
    if (!title) {
        titleInput.style.border = '1px solid red';
        errorTitle.classList.remove('d-none');
    } else {
        titleInput.style.border = '';
        errorTitle.classList.add('d-none');
    }
}



function checkInputDueDate(dueDate, dueDateInput) {
    let errorDueDate = document.getElementById('error-due-date');
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let dueDateObj = new Date(dueDate);
    if (dueDateObj < today) {
        dueDateInput.style.border = '1px solid red';
        errorDueDate.classList.remove('d-none');
    } else {
        dueDateInput.style.border = '';
        errorDueDate.classList.add('d-none');
    }
}



function getActivePriority() {
    let btnUrgentRef = document.getElementById('btn-urgent');
    let btnMediumRef = document.getElementById('btn-medium');
    let btnLowRef = document.getElementById('btn-low');
    if (btnUrgentRef.classList.contains('urgent-active')) {
        return 'Urgent';
    } else if (btnMediumRef.classList.contains('medium-active')) {
        return 'Medium';
    } else if (btnLowRef.classList.contains('low-active')) {
        return 'Low';
    }
    return null;
}



function inputStart() {
    document.getElementById('ctn-add-subtask').classList.add('d-none');
    document.getElementById('ctn-clear-add-subtask').classList.remove('d-none');
    document.getElementById('subtasks-edit').focus();
}


function clearInputSubtask() {
    document.getElementById('subtasks-edit').value = "";
    document.getElementById('ctn-add-subtask').classList.remove('d-none');
    document.getElementById('ctn-clear-add-subtask').classList.add('d-none');
}



function closeDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.remove("show");
    changeDropdownImage(false);
}



function showDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.add("show");
    changeDropdownImage(true);
}




