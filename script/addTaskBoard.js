let selectedPriority = '';
// let allContacts;
let users = [];
let subtasks = [];
let editingSubtaskIndex = null;
let listOpen = false;


/**
 * Initializes the application by fetching contacts, setting the minimum date for the due date input, and setting the medium priority.
 */
function init() {
    fetchContacts();
    setMinDate();
    mediumPriority();
}


/**
 * Fetches the contacts from the database and renders them in the assigned list.
 * @async
 * @returns {Promise<void>}
 */
async function fetchContacts() {
    // let contactsData = await loadFromDatabase("/contacts");
    // allContacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
    renderAllContactsInAssignedTo();
}


/**
 * Renders all contacts in the assigned to list.
 */
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


/**
 * Handles the assigned search input and filters the contacts based on the search text.
 */
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


/**
 * Filters the contacts array based on the search text and renders the search results.
 * @param {string} searchText - The text to search for in the contacts.
 */
function searchIndexOfArray(searchText) {
    result = allContacts.filter(element => element.name.toLowerCase().includes(searchText.toLowerCase()));
    renderSearchResult(result);
}


/**
 * Renders the search results in the assigned list.
 * @param {Array} result - The filtered list of contacts based on the search.
 */
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


/**
 * Opens the user list by displaying the assigned list and hiding the selected user list.
 */
function openUserList() {
    document.getElementById('assignedList').classList.remove('d-none');
    document.getElementById('selectedUser').classList.add('d-none');
}


/**
 * Resets the search results and clears the current search.
 */
function resetSearch() {
    let list = document.getElementById('assignedList');
    list.innerHTML = '';
    result = '';
}


/**
 * Toggles the visibility of the assigned list and the selected user list.
 */
function assignedListToogle() {
    let list = document.getElementById('assignedList');
    let users = document.getElementById('selectedUser');

    if (list.classList.contains('d-none')) {
        openAssignedList(list, users);  // Auslagerung in eine separate Funktion
    } else {
        closeAssignedList(list, users); // Auslagerung in eine separate Funktion
    }

    resetSearchValue();
    toogleInputImage();
    toogleInputBorderColor();
}


/**
 * Opens the assigned list and hides the selected users list.
 * @param {HTMLElement} list - The element containing the assigned list.
 * @param {HTMLElement} users - The element containing the selected users list.
 */
function openAssignedList(list, users) {
    list.classList.remove('d-none');
    users.classList.add('d-none');
    listOpen = true;
    document.addEventListener('click', closeListOnClickOutside);
}


/**
 * Closes the assigned list and shows the selected users list.
 * @param {HTMLElement} list - The element containing the assigned list.
 * @param {HTMLElement} users - The element containing the selected users list.
 */
function closeAssignedList(list, users) {
    list.classList.add('d-none');
    users.classList.remove('d-none');
    listOpen = false;
    document.removeEventListener('click', closeListOnClickOutside);
}


/**
 * Closes the list when a click is detected outside the list.
 * @param {Event} event - The click event.
 */
function closeListOnClickOutside(event) {
    let listElement = document.getElementById('assignedList');
    let assignedInput = document.getElementById('inputAssigned');

    if (!listElement.contains(event.target) && !assignedInput.contains(event.target)) {
        assignedListToogle();
    }
}


/**
 * Resets the value of the assigned input field.
 */
function resetSearchValue() {
    document.getElementById('assignedInput').value = '';
}


/**
 * Checks the input value and resets it if it is empty.
 */
function inputValueCheck() {
    let value = document.getElementById('assignedInput').value;
    if (value == 0) {
        document.getElementById('assignedInput').value = "";
    } else {
        return
    };
}


/**
 * Toggles the image source for the assigned input dropdown.
 */
function toogleInputImage() {
    let image = document.getElementById('assignedImage');
    if (image.src.includes('assets/icon/arrow_drop_downaa.svg')) {
        image.src = '../assets/icon/arrow_drop_up.svg'
    } else {
        image.src = '../assets/icon/arrow_drop_downaa.svg'
    };
}


/**
 * Toggles the border color of the assigned input field based on its current state.
 */
function toogleInputBorderColor() {
    let inputElement = document.getElementById('inputAssigned');
    let color = window.getComputedStyle(inputElement).borderColor;
    if (color == 'rgb(209, 209, 209)') {
        inputElement.style.borderColor = 'var(--lightblue)';
    } else {
        inputElement.style.borderColor = 'var(--middlegrey)';
    };
}


