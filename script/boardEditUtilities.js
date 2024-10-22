/**
 * Changes the priority of a task based on the selected priority.
 * @param {string} selectedPrio - The selected priority ('Urgent', 'Medium', or 'Low').
 * @function changePrio
 */
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


/**
 * Sets the visual state of the urgent priority button.
 * @param {HTMLElement} btnUrgentRef - Reference to the urgent button.
 * @param {HTMLElement} btnMediumRef - Reference to the medium button.
 * @param {HTMLElement} btnLowRef - Reference to the low button.
 * @function changePrioUrgent
 */
function changePrioUrgent(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnUrgentRef.classList.add('urgent-active');
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentwhitesym.png';
    btnMediumRef.querySelector('img').src = '../assets/img/mediumsym.png';
    btnLowRef.querySelector('img').src = '../assets/img/lowsym.png';
}


/**
 * Sets the visual state of the medium priority button.
 * @param {HTMLElement} btnUrgentRef - Reference to the urgent button.
 * @param {HTMLElement} btnMediumRef - Reference to the medium button.
 * @param {HTMLElement} btnLowRef - Reference to the low button.
 * @function changePrioMedium
 */
function changePrioMedium(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnMediumRef.classList.add('medium-active');
    btnMediumRef.querySelector('img').src = '../assets/img/mediumwhitesym.png';
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentsym.png';
    btnLowRef.querySelector('img').src = '../assets/img/lowsym.png';
}


/**
 * Sets the visual state of the low priority button.
 * @param {HTMLElement} btnUrgentRef - Reference to the urgent button.
 * @param {HTMLElement} btnMediumRef - Reference to the medium button.
 * @param {HTMLElement} btnLowRef - Reference to the low button.
 * @function changePrioLow
 */
function changePrioLow(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnLowRef.classList.add('low-active');
    btnLowRef.querySelector('img').src = '../assets/img/lowwhitesym.png';
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentsym.png';
    btnMediumRef.querySelector('img').src = '../assets/img/mediumsym.png';
}


/**
 * Removes the active class from all priority buttons.
 * @param {HTMLElement} btnUrgentRef - Reference to the urgent button.
 * @param {HTMLElement} btnMediumRef - Reference to the medium button.
 * @param {HTMLElement} btnLowRef - Reference to the low button.
 * @function removeAllActivButtons
 */
function removeAllActivButtons(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnUrgentRef.classList.remove('urgent-active');
    btnMediumRef.classList.remove('medium-active');
    btnLowRef.classList.remove('low-active');
}


/**
 * Toggles the checkbox for a selected contact and updates the selection state.
 * @param {string} contactIdSelected - The ID of the selected contact.
 * @function toggleCheckboxContact
 */
function toggleCheckboxContact(contactIdSelected) {
    let checkbox = document.getElementById(`checkboxContact${contactIdSelected}`);
    let contactRef = document.getElementById(`contact${contactIdSelected}`);
    checkbox.checked = !checkbox.checked;
    updateContactSelection(contactIdSelected, checkbox.checked, contactRef);
    updateAssignedContacts();
}


/**
 * Updates the selection state of a contact based on checkbox status.
 * @param {string} contactIdSelected - The ID of the selected contact.
 * @param {boolean} isChecked - The checked status of the contact's checkbox.
 * @param {HTMLElement} contactRef - Reference to the contact element.
 * @function updateContactSelection
 */
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


/**
 * Toggles the visibility of the contacts dropdown.
 * @function toggleDropdown
 */
function toggleDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    let isDropdownVisible = dropdown.classList.toggle("show");
    if (isDropdownVisible) {
        changeDropdownImage(true);
    } else {
        changeDropdownImage(false);
    }
}


/**
 * Changes the dropdown arrow image based on its open state.
 * @param {boolean} isOpened - Indicates if the dropdown is open or closed.
 * @function changeDropdownImage
 */
function changeDropdownImage(isOpened) {
    let dropdownImage = document.getElementById("input-assigned-edit");
    if (isOpened) {
        dropdownImage.style.backgroundImage = "url('../assets/img/drop-up-arrow.png')";
    } else {
        dropdownImage.style.backgroundImage = "url('../assets/img/drop-down-arrow.png')";
    }
}


/**
 * Handles key down events, triggering subtask addition on Enter key.
 * @param {Event} event - The keydown event.
 * @function handleKeyDown
 */
function handleKeyDown(event) {
    if (event.key === "Enter") {
        addSubtask();
    }
}


/**
 * Handles key down events in the edit subtask input, saving the subtask on Enter key.
 * @param {Event} event - The keydown event.
 * @param {number} iSubtasks - The index of the subtask being edited.
 * @function handleKeyDownEditSubtask
 */
function handleKeyDownEditSubtask(event, iSubtasks) {
    if (event.key === "Enter") {
        saveSubtask(iSubtasks);
    }
}


/**
 * Activates the update button.
 * @function buttonAktiv
 */
function buttonAktiv() {
    document.getElementById("btn-update-task").classList.remove('btn-disabled');
    document.getElementById("btn-update-task").classList.add('btn-active');
    document.getElementById("btn-update-task").disabled = false;
}


/**
 * Deactivates the update button.
 * @function buttonNotAktiv
 */
function buttonNotAktiv() {
    document.getElementById("btn-update-task").classList.add('btn-disabled');
    document.getElementById("btn-update-task").classList.remove('btn-active');
    document.getElementById("btn-update-task").disabled = true;
}


/**
 * Updates the state of the update button based on title and due date input.
 * @param {string} title - The title input value.
 * @param {string} dueDate - The due date input value.
 * @function updateButtonToggleActive
 */
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


/**
 * Checks the title input for validity and displays an error if invalid.
 * @param {string} title - The title input value.
 * @param {HTMLElement} titleInput - Reference to the title input element.
 * @function checkInputTitle
 */
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


/**
 * Checks the due date input for validity and displays an error if invalid.
 * @param {string} dueDate - The due date input value.
 * @param {HTMLElement} dueDateInput - Reference to the due date input element.
 * @function checkInputDueDate
 */
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


/**
 * Retrieves the currently active priority from the buttons.
 * @returns {string|null} The active priority ('Urgent', 'Medium', 'Low'), or null if none is active.
 * @function getActivePriority
 */
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


/**
 * Initializes the input for adding a subtask.
 * @function inputStart
 */
function inputStart() {
    document.getElementById('ctn-add-subtask').classList.add('d-none');
    document.getElementById('ctn-clear-add-subtask').classList.remove('d-none');
    document.getElementById('subtasks-edit').focus();
}


/**
 * Clears the input for adding a subtask and resets the display.
 * @function clearInputSubtask
 */
function clearInputSubtask() {
    document.getElementById('subtasks-edit').value = "";
    document.getElementById('ctn-add-subtask').classList.remove('d-none');
    document.getElementById('ctn-clear-add-subtask').classList.add('d-none');
}


/**
 * Closes the contacts dropdown and resets the dropdown image.
 * @function closeDropdown
 */
function closeDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.remove("show");
    changeDropdownImage(false);
}


/**
 * Opens the contacts dropdown and sets the dropdown image accordingly.
 * @function showDropdown
 */
function showDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.add("show");
    changeDropdownImage(true);
}




