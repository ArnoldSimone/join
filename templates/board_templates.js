function getBoardNoTaskTemplate(message) {
    return `                        
    <div class="ctn-no-tasks d-flex">
        ${message}
    </div>`;
}

function getBoardTaskTemplate(task) {
    return `
    <div onclick="showDetailTaskOverlay('${task.id}')" id="task-${task.id}" class="ctn-task d-flex-x" draggable="true" ondragstart="startDragging('${task.id}')">
        ${getTaskCategoryTemplate(task.category)}
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

function getAssignedToTemplate(initial, color) {
    return `<div class="assigned-to mesh d-flex" style="background-color:${color};">${initial}</div>`
}

function getImagePrioTemplate(priority) {
    const priortyImages = {
        'Low': '../assets/img/lowsym.png',
        'Medium': '../assets/img/mediumsym.png',
        'Urgent': '../assets/img/urgentsym.png'
    }
    return `<img class="image-prio-board" src="${priortyImages[priority]}" alt="">`
}

function getTaskProgressBarTemplate(totalSubtasks, completedSubtasks) {
    return `        
            <div class="task-subtasks d-flex-y">
                <progress max="${totalSubtasks}" value="${completedSubtasks}"></progress>
                <span class="subtasks-count">${completedSubtasks}/${totalSubtasks} Subtasks</span>
            </div>`;
}

function getTaskCategoryTemplate(category) {
    return `<p id="task-category" class="task-category ${category == 'User Story' ? 'bg-user-story' : 'bg-technical-task'}">${category}</p>`
}

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
            <img class="btn-delete-task" src="../assets/img/dustbinDarkText.svg" alt="Image Delete">
                <span class="vertikalLine"></span>
                <img onclick="showEditTaskOverlay('${task.id}')" class="btn-edit-task" src="../assets/img/editDarkText.svg" alt="Image Close">
                </div>
        </div>`
}

function getAssignedToTemplateOverlay(initial, color, name) {
    return `     
        <div class="person-detail d-flex-y">
            <div class="assigned-to d-flex" style="background-color:${color};">${initial}</div>
            <p>${name}</p>
        </div>`
}

function getSubtasksOverlayTemplate(indexSubTask, task) {
    let subtasksArray = task.subtasks;
    return `
        <div class="subtask-item d-flex-y">
            <input onchange="updateSubtaskStatus(${indexSubTask}, '${task.id}')" type="checkbox" id="checkbox${indexSubTask}" class="subtask" ${(subtasksArray[indexSubTask].completed == true) ? "checked" : ""}>
            <span class="custom-checkbox" onclick="toggleCheckbox(${indexSubTask}, '${task.id}')"></span>
            <label for="checkbox${indexSubTask}">${subtasksArray[indexSubTask].title}</label>
        </div>`
}


function getEditOverlayTemplate(task) {
    return `
        <div onclick="bubblingProtection(event); closeDropdown();" id="overlay-edit-task-board" class="overlay-edit-task-board ctn-task no-hover d-flex-x">
            <div class="ctn-close d-flex-y">
                <img onclick="closeDetailTaskOverlay()" class="btn-close-detail-task"
                    src="../assets/img/close.svg" alt="Image Close">
            </div>
            <div class="ctn-main-edit-task d-flex-y">
                <form class="d-flex-x" autocomplete="off">
                    <div class="d-flex-x column gap-8">
                        <label for="title-edit">Title<span class="required">*</span></label>
                        <input type="text" id="title-edit" name="title" value="${task.title}">
                    </div>
                    <div class="d-flex-x column gap-8">
                        <label for="description-edit">Description</label>
                        <textarea id="description-edit" name="description">${task.description}</textarea>
                    </div>
                    <div class="d-flex-x column gap-8">
                        <label for="due-date-edit">Due date</label>
                        <input type="date" id="due-date-edit" placeholder="dd/mm/yyy" value="${task.dueDate}" name="due-date">
                    </div>
                    <div class="d-flex-x column gap-8">
                        <label class="label-prio">Prio</label>
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
                        <label for="assigned-edit">Assigned to</label>
                        <input type="text" id="input-assigned-edit" class="input-assigned-edit" onkeyup="searchContact('${task.id}')" onclick="toggleDropdown(); event.stopPropagation();" name="assigned" placeholder="Select contacts to assign"></input>
                        <div class="dropdown-contacts" id="dropdown-contacts" onclick="event.stopPropagation();">
                            ${renderAllContactsInAssignedTo(task.id)}
                        </div>
                        <div id="assigned-content" class="assigned-content d-flex-y gap-8">
                        </div>
                    </div>

                    <div class="d-flex-x column gap-8">
                        <label for="subtasks-edit">Subtasks</label>
                        <div class="subtask-connect">
                            <input type="text" id="subtasks-edit" name="subtasks" placeholder="Add new subtask">
                            <div class="subtask-img">
                                <img src="../assets/img/plusicon.png" alt="">
                            </div>
                        </div>
                    </div>

                </form>
            </div>

            <div class="edit-task-footer d-flex-y">
                <div class="form-actions d-flex">
                    <button type="submit" class="btn-ok d-flex-y">
                        <span>Ok</span>
                        <img class="img-check" src="../assets/img/check-white.svg" alt="">
                    </button>
                </div>
            </div>
        </div>
       `;
}


function getAssignedToEditTemplateOverlay(initial, color, name, task, iContact, isChecked) {
    return `
        <div class="contact d-flex-y ${isChecked}" id="contact${iContact}" onclick="toggleCheckboxContact(${iContact})">
            <div class="contact-left d-flex-y">
                <div class="assigned-to d-flex" style="background-color:${color};">${initial}</div>
                <label for=""checkboxContact${iContact}">${name}</label>
            </div >
            <div class="contact-right">
                <input type="checkbox" id="checkboxContact${iContact}" class="checkbox-contact"
                 ${isChecked} onchange="updateAssignedContacts()">
                <span class="custom-checkbox-edit"></span>
            </div>
        </div> `;
}