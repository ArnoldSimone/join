let selectedPriority = '';
let allContacts;
let users = [];
let subtasks = [];


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
        let name = allContacts[index].name;
        let initial = allContacts[index].avatar.initials;
        let color = allContacts[index].avatar.color;
        let id = allContacts[index].id;
        let checked = users.find(user => user.id === id) ? 'checked' : ''; 
        list.innerHTML += generateCreateOption(name, initial, color, id, checked);
    };
}


function assignedSearch() {
    let searchText = document.getElementById('assignedInput').value;
    if (searchText.length > 0) {
        searchIndexOfArray(searchText);
    } else { 
        if (searchText.length == 0) {
            resetSearch();
            renderAllContactsInAssignedTo();
        };
    };
}


function searchIndexOfArray(searchText) {
    result = allContacts.filter(element => element.name.toLowerCase().includes(searchText.toLowerCase()));
    renderSearchResult(result);
}


function renderSearchResult(result) {
    let searchList = document.getElementById('assignedList');
    searchList.innerHTML = '';
    for (let index = 0; index < result.length; index++) {
        let name = result[index].name;
        let initial = result[index].avatar.initials;
        let color = result[index].avatar.color;
        let id = result[index].id;
        let checked = users.find(user => user.id === id) ? 'checked' : '';
        searchList.innerHTML += generateCreateOption(name, initial, color, id, checked);        
    };
    openUserList();
}


function openUserList() {
    document.getElementById('assignedList').classList.remove('d-none');
    document.getElementById('selectedUser').classList.add('d-none');
}


function resetSearch() {
    let list = document.getElementById('assignedList');
    list.innerHTML = '';
    result = '';
}


function assignedListToogle() {
    let list = document.getElementById('assignedList');
    let users = document.getElementById('selectedUser');
    if (list.classList.contains('d-none')) {
        list.classList.remove('d-none');
        users.classList.add('d-none');
    } else { 
        list.classList.add('d-none');
        users.classList.remove('d-none');
    };
    resetSearchValue();
    toogleInputImage();
    toogleInputBorderColor();
}


function resetSearchValue() {
    document.getElementById('assignedInput').value = '';
}


function inputValueCheck() {
    let value = document.getElementById('assignedInput').value;
    if (value == 0) {
        document.getElementById('assignedInput').value = "";
    } else {
        return
    };
}


function toogleInputImage() {
    let image = document.getElementById('assignedImage');
    if (image.src.includes('assets/icon/arrow_drop_downaa.svg')) {
        image.src = '../assets/icon/arrow_drop_up.svg'
    } else {
        image.src = '../assets/icon/arrow_drop_downaa.svg'
    };
}


function toogleInputBorderColor() {
    let inputElement  = document.getElementById('inputAssigned');
    let color = window.getComputedStyle(inputElement).borderColor;
    if (color == 'rgb(209, 209, 209)') {
        inputElement.style.borderColor = 'var(--lightblue)';
    } else {
        inputElement.style.borderColor = 'var(--middlegrey)';
    };
}


function selectionUser(id) {    
    let user = allContacts.find(user => user.id == id);    
    let result = users.find((element) => element == user);
    if (!result) {
        users.push(user);
    } else {
        deleteUser(user);
    };
    toogleUserCheckbox(id);
    renderSelectArray();
}


function toogleUserCheckbox(id) {
    let checkbox = document.querySelector(`input[data-user-id="${id}"]`);
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
    } else {
        console.error(`Checkbox not found for user with ID ${id}`);
    };
}


function renderSelectArray() {
    let listContent = document.getElementById('selectedUser');
    listContent.innerHTML = '';
    for (let index = 0; index < users.length; index++) {
        let initial = users[index].avatar.initials;
        let color = users[index].avatar.color;
        listContent.innerHTML += generateSelectedUsersHTML(initial, color);
    };
}


function deleteUser(id) {
    let index = users.findIndex((user) => user == id);
    if (users.length > 1 ) {
        users.splice(index, 1);
    }else {
        users.splice(index, 1);
        assignedListToogle();
    };
}


