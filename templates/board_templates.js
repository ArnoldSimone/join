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
                ${renderAssignedTo(task)}
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
            <p class="label">Assigned To:</p>
            <div class="ctn-assigned-to-detail d-flex-x">
                ${renderAssignedToOverlay(task)}
            </div>
            <p class="label">Subtasks:</p>
            <div class="ctn-subtasks d-flex-x">
                ${renderSubtasksOverlay(task)}
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


function getAssignedToEditTemplateOverlay(initial, color, name, task, iContact) {
    return `
        <div class="all-contacts d-flex-y" onclick="toggleCheckboxContact(${iContact})">
            <div class="contact-left d-flex-y">
                <div class="assigned-to d-flex" style="background-color:${color};">${initial}</div>
                <label for=""checkboxContact${iContact}">${name}</label>
            </div >
            <div class="contact-right">
                <input type="checkbox" autocomplete="off" id="checkboxContact${iContact}" class="checkbox-contact" 
                    ${checkContactIsAssignedTo(name, task)} onchange="updateAssignedContacts()">
                <span class="custom-checkbox"></span>
            </div>
        </div> `;
}