const BASE_URL = "https://join-5800e-default-rtdb.europe-west1.firebasedatabase.app/";

async function postToDatabase(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}

async function addTaskToFirebase(taskData) {
    const result = await postToDatabase("tasks", taskData);
    
    if (result) handleSuccessfulTaskCreation();
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
        progress: "todo", 
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
    const response = await fetch(BASE_URL + "/contacts.json");
    
    if (response.ok) {
        const contacts = await response.json();
        populateContactsDropdown(contacts);
    } else {
        console.error("Error fetching contacts");
    }
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