/**
 * Selects or deselects a user by their ID and updates the user selection.
 * @param {string} id - The ID of the user to select or deselect.
 */
function selectionUser(id) {
    let user = allContacts.find(user => user.id == id);
    let result = users.find((element) => element == user);
    if (!result) {
        users.push(user);
    } else {
        deleteUser(user);
    };
    toggleUserCheckbox(id);
    renderSelectArray();
}


/**
 * Toggles the checkbox state for a user based on their ID.
 * @param {string} id - The ID of the user whose checkbox state should be toggled.
 */
function toggleUserCheckbox(id) {
    let checkbox = document.querySelector(`input[data-user-id="${id}"]`);
    let assignedContent = document.getElementById(`assigned-content-${id}`);

    if (checkbox) {
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
            assignedContent.style.backgroundColor = 'var(--middlegrey';
        } else {
            assignedContent.style.backgroundColor = '';
        }
    }
}


/**
 * Renders the selected users in the selected user list.
 */
function renderSelectArray() {
    let listContent = document.getElementById('selectedUser');
    listContent.innerHTML = '';
    for (let index = 0; index < users.length; index++) {
        let initial = users[index].avatar.initials;
        let color = users[index].avatar.color;
        listContent.innerHTML += generateSelectedUsersHTML(initial, color);
    };
}


/**
 * Deletes a user from the users array by their ID.
 * @param {string} id - The ID of the user to delete.
 */
function deleteUser(id) {
    let index = users.findIndex((user) => user == id);
    if (users.length > 1) {
        users.splice(index, 1);
    } else {
        users.splice(index, 1);
        assignedListToogle();
    };
}


/**
 * Adds a task to Firebase with the provided task data.
 * @param {Object} taskData - The task data to add to Firebase.
 * @returns {Promise<void>}
 */
async function addTaskToFirebase(taskData) {
    const result = await postToDatabase("tasks", taskData);
    if (result) {
        handleSuccessfulTaskCreation();
    }
}


/**
 * Handles successful task creation by showing a popup.
 */
function handleSuccessfulTaskCreation() {
    showPopup();
}


/**
 * Displays a success popup and redirects to the board page after a timeout.
 */
function showPopup() {
    const popup = document.getElementById('success-popup');
    popup.classList.remove('d-none');

    setTimeout(() => {
        popup.classList.add('d-none');
        window.location.href = 'board.html';
    }, 2000);
}


/**
 * Submits the task form by validating the fields and adding the task to Firebase if valid.
 */
function submitForm() {
    const taskData = gatherFormData();
    let valid = validateField("title", taskData.title) &&
        validateField("due-date", taskData.dueDate, true) &&
        validateField("category", taskData.category);

    if (valid) addTaskToFirebase(taskData);
}


/**
 * Validates a specific field based on its ID and value.
 * @param {string} fieldId - The ID of the field to validate.
 * @param {string} value - The value of the field to validate.
 * @param {boolean} [isDate=false] - Indicates if the field is a date field.
 * @returns {boolean} - Returns true if the field is valid; otherwise, false.
 */
function validateField(fieldId, value, isDate = false) {
    const input = document.getElementById(fieldId);
    const errorText = getErrorText(fieldId, input);
    const isValid = value && (!isDate || new Date(value) >= new Date());

    setFieldState(input, errorText, isValid);
    return isValid;
}


/**
 * Gets or creates an error text element for a specific input field.
 * @param {string} fieldId - The ID of the field to get the error text for.
 * @param {HTMLInputElement} input - The input element associated with the field.
 * @returns {HTMLElement} - The error text element.
 */
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


/**
 * Sets the state of the input field and its error text based on validity.
 * @param {HTMLInputElement} input - The input element to set the state for.
 * @param {HTMLElement} errorText - The error text element to update.
 * @param {boolean} isValid - Indicates if the input is valid.
 */
function setFieldState(input, errorText, isValid) {
    input.style.border = isValid ? "" : "1px solid red";
    errorText.textContent = isValid ? "" : "This field is required";
}


/**
 * Sets the minimum date for the due date input field to today’s date.
 */
function setMinDate() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("due-date").setAttribute("min", today);
}


/**
 * Validates the selected due date and shows an error message if it is in the past.
 */
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


/**
 * Gathers all form data into an object for submission.
 * @returns {Object} - The collected form data.
 */
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


/**
 * Gathers the names of the selected users.
 * @returns {Array} - An array of selected user names.
 */
function gatherSelectedUsers() {
    return users.map(user => user.name);
}


