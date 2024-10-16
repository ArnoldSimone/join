/**
 * An array that holds all contacts.
 * @type {Array<Object>}
 */
let allContacts = [];


/**
 * An array that holds contacts that are assigned to a specific task or context.
 * @type {Array<Object>}
 */
let assignedContacts = [];


/**
 * An array that holds currently selected contacts from the available contacts.
 * @type {Array<Object>}
 */
let selectedContacts = [];


/**
 * An array that holds filtered contacts based on search or selection criteria.
 * @type {Array<Object>}
 */
let filteredContacts = [];


/**
 * An array that holds all subtasks associated with a specific task or project.
 * @type {Array<Object>}
 */
let allSubtasksArray = [];


/**
 * An array that holds contacts that are currently being edited or modified.
 * @type {Array<Object>}
 */
let editAssignedContacts = [];


/**
 * Displays the edit task overlay for the specified task.
 * @param {number} taskId - The ID of the task to be edited.
 */
function showEditTaskOverlay(taskId) {
    document.getElementById('overlay-board-detail').classList.add('d-none');
    let overlayBoardEditRef = document.getElementById('overlay-board-edit');
    overlayBoardEditRef.classList.remove('d-none');
    overlayBoardEditRef.innerHTML = "";
    let task = tasks.find(t => t.id === taskId);
    overlayBoardEditRef.innerHTML = getEditOverlayTemplate(task);
    updateAssignedContacts();
    checkInputs();
}


/**
 * Renders all contacts for the assigned section of the specified task.
 * @param {number} taskId - The ID of the task whose assigned contacts will be rendered.
 * @returns {string} The HTML content for assigned contacts.
 */
function renderAllContactsInAssignedTo(taskId) {
    let task = tasks.find(t => t.id === taskId);
    let allContactsContent = "";
    allContacts = [];
    selectedContacts = [];
    assignedContacts = [];
    if (task.assignedTo && task.assignedTo !== "") {
        assignedContacts.push(task.assignedTo);
    }
    allContactsContent += renderContacts();
    return allContactsContent;
}


/**
 * Renders the contacts and generates the HTML content.
 * @returns {string} The HTML content for all contacts.
 */
function renderContacts() {
    let contactsContent = '';
    for (let iContact = 0; iContact < contacts.length; iContact++) {
        let name = contacts[iContact].name;
        let initial = contacts[iContact].avatar.initials;
        let color = contacts[iContact].avatar.color;
        allContacts.push({ contactId: iContact, name: name, initial: initial, color: color });
        let isChecked = (assignedContacts.length > 0 && assignedContacts[0].includes(name)) ? 'checked' : '';
        if (isChecked) {
            selectedContacts.push({ contactId: iContact, name: name, initial: initial, color: color });
        }
        contactsContent += getAssignedToEditTemplateOverlay(initial, color, name, iContact, isChecked);
    }
    return contactsContent;
}


/**
 * Searches for contacts based on the user input and filters the contact list.
 */
function searchContact() {
    filteredContacts = [];
    let inputRef = document.getElementById('input-assigned-edit');
    input = inputRef.value.toLowerCase();
    if (input.length > 0) {
        showDropdown();
        filteredContacts = allContacts.filter(c => c.name.toLowerCase().includes(input));
        renderFilteredContactsinAssignedTo();
    } else {
        closeDropdown();
        renderAllContacts();
        showDropdown();
    }
}


/**
 * Renders all contacts in the dropdown.
 */
function renderAllContacts() {
    let dropdownContactsRef = document.getElementById("dropdown-contacts");
    dropdownContactsRef.innerHTML = "";
    allContacts.forEach(contact => {
        let name = contact.name;
        let initial = contact.initial;
        let color = contact.color;
        let iContact = contact.contactId;
        let isChecked = selectedContacts.some(selectedContact => selectedContact.contactId === iContact) ? 'checked' : '';
        dropdownContactsRef.innerHTML += getAssignedToEditTemplateOverlay(initial, color, name, iContact, isChecked);
    });
}


/**
 * Renders the filtered contacts in the dropdown.
 */
