let selectedPriority = ''; 
let allContacts;



function init() {
    fetchContacts();
}


async function fetchContacts() {
    try {
        let contactsData = await loadFromDatabase("/contacts");
        allContacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
    } catch (error) {
        console.log(error);        
    }
    renderAllContactsInAssignedTo();
}


function renderAllContactsInAssignedTo() {
    let list = document.getElementById('assignedList');
    for (let index = 0; index < allContacts.length; index++) {
        let name = allContacts[index].name
        let initial = allContacts[index].avatar.initials;
        let color = allContacts[index].avatar.color;
        list.innerHTML += generateCreateOption(name, initial, color, index);
    }
}


function assignedListToogle() {
    let list = document.getElementById('assignedList');
    list.classList.toggle('d-none');
}


function generateCreateOption(name, initial, color, index) {
    return `
        <div>
            <div class="initial" style="background-color: ${color};">
                <p>${initial}</p>
            </div>
            <div>
                <p>${name}</p>
            </div>
            <input type="checkbox">
        </div>
    `;
}


async function addTaskToFirebase(taskData) {
    const result = await postToDatabase("tasks", taskData);    
    if (result) {
        handleSuccessfulTaskCreation();
    }
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


// function populateContactsDropdown(contacts) {
//     const assignedSelect = document.forms["taskForm"]["assigned"];
//     assignedSelect.innerHTML = '<option>Select contacts to assign</option>';

//     Object.values(contacts).forEach(contact => {
//         assignedSelect.innerHTML += `<option value="${contact.name}">${contact.name}</option>`;
//     });
// }


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
