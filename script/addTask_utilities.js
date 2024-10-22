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
        openAssignedList(list, users);
    } else { 
        closeAssignedList(list, users);
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
    let inputElement  = document.getElementById('inputAssigned');
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
    let checkbox = getCheckbox(id);
    let assignedContent = getAssignedContent(id);
    if (checkbox) {
        toggleCheckbox(checkbox);
        updateAssignedContentStyles(checkbox.checked, assignedContent);
    }
}


/**
 * Retrieves the checkbox element for a specific user.
 * @param {string} id - The unique identifier of the user.
 */
function getCheckbox(id) {
    return document.querySelector(`input[data-user-id="${id}"]`);
}


/**
 * Retrieves the assigned content element for a specific user.
 * @param {string} id - The unique identifier of the user.
 */
function getAssignedContent(id) {
    return document.getElementById(`assigned-content-${id}`);
}


/**
 * Toggles the checked state of the given checkbox.
 * @param {HTMLInputElement} checkbox - The checkbox element to toggle.
 */
function toggleCheckbox(checkbox) {
    checkbox.checked = !checkbox.checked;
}


/**
 * Updates the styles of the assigned content based on whether the checkbox is checked or not.
 * @param {boolean} isChecked - The state of the checkbox (true if checked, false if not).
 * @param {HTMLElement} assignedContent - The content element to update styles for.
 */
function updateAssignedContentStyles(isChecked, assignedContent) {
    if (isChecked) {
        assignedContent.style.backgroundColor = 'var(--darkblue)';
        assignedContent.style.color = 'white';
        assignedContent.style.borderRadius = '10px';        
    } else {
        resetAssignedContentStyles(assignedContent);
    }
}


/**
 * Resets the styles of the assigned content to their default state.
 * @param {HTMLElement} assignedContent - The content element to reset styles for.
 */
function resetAssignedContentStyles(assignedContent) {
    assignedContent.style.backgroundColor = '';
    assignedContent.style.color = '';
    assignedContent.style.borderRadius = '';
}



/**
 * Renders the selected users in the selected user list.
 */
function renderSelectArray() {
    let listContent = document.getElementById('selectedUser');
    listContent.innerHTML = ''; 
    const maxAvatars = 7; 
    const extraUsersCount = users.length - maxAvatars;
    for (let index = 0; index < Math.min(users.length, maxAvatars); index++) {
        let initial = users[index].avatar.initials;
        let color = users[index].avatar.color;
        listContent.innerHTML += generateSelectedUsersHTML(initial, color);
    }
    if (extraUsersCount > 0) {
        listContent.innerHTML += generateExtraUsersHTML(extraUsersCount);
    }
}


/**
 * Deletes a user from the users array by their ID.
 * @param {string} id - The ID of the user to delete.
 */
function deleteUser(id) {
    let index = users.findIndex((user) => user == id);
    if (users.length > 1 ) {
        users.splice(index, 1);
    }else {
        users.splice(index, 1);
        assignedListToogle();
    };
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
 * @param {HTMLElement} button - The button element containing the image to be changed.
 * @param {string} state - The state of the button, either 'hover' or 'default'.
 */
function changeImage(button, state) {
    const img = button.querySelector('img');
    
    if (state === 'hover') {
        img.src = '../assets/img/close-blue.svg'; 
    } else {
        img.src = '../assets/img/close.svg'; 
    }
}
