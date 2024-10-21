//check
let allContacts = [];
let assignedContacts = [];
let selectedContacts = [];


let filteredContacts = [];

let allSubtasksArray = [];

let editAssignedContacts = [];

//check
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


//check
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


//check
function renderContacts() {
    let contactsContent = '';
    for (let iContact = 0; iContact < contacts.length; iContact++) {
        let name = contacts[iContact].name;
        let initial = contacts[iContact].avatar.initials;
        let color = contacts[iContact].avatar.color;
        let id = contacts[iContact].id;
        allContacts.push({ 'contactId': id, 'name': name, 'initial': initial, 'color': color });
        let isChecked = (assignedContacts.length > 0 && assignedContacts[0].find(c => c.id === id)) ? 'checked' : '';
        if (isChecked) {
            selectedContacts.push({ 'contactId': id, 'name': name, 'initial': initial, 'color': color });
        }
        contactsContent += getAssignedToEditTemplateOverlay(initial, color, name, id, isChecked);
    }
    return contactsContent;
}



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


//check
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



function processSubtask(subtask, iSubtask) {
    let title = subtask.title;
    let checkCompleted = subtask.completed;
    checkCompleted = (checkCompleted == "" || checkCompleted == null || !checkCompleted) ? false : true;
    allSubtasksArray.push({ 'completed': checkCompleted, 'title': title });
    return getAllSubtasksTemplate(iSubtask, title);
}


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


function clearNoSubtaskMessageAndInput(inputValueSubtaskRef) {
    let noSubtaskEditRef = document.getElementById('no-subtask-edit');
    if (noSubtaskEditRef) {
        noSubtaskEditRef.remove();
    }
    inputValueSubtaskRef.value = inputValueSubtaskRef.value.trim();
}


function updateSubtaskDisplay(container) {
    for (let iSubtasks = 0; iSubtasks < allSubtasksArray.length; iSubtasks++) {
        let title = allSubtasksArray[iSubtasks].title;
        container.innerHTML += getAllSubtasksTemplate(iSubtasks, title);
    }
}



function deleteSubtask(iSubtasks) {
    allSubtasksArray.splice(iSubtasks, 1);
    renderCurrentSubtasks(iSubtasks);
}


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


function editSubtask(iSubtasks) {
    let inputField = document.getElementById(`input-subtask-edit${iSubtasks}`);
    document.getElementById(`subtask-icons-display-mode${iSubtasks}`).classList.add('d-none');
    document.getElementById(`subtask-icons-editing-mode${iSubtasks}`).classList.remove('d-none');
    document.getElementById(`edit-mode-subtask${iSubtasks}`).classList.add('underlined');
    document.getElementById(`subtask-item-edit${iSubtasks}`).classList.add('no-hover-edit');
    inputField.removeAttribute('disabled');
    inputField.focus();
    inputField.setSelectionRange(inputField.value.length, inputField.value.length);
    inputField.addEventListener('focusout', () => {
        exitEditMode(iSubtasks);
    });
}


function exitEditMode(iSubtasks) {
    let inputField = document.getElementById(`input-subtask-edit${iSubtasks}`);
    document.getElementById(`subtask-icons-display-mode${iSubtasks}`).classList.remove('d-none');
    document.getElementById(`subtask-icons-editing-mode${iSubtasks}`).classList.add('d-none');
    document.getElementById(`edit-mode-subtask${iSubtasks}`).classList.remove('underlined');
    document.getElementById(`subtask-item-edit${iSubtasks}`).classList.remove('no-hover-edit');
    inputField.setAttribute('disabled', true);
}



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



function closeEditTaskOverlay() {
    document.body.style.overflow = '';
    let overlayBoardEditRef = document.getElementById('overlay-board-edit');
    overlayBoardEditRef.classList.add('slide-out');
    setTimeout(() => {
        overlayBoardEditRef.classList.add('d-none');
        overlayBoardEditRef.classList.remove('slide-out');
    }, 200);
}

//check
function checkInputs() {
    let titleInput = document.getElementById('title-edit');
    let dueDateInput = document.getElementById('due-date-edit');
    let title = titleInput.value.trim();
    let dueDate = dueDateInput.value;
    updateButtonToggleActive(title, dueDate);
    checkInputTitle(title, titleInput);
    checkInputDueDate(dueDate, dueDateInput);
}



function getAssignedTo() {
    editAssignedContacts = [];
    for (let contactIdSelected = 0; contactIdSelected < selectedContacts.length; contactIdSelected++) {
        console.log(contactIdSelected);
        console.log(selectedContacts);

        editAssignedContacts.push({ 'id': selectedContacts[contactIdSelected].contactId, 'name': selectedContacts[contactIdSelected].name });
    }
    console.log(editAssignedContacts);

    return editAssignedContacts;
}