function renderFilteredContactsinAssignedTo() {
    let dropdownContactsRef = document.getElementById("dropdown-contacts");
    dropdownContactsRef.innerHTML = "";
    for (let iFilter = 0; iFilter < filteredContacts.length; iFilter++) {
        let name = filteredContacts[iFilter].name;
        let initial = filteredContacts[iFilter].initial;
        let color = filteredContacts[iFilter].color;
        let iContact = filteredContacts[iFilter].contactId;
        let isChecked = selectedContacts.some(contact => contact.contactId === iContact) ? 'checked' : '';
        dropdownContactsRef.innerHTML += getAssignedToEditTemplateOverlay(initial, color, name, iContact, isChecked);
    }
}


/**
 * Updates the assigned contacts display based on the selected contacts.
 */
function updateAssignedContacts() {
    let assignedContentRef = document.getElementById('assigned-content');
    assignedContentRef.innerHTML = '';
    if (selectedContacts.length > 0) {
        selectedContacts.forEach(contact => {
            let color = contact.color;
            let initial = contact.initial;
            assignedContentRef.innerHTML += `<div class="assigned-to d-flex" style="background-color:${color};">${initial}</div>`;
        });
    } else {
        assignedContentRef.innerHTML = 'No Contact in Assign To';
    }
}


/**
 * Renders all subtasks for the specified task.
 * @param {number} taskId - The ID of the task whose subtasks will be rendered.
 * @returns {string} The HTML content for all subtasks or a message indicating no subtasks.
 */
function renderAllSubtasks(taskId) {
    allSubtasksArray = [];
    let task = tasks.find(t => t.id === taskId);
    let allSubtasks = '';
    let subtasks = task.subtasks;
    if (!subtasks || subtasks.length === 0) {
        return getNoSubtaskInTaskTemplate();
    } else {
        for (let iSubtasks = 0; iSubtasks < subtasks.length; iSubtasks++) {
            allSubtasks += processSubtask(subtasks[iSubtasks], iSubtasks);
        }
    }
    return allSubtasks;
}


/**
 * Processes a single subtask and returns the corresponding HTML content.
 * @param {Object} subtask - The subtask object containing title and completion status.
 * @param {number} iSubtask - The index of the subtask in the array.
 * @returns {string} The HTML content for the subtask.
 */
function processSubtask(subtask, iSubtask) {
    let title = subtask.title;
    let checkCompleted = subtask.completed;
    checkCompleted = (checkCompleted == "" || checkCompleted == null || !checkCompleted) ? false : true;
    allSubtasksArray.push({ 'completed': checkCompleted, 'title': title });
    return getAllSubtasksTemplate(iSubtask, title);
}


/**
 * Adds a new subtask based on the input field value.
 */
function addSubtask() {
    let ctnEditAllSubtasksRef = document.getElementById('ctn-edit-all-subtasks');
    let inputValueSubtaskRef = document.getElementById('subtasks-edit');
    clearNoSubtaskMessageAndInput(inputValueSubtaskRef);
    if (inputValueSubtaskRef.value !== "") {
        ctnEditAllSubtasksRef.innerHTML = '';
        allSubtasksArray.push({ 'completed': false, 'title': inputValueSubtaskRef.value });
        updateSubtaskDisplay(ctnEditAllSubtasksRef);
        inputValueSubtaskRef.value = '';
    }

}

/**
 * Clears the "no subtask" message if it exists and trims the input value.
 * @param {HTMLInputElement} inputValueSubtaskRef - The input field for the subtask title.
 */
function clearNoSubtaskMessageAndInput(inputValueSubtaskRef) {
    let noSubtaskEditRef = document.getElementById('no-subtask-edit');
    if (noSubtaskEditRef) {
        noSubtaskEditRef.remove();
    }
    inputValueSubtaskRef.value = inputValueSubtaskRef.value.trim();
}


/**
 * Updates the display of all subtasks in the container.
 * @param {HTMLElement} container - The container element to update with subtasks.
 */
function updateSubtaskDisplay(container) {
    for (let iSubtasks = 0; iSubtasks < allSubtasksArray.length; iSubtasks++) {
        let title = allSubtasksArray[iSubtasks].title;
        container.innerHTML += getAllSubtasksTemplate(iSubtasks, title);
    }
}


/**
 * Deletes a subtask by its index and renders the current subtasks.
 * @param {number} iSubtasks - The index of the subtask to delete.
 */
function deleteSubtask(iSubtasks) {
    allSubtasksArray.splice(iSubtasks, 1);
    renderCurrentSubtasks(iSubtasks);
}


/**
 * Renders the current list of subtasks.
 * @param {number} iSubtasks - The index of the subtask to be rendered.
 */
