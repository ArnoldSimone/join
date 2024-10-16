let selectedPriority = '';
let allContacts;
let users = [];
let subtasks = [];


function init() {
    fetchContacts();
    setMinDate();
    mediumPriority();
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
    }
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
    const result = await postToDatabase("tasks", taskData);
        if (result) {
            handleSuccessfulTaskCreation();
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
    let valid = validateField("title", taskData.title) &&
                validateField("due-date", taskData.dueDate, true) &&
                validateField("category", taskData.category);

    if (valid) addTaskToFirebase(taskData);
}


function validateField(fieldId, value, isDate = false) {
    const input = document.getElementById(fieldId);
    const errorText = getErrorText(fieldId, input);
    const isValid = value && (!isDate || new Date(value) >= new Date());

    setFieldState(input, errorText, isValid);
    return isValid;
}


function getErrorText(fieldId, input) {
    let errorText = document.getElementById(`${fieldId}-error`);
    if (!errorText) {
        errorText = document.createElement("small");
        errorText.id = `${fieldId}-error`;
        errorText.style.color = "red";
        errorText.style.fontSize = "10px";
        errorText.style.display = "block";
        input.parentNode.appendChild(errorText);
    }
    return errorText;
}


function setFieldState(input, errorText, isValid) {
    input.style.border = isValid ? "" : "1px solid red";
    errorText.textContent = isValid ? "" : "This field is required";
}


function setMinDate() {
    let today = new Date().toISOString().split('T')[0]; 
    document.getElementById("due-date").setAttribute("min", today); 
}


function validateDate() {
    const input = document.getElementById("due-date");
    const selectedDate = new Date(input.value);
    const today = new Date();

    if (selectedDate < today) {
        input.setCustomValidity("Bitte wählen Sie ein zukünftiges Datum.");
        input.reportValidity();
    } else {
        input.setCustomValidity(""); 
    }
}


function gatherFormData() {
    return {
        title: getFormValue("title"),
        description: getFormValue("description"),
        assignedTo: gatherSelectedUsers(),
        dueDate: getFormValue("due-date"),
        priority: selectedPriority,
        category: getFormValue("category"),
        progress: "todo",
        subtasks: gatherSubtasks()
    };
}


function gatherSelectedUsers() {
    return users.map(user => user.name);
}


function getFormValue(name) {
    return document.forms["taskForm"][name].value;
}


function gatherSubtasks() {
    const subtaskElements = document.querySelectorAll('#subtask-list li');
    return Array.from(subtaskElements).map(el => ({ completed: false, title: el.textContent.slice(2) }));
}


function showSubtaskActionButtons() {
    document.getElementById('plus-icon').style.display = 'none';
    document.getElementById('subtask-action-buttons').style.display = 'inline-block';
}


function clearSubtaskInput() {
    let subtaskInput = document.getElementById('subtasks');
    subtaskInput.value = '';
    hideSubtaskActionButtons();
}


function hideSubtaskActionButtons() {
    document.getElementById('plus-icon').style.display = 'inline-block';
    document.getElementById('subtask-action-buttons').style.display = 'none';
}


function addSubtask() {
    let subtaskInput = getSubtaskInput();
    if (isValidSubtask(subtaskInput)) {
        let subtaskText = subtaskInput.value.trim();
        let subtaskId = subtasks.length;
        appendSubtaskToList(subtaskId, subtaskText);
        subtasks.push(createSubtask(subtaskId, subtaskText));
        subtaskInput.value = '';
        hideSubtaskActionButtons();
    }
}


function getSubtaskInput() {
    return document.getElementById('subtasks');
}


function isValidSubtask(subtaskInput) {
    return subtaskInput && subtaskInput.value.trim() !== '';
}


function appendSubtaskToList(subtaskId, subtaskText) {
    let subtaskList = document.getElementById('subtask-list');
    subtaskList.innerHTML += generateSubtaskHTML(subtaskId, subtaskText);
}


function createSubtask(subtaskId, subtaskText) {
    return { id: subtaskId, title: subtaskText, completed: false };
}


function editSubtask(index) {
    const subtask = subtasks[index];
    let subtaskElement = document.querySelectorAll('#subtask-list li')[index];
    subtaskElement.classList.add('edit-mode');
    subtaskElement.innerHTML = generateEditSubtaskHTML(index, subtask.title);
}


function saveSubtask(index) {
    let newTitle = document.getElementById('edit-subtask-input').value.trim();

    if (newTitle !== '') {
        subtasks[index].title = newTitle;

        renderSubtasks();
    }
}


function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks(); 
}


function cancelEdit(index) {
    renderSubtasks();
}


function renderSubtasks() {
    let subtaskList = document.getElementById('subtask-list');
    subtaskList.innerHTML = '';
    subtasks.forEach((subtask, index) => {
        subtaskList.innerHTML += generateSubtaskItemHTML(subtask.title, index);
    });
}


function showButtons(index) {
    const buttons = document.getElementById(`subtask-buttons-${index}`);
    if (buttons) {
        buttons.style.display = 'inline';
    }
}


function hideButtons(index) {
    const buttons = document.getElementById(`subtask-buttons-${index}`);
    if (buttons) {
        buttons.style.display = 'none';
    }
}


function setFormValue(name, value) {
    const formField = document.forms["taskForm"][name];
    if (formField) {
        formField.value = value;
    }
}


function clearForm() {
    setFormValue("title", '');
    setFormValue("description", '');
    clearAssignedUsers();
    setFormValue("due-date", '');
    clearSubtasks();
}


function clearAssignedUsers() {
    const selectedUser = document.getElementById('selectedUser');
    if (selectedUser) {
        selectedUser.innerHTML = '';
    }
    document.getElementById('assignedInput').value = '';
}


function clearSubtasks() {
    const subtaskList = document.getElementById('subtask-list');
    if (subtaskList) {
        subtaskList.innerHTML = '';
    }
    subtasks = []; 
}


function mediumPriority() {
    const savedPriority = localStorage.getItem('selectedPriority') || 'Medium';
    changePrio(savedPriority);
};


function changePrio(priority) {
    const priorityConfig = getPriorityConfig();
    const buttons = document.querySelectorAll('.prio');
    selectedPriority = priority;

    localStorage.setItem('selectedPriority', priority);

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
    button.style.color = 'white';
    button.style.fontWeight = 'bold';
    button.classList.add(`${button.textContent.trim().toLowerCase()}-active`);
}


function resetButtonStyle(button, config, img) {
    button.style.backgroundColor = 'white';
    img.src = config.defaultImg;
    button.style.color = 'black';
    button.style.fontWeight = 'normal';
    button.classList.remove(`${button.textContent.trim().toLowerCase()}-active`);
}