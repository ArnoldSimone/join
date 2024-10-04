const BASE_URL = "https://join-5800e-default-rtdb.europe-west1.firebasedatabase.app/";

function addTaskToFirebase(taskData) {
    fetch(`${BASE_URL}/tasks.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            assignedTo: taskData.assignedTo,
            category: taskData.category,
            description: taskData.description,
            dueDate: taskData.dueDate,
            priority: taskData.priority,
            progress: 'todo', 
            subtasks: taskData.subtasks,
            title: taskData.title 
        })
    })
    .then(response => response.json())
    .then(data => {
        clearForm();
    })
}

function gatherFormData() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const assignedTo = document.getElementById('assigned').value;
    const dueDate = document.getElementById('due-date').value;
    const priorityButtons = document.querySelectorAll('.prio');
    let selectedPriority = '';

    priorityButtons.forEach(button => {
        if (button.classList.contains('selected')) {
            selectedPriority = button.textContent.trim();
        }
    });

    const category = document.getElementById('category').value;

    const subtaskElements = document.querySelectorAll('.subtask-connect input');
    const subtasks = [];
    subtaskElements.forEach((element, index) => {
        subtasks.push({
            completed: false,
            title: element.value
        });
    });

    return {
        title, 
        description,
        assignedTo,
        dueDate,
        priority: selectedPriority,
        category,
        subtasks
    };
}


function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('assigned').value = 'Select contacts to assign';
    document.getElementById('due-date').value = '';
    document.getElementById('category').value = 'Select task category';
    document.getElementById('subtasks').value = '';
    document.querySelectorAll('input[name="priority"]').forEach(input => input.checked = false);
}


function submitForm() {
    const taskData = gatherFormData();
    addTaskToFirebase(taskData);
}

function fetchContacts() {
    fetch(`${BASE_URL}/contacts.json`)
    .then(response => response.json())
    .then(data => {
        populateContactsDropdown(data);
    })
    .catch((error) => {
        console.error('Error fetching contacts:', error);
    });
}

function populateContactsDropdown(contacts) {
    const assignedSelect = document.getElementById('assigned');
    assignedSelect.innerHTML = '<option>Select contacts to assign</option>'; 

    for (let key in contacts) {
        if (contacts.hasOwnProperty(key)) {
            const contact = contacts[key];
            const option = document.createElement('option');
            option.value = contact.name; 
            option.textContent = contact.name;
            assignedSelect.appendChild(option);
        }
    }
}

window.onload = function() {
    fetchContacts(); 
    includeHTML(); 
};