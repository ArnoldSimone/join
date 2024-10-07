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
        priority: selectedPriority,
        category: getFormValue("category"),
        progress: "todo", 
        subtasks: gatherSubtasks()
    };
}

function getFormValue(name) {
    return document.forms["taskForm"][name].value;
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

let selectedPriority = ''; 

function changePrio(priority) {
    const priorityConfig = getPriorityConfig();
    const buttons = document.querySelectorAll('.prio');
    
    selectedPriority = priority; 
    
    buttons.forEach(button => updateButtonStyle(button, priority, priorityConfig));
}


function getPriorityConfig() {
    return {
        'Urgent': {
            color: '#ff3e06',
            activeImg: '../assets/img/urgentwhitesym.png',
            defaultImg: '../assets/img/urgentsym.png'
        },
        'Medium': {
            color: '#ffaa18',
            activeImg: '../assets/img/mediumwhitesym.png',
            defaultImg: '../assets/img/mediumsym.png'
        },
        'Low': {
            color: '#7ee432',
            activeImg: '../assets/img/lowwhitesym.png',
            defaultImg: '../assets/img/lowsym.png'
        }
    };
}

function updateButtonStyle(button, selectedPriority, config) {
    const buttonPriority = button.textContent.trim();
    const img = button.querySelector('img');
    
    if (buttonPriority === selectedPriority) {
        applyActiveStyle(button, config[selectedPriority], img);
    } else {
        resetButtonStyle(button, config[buttonPriority], img);
    }
}

function applyActiveStyle(button, config, img) {
    button.style.backgroundColor = config.color;
    img.src = config.activeImg;
    button.classList.add(`${button.textContent.trim().toLowerCase()}-active`);
}

function resetButtonStyle(button, config, img) {
    button.style.backgroundColor = 'white';
    img.src = config.defaultImg;
    button.classList.remove(`${button.textContent.trim().toLowerCase()}-active`);
}
