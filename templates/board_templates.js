/**
 * Generates a template for displaying a message when there are no tasks.
 * @param {string} message - The message to display.
 * @returns {string} The HTML string for the no task template.
 */
function getBoardNoTaskTemplate(message) {
    return `                        
    <div class="ctn-no-tasks d-flex">
        ${message}
    </div>`;
}


/**
 * Generates a template for a task item in the board.
 * @param {Object} task - The task object containing task details.
 * @param {string} task.id - The unique identifier for the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.category - The category of the task.
 * @param {Array} task.subtasks - The list of subtasks associated with the task.
 * @param {Array} task.assignedTo - The list of users assigned to the task.
 * @param {string} task.priority - The priority level of the task (e.g., Low, Medium, Urgent).
 * @returns {string} The HTML string for the task template.
 */
function getBoardTaskTemplate(task) {
    return `
    <div onclick="showDetailTaskOverlay('${task.id}')" id="task-${task.id}" class="ctn-task d-flex-x" draggable="true" ondragstart="startDragging('${task.id}')">
        <div class="ctn-header-task d-flex-x">   
            ${getTaskCategoryTemplate(task.category)}
            <div id="move-to-responsive" class="move-to-responsive">
                <a class="move-task d-flex" href="#" onclick="toggleMenuMoveTo('${task.id}'); handleClickMenu(event)"><img class="img-menu" src="../assets/icon/more.png" alt="More functions"></a>
                <div id="menu-${task.id}" class="menu-move-to d-flex-x d-none" onclick="handleClickMenu(event)">
                    <ul class="ul-move-to d-flex-x">
                        <li class="category-move-to" onclick="moveTaskResponsive('todo', '${task.id}')">To do</li>
                        <li class="category-move-to" onclick="moveTaskResponsive('in progress', '${task.id}')">In Progress</li>
                        <li class="category-move-to" onclick="moveTaskResponsive('await feedback', '${task.id}')">Await Feedback</li>
                        <li class="category-move-to" onclick="moveTaskResponsive('done', '${task.id}')">Done</li>
                    </ul>
                </div>
             </div>
        </div>     
        <p id="task-title" class="task-title">${task.title}</p>
        <p id="task-description" class="task-description">${task.description}</p>
        ${renderTaskProgressBar(task.subtasks)}
        <div class="ctn-task-bottom d-flex-y">
            <div class="ctn-assigned-to mesh d-flex-y">
                ${renderAssignedTo(task.assignedTo)}
            </div>
            ${getImagePrioTemplate(task.priority)}
        </div>
    </div>`;
}


/**
 * Generates a template for the assigned user display.
 * @param {string} initial - The initial of the assigned user.
 * @param {string} color - The background color for the assigned user.
 * @returns {string} The HTML string for the assigned user template.
 */
function getAssignedToTemplate(initial, color) {
    return `<div class="assigned-to mesh d-flex" style="background-color:${color};">${initial}</div>`
}


/**
 * Generates a template for additional assigned users when there are more than 5.
 * @param {number} numberOfAssignedTo - The total number of assigned users.
 * @returns {string} The HTML string for the additional assigned user template.
 */
function getAssignedToTemplateAdditional(numberOfAssignedTo) {
    return `<div class="assigned-to mesh d-flex" style="background-color:grey;">+${numberOfAssignedTo - 5}</div>`
}


/**
 * Generates an image template representing the priority of a task.
 * @param {string} priority - The priority level of the task (e.g., Low, Medium, Urgent).
 * @returns {string} The HTML string for the priority image template.
 */
function getImagePrioTemplate(priority) {
    const priortyImages = {
        'Low': '../assets/img/lowsym.png',
        'Medium': '../assets/img/mediumsym.png',
        'Urgent': '../assets/img/urgentsym.png'
    }
    return `<img class="image-prio-board" src="${priortyImages[priority]}" alt="">`
}


/**
 * Generates a template for the task progress bar.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @returns {string} The HTML string for the task progress bar template.
 */
function getTaskProgressBarTemplate(totalSubtasks, completedSubtasks) {
    return `        
            <div class="task-subtasks d-flex-y">
                <progress max="${totalSubtasks}" value="${completedSubtasks}"></progress>
                <span class="subtasks-count">${completedSubtasks}/${totalSubtasks} Subtasks</span>
            </div>`;
}


