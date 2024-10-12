let allContacts = [];
let assignedContacts = [];
let selectedContacts = [];
let filteredContacts = [];
let allSubtasksArray = [];
let editAssignedContacts = [];
let editAllSubtasksArray = [];

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

function toggleCheckboxContact(iContact) {
    let checkbox = document.getElementById(`checkboxContact${iContact}`);
    let contactRef = document.getElementById(`contact${iContact}`);
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
        contactRef.classList.add('checked');
        if (!selectedContacts.some(contact => contact.contactId === iContact)) {
            selectedContacts.push({ 'contactId': iContact, 'name': (contacts[iContact].name), 'initial': (contacts[iContact].avatar.initials), 'color': (contacts[iContact].avatar.color) });
        }
    } else {
        contactRef.classList.remove('checked');
        selectedContacts = selectedContacts.filter(c => c.contactId !== iContact);
    }
    updateAssignedContacts();
}

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

function toggleDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    let isDropdownVisible = dropdown.classList.toggle("show");
    if (isDropdownVisible) {
        changeDropdownImage(true);  // Dropdown wird geöffnet
    } else {
        changeDropdownImage(false); // Dropdown wird geschlossen
    }
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

function changeDropdownImage(isOpened) {
    let dropdownImage = document.getElementById("input-assigned-edit");
    if (isOpened) {
        dropdownImage.style.backgroundImage = "url('../assets/img/drop-up-arrow.png')";
    } else {
        dropdownImage.style.backgroundImage = "url('../assets/img/drop-down-arrow.png')";
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
            let title = subtasks[iSubtasks].title;
            allSubtasksArray.push({ 'title': subtasks[iSubtasks].title })
            allSubtasks += getAllSubtasksTemplate(iSubtasks, title);
        }
    }
    return allSubtasks;
}

function inputStart() {
    document.getElementById('ctn-add-subtask').classList.add('d-none');
    document.getElementById('ctn-clear-add-subtask').classList.remove('d-none');
    document.getElementById('subtasks-edit').focus();
}

function clearInputSubtask() {
    document.getElementById('subtasks-edit').value = "";
    document.getElementById('subtasks-edit').focus();
    document.getElementById('ctn-add-subtask').classList.remove('d-none');
    document.getElementById('ctn-clear-add-subtask').classList.add('d-none');
}

function addSubtask() {
    let ctnEditAllSubtasksRef = document.getElementById('ctn-edit-all-subtasks');
    let inputValueSubtaskRef = document.getElementById('subtasks-edit');
    let inputValueSubtask = inputValueSubtaskRef.value;
    let noSubtaskEditRef = document.getElementById('no-subtask-edit');
    if (noSubtaskEditRef) {
        noSubtaskEditRef.remove();
    }
    if (inputValueSubtaskRef.value !== "") {
        ctnEditAllSubtasksRef.innerHTML = '';
        allSubtasksArray.push({ 'title': inputValueSubtask });
        for (let iSubtasks = 0; iSubtasks < allSubtasksArray.length; iSubtasks++) {
            let title = allSubtasksArray[iSubtasks].title;
            ctnEditAllSubtasksRef.innerHTML += getAllSubtasksTemplate(iSubtasks, title);
            inputValueSubtaskRef.value = '';
        }
    }
    document.getElementById('ctn-add-subtask').classList.remove('d-none');
    document.getElementById('ctn-clear-add-subtask').classList.add('d-none');
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
    document.getElementById(`subtask-icons-display-mode${iSubtasks}`).classList.add('d-none');
    document.getElementById(`subtask-icons-editing-mode${iSubtasks}`).classList.remove('d-none');
    document.getElementById(`edit-mode-subtask${iSubtasks}`).classList.add('underlined');
    document.getElementById(`subtask-item-edit${iSubtasks}`).classList.add('no-hover-edit');
    let inputField = document.getElementById(`input-subtask-edit${iSubtasks}`);
    inputField.removeAttribute('disabled');
    inputField.focus();
    inputField.setSelectionRange(inputField.value.length, inputField.value.length);
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

function handleKeyDown(event) {
    if (event.key === "Enter") {
        addSubtask();
    }
}

function onInputBlur() {
    document.getElementById('ctn-add-subtask').classList.remove('d-none');
    document.getElementById('ctn-clear-add-subtask').classList.add('d-none');
}

function updateTask(taskId) {
    let task = tasks.find(t => t.id === taskId);

    let title = document.getElementById('title-edit').value;
    let description = document.getElementById('description-edit').value;
    let dueDate = document.getElementById('due-date-edit').value;
    let priority = getActivePriority();
    let assignedTo = getAssignedTo();
    let subtasks = getSubtasks();

    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.priority = priority;
    task.assignedTo = assignedTo;
    task.subtasks = subtasks;

    console.log(task);
    console.log(title);
    console.log(description);
    console.log(dueDate);
    console.log(priority);
    console.log(assignedTo);
    console.log(subtasks);

    updateOnDatabase(`tasks/${taskId}`, task);
}

function buttonAktiv() {
    document.getElementById("btn-update-task").classList.remove('btn-disabled');
    document.getElementById("btn-update-task").classList.add('btn-active');
    document.getElementById("btn-update-task").disabled = false;
}

function buttonNotAktiv() {
    document.getElementById("btn-update-task").classList.add('btn-disabled');
    document.getElementById("btn-update-task").classList.remove('btn-active');
    document.getElementById("btn-update-task").disabled = true;
}

function checkInputs() {
    let title = document.getElementById('title-edit').value.trim();
    let dueDate = document.getElementById('due-date-edit').value;
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

function getAssignedTo() {
    editAssignedContacts = [];
    let contacts = Array.from(document.querySelectorAll('.contact'));
    let checkedContactsArray = Array.from(contacts.filter(c => c.classList.contains('checked')));
    for (let iCheckedContact = 0; iCheckedContact < checkedContactsArray.length; iCheckedContact++) {
        let id = +checkedContactsArray[iCheckedContact].id.replace('contact', '');
        for (let iAllContact = 0; iAllContact < allContacts.length; iAllContact++) {
            let idAllContact = allContacts[iAllContact].contactId;
            if (id === idAllContact) {
                let name = allContacts[iAllContact].name;
                editAssignedContacts.push(name);
            }
        }
    }
    return editAssignedContacts;
}

function getSubtasks() {
    editAssignedContacts = [];
    let subtasksArray = Array.from(document.querySelectorAll('.input-subtask-edit'));
    for (let iSubtask = 0; iSubtask < subtasksArray.length; iSubtask++) {
        let subtask = subtasksArray[iSubtask].value.replace('• ', '');
        editAllSubtasksArray.push({ 'title': subtask });
        // editAllSubtasksArray.push({ 'completed': false, 'title': subtask });
    }
    return editAllSubtasksArray;
}