function renderCurrentSubtasks(iSubtasks) {
    let ctnEditAllSubtasksRef = document.getElementById('ctn-edit-all-subtasks');
    ctnEditAllSubtasksRef.innerHTML = "";
    if (allSubtasksArray.length > 0) {
        for (let iSubtasks = 0; iSubtasks < allSubtasksArray.length; iSubtasks++) {
            let title = allSubtasksArray[iSubtasks].title;
            ctnEditAllSubtasksRef.innerHTML += getAllSubtasksTemplate(iSubtasks, title)
        }
    } else {
        ctnEditAllSubtasksRef.innerHTML = getNoSubtaskInTaskTemplate();
    }
}


/**
 * Edits the specified subtask by enabling its input field and updating UI elements.
 * @param {number} iSubtasks - The index of the subtask to edit.
 */
function editSubtask(iSubtasks) {
    let inputField = document.getElementById(`input-subtask-edit${iSubtasks}`);
    document.getElementById(`subtask-icons-display-mode${iSubtasks}`).classList.add('d-none');
    document.getElementById(`subtask-icons-editing-mode${iSubtasks}`).classList.remove('d-none');
    document.getElementById(`edit-mode-subtask${iSubtasks}`).classList.add('underlined');
    document.getElementById(`subtask-item-edit${iSubtasks}`).classList.add('no-hover-edit');
    inputField.removeAttribute('disabled');
    inputField.focus();
    inputField.setSelectionRange(inputField.value.length, inputField.value.length);
}


/**
 * Saves the edited subtask and updates the UI.
 * @param {number} iSubtasks - The index of the subtask to save.
 */
function saveSubtask(iSubtasks) {
    document.getElementById(`edit-mode-subtask${iSubtasks}`).classList.remove('underlined');
    document.getElementById(`subtask-item-edit${iSubtasks}`).classList.remove('no-hover-edit');
    let inputField = document.getElementById(`input-subtask-edit${iSubtasks}`);
    inputField.setAttribute('disabled', 'true');
    document.getElementById(`subtask-icons-display-mode${iSubtasks}`).classList.remove('d-none');
    document.getElementById(`subtask-icons-editing-mode${iSubtasks}`).classList.add('d-none');
    allSubtasksArray[iSubtasks].title = inputField.value.substring(2);
    renderCurrentSubtasks(iSubtasks);
}


/**
 * Updates the task with the provided ID based on the edited values.
 * @param {number} taskId - The ID of the task to update.
 */
function updateTask(taskId) {
    let task = tasks.find(t => t.id === taskId);
    task.title = document.getElementById('title-edit').value;
    task.description = document.getElementById('description-edit').value;
    task.dueDate = document.getElementById('due-date-edit').value;
    task.priority = getActivePriority();
    task.assignedTo = getAssignedTo();
    task.subtasks = allSubtasksArray;
    updateOnDatabase(`tasks/${taskId}`, task);
    closeEditTaskOverlay();
    renderTasksBoard();
    showDetailTaskOverlay(taskId);
}


/**
 * Closes the edit task overlay and resets UI elements.
 */
function closeEditTaskOverlay() {
    document.body.style.overflow = '';
    let overlayBoardEditRef = document.getElementById('overlay-board-edit');
    overlayBoardEditRef.classList.add('slide-out');
    setTimeout(() => {
        overlayBoardEditRef.classList.add('d-none');
        overlayBoardEditRef.classList.remove('slide-out');
    }, 200);
}


/**
 * Checks the input fields and updates the state of the update button.
 */
function checkInputs() {
    let titleInput = document.getElementById('title-edit');
    let dueDateInput = document.getElementById('due-date-edit');
    let title = titleInput.value.trim();
    let dueDate = dueDateInput.value;
    updateButtonToggleActive(title, dueDate);
    checkInputTitle(title, titleInput);
    checkInputDueDate(dueDate, dueDateInput);
}


/**
 * Retrieves the names of assigned contacts that are checked.
 * @returns {Array<string>} An array of names of assigned contacts.
 */
function getAssignedTo() {
    editAssignedContacts = [];
    const checkedContactsArray = Array.from(document.querySelectorAll('.contact.checked'));
    checkedContactsArray.forEach(contact => {
        const id = +contact.id.replace('contact', '');
        const foundContact = allContacts.find(c => c.contactId === id);
        if (foundContact) {
            editAssignedContacts.push(foundContact.name);
        }
    });
    return editAssignedContacts;
}