/**
 * Generates a template for the task category display.
 * @param {string} category - The category of the task.
 * @returns {string} The HTML string for the task category template.
 */
function getTaskCategoryTemplate(category) {
    return `<p id="task-category" class="task-category ${category == 'User Story' ? 'bg-user-story' : 'bg-technical-task'}">${category}</p>`
}


/**
 * Generates a detailed overlay template for a task.
 * @param {Object} task - The task object containing details to display in the overlay.
 * @returns {string} The HTML string for the task overlay template.
 */
function getTaskOverlayTemplate(task) {
    return `
    <div onclick="bubblingProtection(event)" id="overlay-detail-task-board" class="overlay-detail-task-board ctn-task no-hover d-flex-x">
        <div class="ctn-category-close d-flex-y">
            ${getTaskCategoryTemplate(task.category)}
            <img onclick="closeDetailTaskOverlay()" class="btn-close-detail-task" src="../assets/img/close.svg" alt="Image Close">
        </div>
        <div class="ctn-main-Detail-Task d-flex-x">
            <p id="task-title-detail" class="task-title-detail">${task.title}</p>
            <p id="task-description-detail" class="task-description-detail">${task.description}</p>
            <div class="ctn-due-date d-flex-y">
                <p class="label">Due date:</p>
                <p class="due-date">${formatDate(task.dueDate)}</p>
            </div>
            <div class="ctn-priority d-flex-y">
                <p class="label">Priority:</p>
                <p class="prio-detail">${task.priority}</p>
                ${getImagePrioTemplate(task.priority)}
            </div>
            <div>
                <p class="label">Assigned To:</p>
                <div class="ctn-assigned-to-detail d-flex-x">
                    ${renderAssignedToOverlay(task.assignedTo)}
                </div>
            </div>
            <div>
                <p class="label">Subtasks:</p>
                <div class="ctn-subtasks d-flex-x">
                    ${renderSubtasksOverlay(task)}
                </div>
            </div>
        </div>
        <div class="ctn-delete-edit d-flex-y">
            <img id="btn-delete-task" class="btn-delete-task" onclick="deleteTask('${task.id}')" src="../assets/img/dustbinDarkText.svg" alt="Image Delete">
            <span class="vertikalLine"></span>
            <img onclick="showEditTaskOverlay('${task.id}')" class="btn-edit-task" src="../assets/img/editDarkText.svg" alt="Image Close">
        </div>
    </div>`
}


/**
 * Generates a template for an assigned user in the overlay, showing name and initial.
 * @param {string} initial - The initial of the assigned user.
 * @param {string} color - The background color for the assigned user.
 * @param {string} name - The full name of the assigned user.
 * @returns {string} The HTML string for the assigned user template in the overlay.
 */
function getAssignedToTemplateOverlay(initial, color, name) {
    return `     
        <div class="person-detail d-flex-y">
            <div class="assigned-to d-flex" style="background-color:${color};">${initial}</div>
            <p>${name}</p>
        </div>`
}


/**
 * Generates a template for a subtask in the overlay.
 * @param {number} indexSubTask - The index of the subtask in the array.
 * @param {Object} task - The task object that contains the subtasks.
 * @returns {string} The HTML string for the subtask overlay template.
 */
function getSubtasksOverlayTemplate(indexSubTask, task) {
    let subtasksArray = task.subtasks;
    return `
        <div class="subtask-item d-flex-y">
            <input onchange="updateSubtaskStatus(${indexSubTask}, '${task.id}')" type="checkbox" id="checkbox${indexSubTask}" class="subtask" ${(subtasksArray[indexSubTask].completed == true) ? "checked" : ""}>
            <span class="custom-checkbox" onclick="toggleCheckbox(${indexSubTask}, '${task.id}')"></span>
            <label class="label-overlay-template" for="checkbox${indexSubTask}">${subtasksArray[indexSubTask].title}</label>
        </div>`
}


/**
 * Generates the HTML template for editing a task in the overlay.
 * @param {Object} task - The task object containing details to edit.
 * @returns {string} The HTML string for rendering the edit task overlay.
 */
