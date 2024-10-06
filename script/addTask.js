const BASE_URL = "https://join-5800e-default-rtdb.europe-west1.firebasedatabase.app/";

async function addTaskToFirebase(taskData) {
    const request = createRequest(`${BASE_URL}/tasks.json`, 'POST', taskData);
    const response = await fetch(request);

    if (response.ok) handleSuccessfulTaskCreation();
    else console.error("Error pushing task to Firebase");
}

function createRequest(url, method, data) {
    return new Request(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

function handleSuccessfulTaskCreation() {
    clearForm();
    window.location.href = 'board.html';
}

function submitForm() {
    const taskData = gatherFormData();
    addTaskToFirebase(taskData);
}

function gatherFormData() {
    return {
        title: getFormValue("title"),
        description: getFormValue("description"),
        assignedTo: getFormValue("assigned"),
        dueDate: getFormValue("due-date"),
        priority: getSelectedPriority(),
        category: getFormValue("category"),
        subtasks: gatherSubtasks()
    };
}

function getFormValue(name) {
    return document.forms["taskForm"][name].value;
}

function getSelectedPriority() {
    const priorityButtons = document.querySelectorAll('.prio');
    for (let button of priorityButtons) {
        if (button.classList.contains('selected')) return button.textContent.trim();
    }
    return '';
}

function gatherSubtasks() {
    const subtaskElements = document.querySelectorAll('.subtask-connect input');
    return Array.from(subtaskElements).map(el => ({ completed: false, title: el.value }));
}

function clearForm() {
    setFormValue("title", '');
    setFormValue("description", '');
    setFormValue("assigned", 'Select contacts to assign');
    setFormValue("due-date", '');
    setFormValue("category", 'Select task category');
    clearSubtasks();
}

function setFormValue(name, value) {
    document.forms["taskForm"][name].value = value;
}

function clearSubtasks() {
    const subtaskInputs = document.querySelectorAll('.subtask-connect input');
    subtaskInputs.forEach(input => input.value = '');
}

async function fetchContacts() {
    const request = createRequest(`${BASE_URL}/contacts.json`, 'GET');
    const response = await fetch(request);

    if (response.ok) populateContactsDropdown(await response.json());
    else console.error("Error fetching contacts");
}

function populateContactsDropdown(contacts) {
    const assignedSelect = document.forms["taskForm"]["assigned"];
    assignedSelect.innerHTML = '<option>Select contacts to assign</option>';

    Object.values(contacts).forEach(contact => {
        assignedSelect.innerHTML += `<option value="${contact.name}">${contact.name}</option>`;
    });
}

window.onload = function () {
    fetchContacts();
    includeHTML(); 
};

function setPriority(button, color) {
    resetPriorities();
    button.style.backgroundColor = color;
    button.classList.add('selected');
}

function resetPriorities() {
    const buttons = document.querySelectorAll('.prio');
    buttons.forEach(button => {
        button.style.backgroundColor = 'white';
        button.classList.remove('selected');
    });
}