async function addTaskToFirebase(taskData) {
    try {
        const result = await postToDatabase("tasks", taskData);
        if (result) {
            handleSuccessfulTaskCreation();
        }
    } catch (error) {
        console.error("Error adding task to Firebase:", error);
    }
}


function handleSuccessfulTaskCreation() {
    showPopup();
}


function showPopup() {
    const popup = document.getElementById('success-popup');
    popup.classList.remove('d-none');

    setTimeout(() => {
        popup.classList.add('d-none'); 
        window.location.href = 'board.html';
    }, 2000);
}


function submitForm() {
    const taskData = gatherFormData();
    addTaskToFirebase(taskData);
}


function gatherFormData() {
    return {
        title: getFormValue("title"),
        description: getFormValue("description"),
        assignedTo:  getFormValue("selectedUser"), 
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
    const subtaskElements = document.querySelectorAll('#subtask-list li');
    return Array.from(subtaskElements).map(el => ({ completed: false, title: el.textContent.slice(2) }));
}


function addSubtask() {
    let subtaskInput = document.getElementById('subtasks');
    
    if (subtaskInput && subtaskInput.value.trim() !== '') {
        let subtaskText = subtaskInput.value.trim();

        let subtaskList = document.getElementById('subtask-list');
        let subtaskId = subtasks.length; 

        subtaskList.innerHTML += `
            <li id="subtask-${subtaskId}">
                <span id="subtask-text-${subtaskId}">${subtaskText}</span>
                <input type="text" id="edit-subtask-${subtaskId}" class="edit-subtask-input" value="${subtaskText}" style="display: none;">
                <button type="button" onclick="editSubtask(${subtaskId})"><img src="../assets/img/edit.png" alt=""></button>
                <button type="button" onclick="deleteSubtask(${subtaskId})"><img src="../assets/img/dustbinDark.svg" alt=""></button>
                <button type="button" id="save-${subtaskId}" style="display: none;" onclick="saveSubtask(${subtaskId})">Save</button>
            </li>
        `;

        subtasks.push({
            id: subtaskId, 
            title: subtaskText,
            completed: false
        });

        subtaskInput.value = '';
    } else {
        console.error('Das Eingabefeld ist leer oder nicht vorhanden.');
    }
}


function editSubtask(index) {
    const subtask = subtasks[index];
    let subtaskElement = document.querySelectorAll('#subtask-list li')[index];

    subtaskElement.innerHTML = `
        <input type="text" id="edit-subtask-input" value="${subtask.title}" class="edit-subtask-input">
        <button onclick="saveSubtask(${index})"><img src="../assets/img/check.png" alt=""></button>
        <button onclick="cancelEdit(${index})"><img src="../assets/img/dustbinDark.svg" alt=""></button>
    `;
}

function saveSubtask(index) {
    let newTitle = document.getElementById('edit-subtask-input').value.trim();

    if (newTitle !== '') {
        subtasks[index].title = newTitle;

        renderSubtasks();
    }
}

function cancelEdit(index) {
    renderSubtasks();
}

function renderSubtasks() {
    let subtaskList = document.getElementById('subtask-list');
    subtaskList.innerHTML = '';

    subtasks.forEach((subtask, index) => {
        subtaskList.innerHTML += `
            <li class="subtask-item" onmouseover="showButtons(${index})" onmouseout="hideButtons(${index})">
                ${subtask.title}
                <span id="subtask-buttons-${index}" class="subtask-buttons" style="display:none;">
                    <button onclick="editSubtask(${index})"><img src="../assets/img/edit.png" alt=""></button>
                    <button onclick="deleteSubtask(${index})"><img src="../assets/img/dustbinDark.svg" alt=""></button>
                </span>
            </li>`;
    });
}

function showButtons(index) {
    document.getElementById(`subtask-buttons-${index}`).style.display = 'inline';
}

function hideButtons(index) {
    document.getElementById(`subtask-buttons-${index}`).style.display = 'none';
}

function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
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