function getEditOverlayTemplate(task) {
    let today = new Date().toISOString().split('T')[0];
    return `
        <div onclick="bubblingProtection(event); closeDropdown();" id="overlay-edit-task-board" class="overlay-edit-task-board ctn-task no-hover d-flex-x">
            <div class="ctn-close d-flex-y">
                <img onclick="closeEditTaskOverlay()" class="btn-close-detail-task"
                    src="../assets/img/close.svg" alt="Image Close">
            </div>
            <div class="ctn-main-edit-task d-flex-y">
                <form class="d-flex-x" autocomplete="off" return false;">
                    <div class="d-flex-x column gap-8">
                        <label for="title-edit">Title</label>
                        <input type="text" id="title-edit" name="title-edit" value="${task.title}" oninput="checkInputs()">
                        <div id="error-title" class="error error-title d-none">This field ist required</div>
                    </div>
                    <div class="d-flex-x column gap-8">
                        <label for="description-edit">Description</label>
                        <textarea id="description-edit" name="description" rows="5">${task.description}</textarea>
                    </div>
                    <div class="d-flex-x column gap-8">
                        <label for="due-date-edit">Due date</label>
                        <input type="date" id="due-date-edit" placeholder="dd/mm/yyy" value="${task.dueDate}" min="${today}" name="due-date-edit" oninput="checkInputs()">
                        <div id="error-due-date" class="error error-title d-none">The due date cannot be in the past.</div>
                    </div>
                    <div class="d-flex-x column gap-8">
                        <span class="label-prio">Prio</span>
                        <div class="d-flex-y prio-group">
                            <button onclick="changePrio('Urgent')" id="btn-urgent" type="button" class="prio d-flex ${task.priority === 'Urgent' ? 'urgent-active' : ''}">Urgent
                                <img src="${task.priority === 'Urgent' ? '../assets/img/urgentwhitesym.png' : '../assets/img/urgentsym.png'}"  alt="">
                            </button>
                            <button onclick="changePrio('Medium')" id="btn-medium" type="button" class="prio d-flex ${task.priority === 'Medium' ? 'medium-active' : ''}">Medium
                                <img src="${task.priority === 'Medium' ? '../assets/img/mediumwhitesym.png' : '../assets/img/mediumsym.png'}" alt="">
                            </button>
                            <button onclick="changePrio('Low')" id="btn-low" type="button" class="prio d-flex ${task.priority === 'Low' ? 'low-active' : ''}">Low
                                <img src="${task.priority === 'Low' ? '../assets/img/lowwhitesym.png' : '../assets/img/lowsym.png'}" alt="">
                            </button>
                        </div>
                    </div>
                    <div class="d-flex-x column gap-8">
                        <label for="input-assigned-edit">Assigned to</label>
                        <input type="text" id="input-assigned-edit" class="input-assigned-edit" onkeyup="searchContact()" onclick="toggleDropdown(); event.stopPropagation();" name="assigned-edit" placeholder="Select contacts to assign"></input>
                        <div class="dropdown-contacts" id="dropdown-contacts" onclick="event.stopPropagation();">
                            ${renderAllContactsInAssignedTo(task.id)}
                        </div>
                        <div id="assigned-content" class="assigned-content d-flex-y gap-8">
                        </div>
                    </div>

                    <div class="d-flex-x column gap-8">
                         <label for="subtasks-edit">Subtasks</label>
                        <div class="subtask-connect">
                            <input type="text" id="subtasks-edit" onclick="inputStart()" autocomplete="off" name="subtasks" onkeydown="handleKeyDown(event); inputStart()" placeholder="Add new subtask">
                            <div id="ctn-add-subtask" class="ctn-add-subtask d-flex" onclick="inputStart()">
                                <img class="add-subtask d-flex" src="../assets/img/plusicon.png" alt="Input Subtask">
                            </div>
                            <div id="ctn-clear-add-subtask" class="ctn-clear-add-subtask d-flex-x d-none">
                                <div class="ctn-clear-input-subtask d-flex" onclick="clearInputSubtask()">
                                    <img class="clear-input-subtask d-flex" src="../assets/img/close.svg" alt="Clear Input">
                                </div>
                                <span class="horizonal-line-subtask"></span>
                                <div onclick="addSubtask()" class="ctn-add-input-subtask d-flex">
                                    <img class="add-input-subtask d-flex" src="../assets/img/check.png" alt="Add Subtask">
                                </div>
                            </div>
                        </div>

                        <div id="ctn-edit-all-subtasks" class="ctn-edit-all-subtasks">
                            ${renderAllSubtasks(task.id)}
                        </div>
                    </div>
                </form>
            </div>
            <div class="edit-task-footer d-flex-y">
                <div class="d-flex">
                    <button id="btn-update-task" type="submit" class="d-flex-y" onclick="updateTask('${task.id}')">
                        <span>Ok</span>
                        <img class="img-check" src="../assets/img/check-white.svg" alt="">
                    </button>
                </div>
            </div>
        </div>      
       `;
}