/**
 * Retrieves the value of a specific form field by name.
 * @param {string} name - The name of the form field to get the value for.
 * @returns {string} - The value of the specified form field.
 */
function getFormValue(name) {
    return document.forms["taskForm"][name].value;
}


/**
 * Gathers the subtasks from the subtask list.
 * @returns {Array} - An array of subtask objects.
 */
function gatherSubtasks() {
    const subtaskElements = document.querySelectorAll('#subtask-list li');
    return Array.from(subtaskElements).map(el => ({ completed: false, title: el.textContent.slice(2) }));
}


/**
 * Shows the action buttons for subtasks.
 */
function showSubtaskActionButtons() {
    document.getElementById('plus-icon').style.display = 'none';
    document.getElementById('subtask-action-buttons').style.display = 'inline-block';
}


/**
 * Clears the subtask input field.
 */
function clearSubtaskInput() {
    let subtaskInput = document.getElementById('subtasks');
    subtaskInput.value = '';
    hideSubtaskActionButtons();
}


/**
 * Hides the action buttons for subtasks.
 */
function hideSubtaskActionButtons() {
    document.getElementById('plus-icon').style.display = 'inline-block';
    document.getElementById('subtask-action-buttons').style.display = 'none';
}


/**
 * Adds a new subtask to the list if the input is valid.
 */
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


/**
 * Adds the ability to add a subtask by pressing the Enter key.
 */
document.getElementById('subtasks').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addSubtask();
    }
});


/**
 * Retrieves the subtask input field element.
 * @returns {HTMLInputElement} - The subtask input element.
 */
function getSubtaskInput() {
    return document.getElementById('subtasks');
}


/**
 * Checks if the subtask input is valid.
 * @param {HTMLInputElement} subtaskInput - The subtask input field to validate.
 * @returns {boolean} - Returns true if valid; otherwise, false.
 */
function isValidSubtask(subtaskInput) {
    return subtaskInput && subtaskInput.value.trim() !== '';
}


/**
 * Appends a new subtask to the subtask list.
 * @param {number} subtaskId - The ID of the subtask to append.
 * @param {string} subtaskText - The text of the subtask to append.
 */
function appendSubtaskToList(subtaskId, subtaskText) {
    let subtaskList = document.getElementById('subtask-list');
    subtaskList.innerHTML += generateSubtaskHTML(subtaskId, subtaskText);
}


/**
 * Creates a subtask object.
 * @param {number} subtaskId - The ID of the subtask.
 * @param {string} subtaskText - The title of the subtask.
 * @returns {Object} - The created subtask object.
 */
function createSubtask(subtaskId, subtaskText) {
    return { id: subtaskId, title: subtaskText, completed: false };
}


/**
 * Edits a specific subtask by its index. Closes the currently edited subtask if another one is clicked.
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask(index) {
    if (editingSubtaskIndex !== null && editingSubtaskIndex !== index) {
        renderSubtasks();
    }
    editingSubtaskIndex = index;

    const subtask = subtasks[index];
    let subtaskElement = document.querySelectorAll('#subtask-list li')[index];
    subtaskElement.classList.add('edit-mode');
    subtaskElement.innerHTML = generateEditSubtaskHTML(index, subtask.title);
}


/**
 * Saves changes made to a specific subtask.
 * @param {number} index - The index of the subtask to save.
 */
function saveSubtask(index) {
    let newTitle = document.getElementById('edit-subtask-input').value.trim();

    if (newTitle !== '') {
        subtasks[index].title = newTitle;
        renderSubtasks();
        editingSubtaskIndex = null;
    }
}


/**
 * Cancels the editing of a subtask and re-renders the subtasks.
 * @param {number} index - The index of the subtask to cancel editing for.
 */
function cancelEdit(index) {
    renderSubtasks();
    editingSubtaskIndex = null;
}



/**
 * Deletes a specific subtask by its index.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask(index) {
    subtasks.splice(index, 1);
    renderSubtasks();
}


/**
 * Renders all subtasks in the subtask list.
 */
function renderSubtasks() {
    let subtaskList = document.getElementById('subtask-list');
    subtaskList.innerHTML = '';
    subtasks.forEach((subtask, index) => {
        subtaskList.innerHTML += generateSubtaskItemHTML(subtask.title, index);
    });
}


/**
 * Shows action buttons for a specific subtask.
 * @param {number} index - The index of the subtask to show buttons for.
 */
function showButtons(index) {
    const buttons = document.getElementById(`subtask-buttons-${index}`);
    if (buttons) {
        buttons.style.display = 'inline';
    }
}


