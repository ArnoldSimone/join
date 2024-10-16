/**
 * Changes the priority of the task based on the selected priority.
 * @param {string} selectedPrio - The selected priority, can be 'Urgent', 'Medium', or 'Low'.
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
 * Changes the priority to urgent and updates the button states.
 * @param {HTMLElement} btnUrgentRef - The reference to the urgent button.
 * @param {HTMLElement} btnMediumRef - The reference to the medium button.
 * @param {HTMLElement} btnLowRef - The reference to the low button.
 */
function changePrioUrgent(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnUrgentRef.classList.add('urgent-active');
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentwhitesym.png';
    btnMediumRef.querySelector('img').src = '../assets/img/mediumsym.png';
    btnLowRef.querySelector('img').src = '../assets/img/lowsym.png';
}


/**
 * Changes the priority to medium and updates the button states.
 * @param {HTMLElement} btnUrgentRef - The reference to the urgent button.
 * @param {HTMLElement} btnMediumRef - The reference to the medium button.
 * @param {HTMLElement} btnLowRef - The reference to the low button.
 */
function changePrioMedium(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnMediumRef.classList.add('medium-active');
    btnMediumRef.querySelector('img').src = '../assets/img/mediumwhitesym.png';
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentsym.png';
    btnLowRef.querySelector('img').src = '../assets/img/lowsym.png';
}


/**
 * Changes the priority to low and updates the button states.
 * @param {HTMLElement} btnUrgentRef - The reference to the urgent button.
 * @param {HTMLElement} btnMediumRef - The reference to the medium button.
 * @param {HTMLElement} btnLowRef - The reference to the low button.
 */
function changePrioLow(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnLowRef.classList.add('low-active');
    btnLowRef.querySelector('img').src = '../assets/img/lowwhitesym.png';
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentsym.png';
    btnMediumRef.querySelector('img').src = '../assets/img/mediumsym.png';
}


/**
 * Removes all active states from priority buttons.
 * @param {HTMLElement} btnUrgentRef - The reference to the urgent button.
 * @param {HTMLElement} btnMediumRef - The reference to the medium button.
 * @param {HTMLElement} btnLowRef - The reference to the low button.
 */
function removeAllActivButtons(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnUrgentRef.classList.remove('urgent-active');
    btnMediumRef.classList.remove('medium-active');
    btnLowRef.classList.remove('low-active');
}


/**
 * Toggles the checkbox state for a contact and updates the selection.
 * @param {number} iContact - The index of the contact whose checkbox is being toggled.
 * This function gets the checkbox and contact element by their IDs,
 * updates the checkbox state, and calls the function to update the contact selection.
 * It also updates the assigned contacts after the selection change.
 */
function toggleCheckboxContact(iContact) {
    let checkbox = document.getElementById(`checkboxContact${iContact}`);
    let contactRef = document.getElementById(`contact${iContact}`);
    checkbox.checked = !checkbox.checked;
    updateContactSelection(iContact, checkbox.checked, contactRef);
    updateAssignedContacts();
}


/**
 * Updates the selected contacts list based on the checkbox state.
 * @param {number} iContact - The index of the contact to be updated.
 * @param {boolean} isChecked - Indicates whether the checkbox is checked or not.
 * @param {HTMLElement} contactRef - The reference to the contact element in the DOM.
 * This function adds the contact to the selectedContacts array if the checkbox is checked
 * and removes it if the checkbox is unchecked. It also updates the contact element's class.
 */
function updateContactSelection(iContact, isChecked, contactRef) {
    if (isChecked) {
        contactRef.classList.add('checked');
        if (!selectedContacts.some(contact => contact.contactId === iContact)) {
            selectedContacts.push({
                contactId: iContact, name: contacts[iContact].name, initial: contacts[iContact].avatar.initials, color: contacts[iContact].avatar.color
            });
        }
    } else {
        contactRef.classList.remove('checked');
        selectedContacts = selectedContacts.filter(c => c.contactId !== iContact);
    }
}


/**
 * Toggles the visibility of the contacts dropdown.
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
 * Changes the dropdown image based on its visibility.
 * @param {boolean} isOpened - Indicates if the dropdown is opened.
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
 * Handles the Enter keydown event to add a subtask.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleKeyDown(event) {
    if (event.key === "Enter") {
        addSubtask();
    }
}


/**
 * Handles the Enter keydown event to save a subtask.
 * @param {KeyboardEvent} event - The keyboard event.
 * @param {number} iSubtasks - The index of the subtask to save.
 */
function handleKeyDownEditSubtask(event, iSubtasks) {
    if (event.key === "Enter") {
        saveSubtask(iSubtasks);
    }
}


/**
 * Activates the update button.
 */
function buttonAktiv() {
    document.getElementById("btn-update-task").classList.remove('btn-disabled');
    document.getElementById("btn-update-task").classList.add('btn-active');
    document.getElementById("btn-update-task").disabled = false;
}


/**
 * Deactivates the update button.
 */
function buttonNotAktiv() {
    document.getElementById("btn-update-task").classList.add('btn-disabled');
    document.getElementById("btn-update-task").classList.remove('btn-active');
    document.getElementById("btn-update-task").disabled = true;
}


/**
 * Toggles the active state of the update button based on input validity.
 * @param {string} title - The title input value.
 * @param {string} dueDate - The due date input value.
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
 * Checks if the title input is valid and updates the UI accordingly.
 * @param {string} title - The title input value.
 * @param {HTMLElement} titleInput - The reference to the title input element.
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
 * Checks if the due date input is valid and updates the UI accordingly.
 * @param {string} dueDate - The due date input value.
 * @param {HTMLElement} dueDateInput - The reference to the due date input element.
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
 * Gets the currently active priority from the priority buttons.
 * @returns {string|null} The active priority or null if none is active.
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
 * Initiates the process of adding a new subtask by updating UI elements.
 */
function inputStart() {
    document.getElementById('ctn-add-subtask').classList.add('d-none');
    document.getElementById('ctn-clear-add-subtask').classList.remove('d-none');
    document.getElementById('subtasks-edit').focus();
}


/**
 * Clears the subtask input field and resets UI elements.
 */
function clearInputSubtask() {
    document.getElementById('subtasks-edit').value = "";
    document.getElementById('subtasks-edit').focus();
    document.getElementById('ctn-add-subtask').classList.remove('d-none');
    document.getElementById('ctn-clear-add-subtask').classList.add('d-none');
}


/**
 * Closes the contacts dropdown.
 */
function closeDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.remove("show");
    changeDropdownImage(false);
}


/**
 * Opens the contacts dropdown.
 */
function showDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.add("show");
    changeDropdownImage(true);
}




