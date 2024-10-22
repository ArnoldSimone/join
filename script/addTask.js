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
    let contactsData = await loadFromDatabase("/contacts");
    allContacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
    renderAllContactsInAssignedTo();
}


/**
 * Renders all contacts in the assigned to list.
 */
function renderAllContactsInAssignedTo() {
    let list = document.getElementById('assignedList');
    clearListContent(list);
    allContacts.forEach(contact => {
        let { name, avatar: { initials, color }, id } = contact;
        let checked = isUserAssigned(id) ? 'checked' : '';
        list.innerHTML += generateCreateOption(name, initials, color, id, checked);
    });
}


/**
 * Clears the content of the provided list element.
 * @param {HTMLElement} list - The list element to clear.
 */
function clearListContent(list) {
    list.innerHTML = '';
}


/**
 * Checks if a user is assigned based on their ID.
 * @param {string} id - The ID of the contact to check.
 */
function isUserAssigned(id) {
    return users.some(user => user.id === id);
}



/**
 * Adds a task to Firebase with the provided task data.
 * @param {Object} taskData - The task data to add to Firebase.
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
    popup.classList.remove('popupExit');
    popup.querySelector('.popup-content').style.animation = 'popupEnter 0.5s forwards';
    setTimeout(() => {
        popup.querySelector('.popup-content').style.animation = 'popupExit 0.5s forwards';
        setTimeout(() => {
            popup.classList.add('d-none');
            window.location.href = 'board.html';
        }, 500);
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
 */
function gatherSelectedUsers() {
    return users.map(user => ({ 'id': user.id, 'name': user.name}));
}


/**
 * Retrieves the value of a specific form field by name.
 * @param {string} name - The name of the form field to get the value for.
 */
function getFormValue(name) {
    return document.forms["taskForm"][name].value;
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
 * Resets validations and removes error messages from all relevant fields.
 */
function resetValidations() {
    const fields = ["title", "description", "due-date", "category"];

    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        const errorText = document.getElementById(`${fieldId}-error`);

        if (input) {
            input.style.border = "";
            if (errorText) {
                errorText.textContent = "";
            }
        }
    });
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
    setFormValue("subtasks", '');
    resetValidations();
}


/**
 * Clears all assigned users and resets the input field and checkboxes.
 */
function clearAssignedUsers() {
    clearSelectedUser();
    resetAssignedInput();
    resetCheckboxes();
}


/**
 * Clears the content of the selected user display.
 */
function clearSelectedUser() {
    const selectedUser = document.getElementById('selectedUser');
    if (selectedUser) {
        selectedUser.innerHTML = '';
    }
}


/**
 * Resets the value of the assigned input field.
 */
function resetAssignedInput() {
    document.getElementById('assignedInput').value = '';
}


/**
 * Resets all checkboxes in the assigned list and their associated styles.
 */
function resetCheckboxes() {
    const checkboxes = document.querySelectorAll('#assignedList input[type="checkbox"]');
    checkboxes.forEach(resetCheckbox);
}


/**
 * Resets a single checkbox and its associated content styles.
 * @param {HTMLInputElement} checkbox - The checkbox element to reset.
 */
function resetCheckbox(checkbox) {
    checkbox.checked = false;
    const assignedUserDiv = checkbox.closest('.assigned-content');
    if (assignedUserDiv) {
        resetAssignedUserStyles(assignedUserDiv);
    }
}


/**
 * Resets the styles of the assigned user content.
 * @param {HTMLElement} assignedUserDiv - The div containing the assigned user content.
 */
function resetAssignedUserStyles(assignedUserDiv) {
    assignedUserDiv.style.backgroundColor = 'white';
    assignedUserDiv.style.color = 'black';
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