/**
 * Generates the HTML template for a list of subtasks in edit mode.
 * @param {number} iSubtasks - The index of the subtask in the list.
 * @param {string} title - The title of the subtask.
 * @returns {string} The HTML string for rendering a subtask in edit mode.
 */
function getAllSubtasksTemplate(iSubtasks, title) {
    return `                     
        <ul id="edit-mode-subtask${iSubtasks}" class="">
            <li id="subtask-item-edit${iSubtasks}" ondblclick="editSubtask(${iSubtasks})" class="subtask-item-edit d-flex-y">
                <input id="input-subtask-edit${iSubtasks}" class="input-subtask-edit" type="text" value="&bull; ${title}" disabled onkeydown="handleKeyDownEditSubtask(event, ${iSubtasks})">
                <div id="subtask-icons-display-mode${iSubtasks}" class="subtask-icons d-flex-x">
                    <img id="edit-subtask${iSubtasks}" class="img-edit-subtask" onclick="editSubtask(${iSubtasks})" src="../assets/img/pencilBlue.png" alt="Edit Subtask">
                    <span class="horizonal-line-subtask horizontal-line-hover"></span>
                    <img id="delete-subtask${iSubtasks}" class="img-delete-subtask" onclick="deleteSubtask(${iSubtasks})" src="../assets/img/dustbinDark.svg" alt="Delete Subtask">
                </div>
                <div id="subtask-icons-editing-mode${iSubtasks}" class="subtask-icons d-flex-x d-none">
                    <img id="delete-edit-subtask${iSubtasks}" onclick="deleteSubtask(${iSubtasks})" class="img-delete-subtask" src="../assets/img/dustbinDark.svg" alt="Edit Subtask">
                    <span class="horizonal-line-subtask horizontal-line-hover"></span>
                    <img id="save-subtask${iSubtasks}" onclick="saveSubtask(${iSubtasks})" class="img-save-edit-subtask" src="../assets/img/check.png" alt="Delete Subtask">
                </div>
            </li>
        </ul>`
}


/**
 * Generates the HTML template for displaying a message when there are no subtasks.
 * @returns {string} The HTML string indicating no subtasks in the task.
 */
function getNoSubtaskInTaskTemplate() {
    return `
            <ul id="no-subtask-edit">
                <li class="subtask-item-edit d-flex-y">
                    <input id="input-subtask-edit" class="input-subtask-edit" type="text" value="No subtasks in this task!" disabled>
                </li>
            </ul>`
}


/**
 * Generates the HTML template for an assigned contact in the edit overlay.
 * @param {string} initial - The initial of the contact.
 * @param {string} color - The background color for the contact display.
 * @param {string} name - The name of the contact.
 * @param {number} iContact - The index of the contact.
 * @param {boolean} isChecked - Indicates whether the contact is checked.
 * @returns {string} The HTML string for rendering the assigned contact in the overlay.
 */
function getAssignedToEditTemplateOverlay(initial, color, name, contactIdSelected, isChecked) {
    return `
        <div class="contact d-flex-y ${isChecked}" id="contact${contactIdSelected}" onclick="toggleCheckboxContact('${contactIdSelected}')">
            <div class="contact-left d-flex-y">
                <div class="assigned-to d-flex" style="background-color:${color};">${initial}</div>
                <label for="checkboxContact${contactIdSelected}">${name}</label>
            </div >
            <div class="contact-right">
                <input type="checkbox" id="checkboxContact${contactIdSelected}" name="checkboxContact${contactIdSelected}" class="checkbox-contact"
                 ${isChecked ? 'checked' : ''} >
                <span class="custom-checkbox-edit"></span>
            </div>
        </div> `;
}