/**
 * Hides action buttons for a specific subtask.
 * @param {number} index - The index of the subtask to hide buttons for.
 */
function hideButtons(index) {
    const buttons = document.getElementById(`subtask-buttons-${index}`);
    if (buttons) {
        buttons.style.display = 'none';
    }
}


/**
 * Sets the value of a specific form field by name.
 * @param {string} name - The name of the form field to set the value for.
 * @param {string} value - The value to set for the specified form field.
 */
function setFormValue(name, value) {
    const formField = document.forms["taskForm"][name];
    if (formField) {
        formField.value = value;
    }
}


/**
 * Clears all fields in the task form.
 */
function clearForm() {
    setFormValue("title", '');
    setFormValue("description", '');
    clearAssignedUsers();
    setFormValue("due-date", '');
    mediumPriority();
    setFormValue("category", '')
    clearSubtasks();
}


/**
 * Clears the selected users from the user list, unchecks all user checkboxes, and resets the background color.
 */
function clearAssignedUsers() {
    const selectedUser = document.getElementById('selectedUser');
    if (selectedUser) {
        selectedUser.innerHTML = '';
    }
    document.getElementById('assignedInput').value = '';
    const checkboxes = document.querySelectorAll('#assignedList input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
        const assignedUserDiv = checkbox.closest('.assigned-content');
        if (assignedUserDiv) {
            assignedUserDiv.style.backgroundColor = 'white';
        }
    });
}


/**
 * Clears all subtasks from the subtask list.
 */
function clearSubtasks() {
    const subtaskList = document.getElementById('subtask-list');
    if (subtaskList) {
        subtaskList.innerHTML = '';
    }
    subtasks = [];
}


/**
 * Sets the default priority to medium and retrieves it from local storage if available.
 */
function mediumPriority() {
    changePrio('Medium');
}


/**
 * Changes the task priority and updates the button styles accordingly.
 * @param {string} priority - The new priority to set.
 */
function changePrio(priority) {
    const priorityConfig = getPriorityConfig();
    const buttons = document.querySelectorAll('.prio');
    selectedPriority = priority;

    localStorage.setItem('selectedPriority', priority);

    buttons.forEach(button => updateButtonStyle(button, priority, priorityConfig));
}


/**
 * Retrieves the configuration for task priorities.
 * @returns {Object} - The configuration object for different priorities.
 */
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


/**
 * Updates the style of the priority buttons based on the selected priority.
 * @param {HTMLElement} button - The button element to update.
 * @param {string} selectedPriority - The currently selected priority.
 * @param {Object} config - The configuration for button styles.
 */
function updateButtonStyle(button, selectedPriority, config) {
    const buttonPriority = button.textContent.trim();
    const img = button.querySelector('img');
    if (buttonPriority === selectedPriority) {
        applyActiveStyle(button, config[selectedPriority], img);
    } else {
        resetButtonStyle(button, config[buttonPriority], img);
    }
}


/**
 * Applies the active style to a priority button.
 * @param {HTMLElement} button - The button element to apply the style to.
 * @param {Object} config - The configuration for the active style.
 * @param {HTMLImageElement} img - The image element inside the button.
 */
function applyActiveStyle(button, config, img) {
    button.style.backgroundColor = config.color;
    img.src = config.activeImg;
    button.style.color = 'white';
    button.style.fontWeight = 'bold';
    button.classList.add(`${button.textContent.trim().toLowerCase()}-active`);
}


/**
 * Resets the style of a priority button to its default appearance.
 * 
 * @param {HTMLElement} button - The button element to reset.
 * @param {Object} config - The configuration object containing default styles and image paths.
 * @param {HTMLImageElement} img - The image element inside the button to update the source.
 */
function resetButtonStyle(button, config, img) {
    button.style.backgroundColor = 'white';
    img.src = config.defaultImg;
    button.style.color = 'black';
    button.style.fontWeight = 'normal';
    button.classList.remove(`${button.textContent.trim().toLowerCase()}-active`);
}


/**
 * Changes the source of an image inside a button depending on the hover state.
 *
 * @param {HTMLElement} button - The button element containing the image to be changed.
 * @param {string} state - The state of the button, either 'hover' or 'default'.
 *                         'hover' changes the image to the hover state.
 *                         'default' resets the image to the original state.
 */
function changeImage(button, state) {
    const img = button.querySelector('img');

    if (state === 'hover') {
        img.src = '../assets/img/close-blue.svg';
    } else {
        img.src = '../assets/img/close.svg';
    }
}
