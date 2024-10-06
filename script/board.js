let currentDraggedElement;
let tasks;
let contacts;

async function onloadFuncBoard() {
    let tasksData = await loadFromDatabase(`/tasks`);
    tasks = Object.entries(tasksData).map(([id, task]) => ({ id, ...task }));
    let contactsData = await loadFromDatabase(`/contacts`);
    contacts = Object.entries(contactsData).map(([id, contact]) => ({ id, ...contact }));
    renderTasksBoard();
}

function renderTasksBoard() {
    renderTasksByProgress('todo', 'ctn-tasks-todo', 'No tasks To do')
    renderTasksByProgress('in progress', 'ctn-tasks-in-progress', 'No tasks In Progress')
    renderTasksByProgress('await feedback', 'ctn-tasks-await-feedback', 'No tasks Awaiting Feedback')
    renderTasksByProgress('done', 'ctn-tasks-done', 'No tasks Done')
}

function renderTasksByProgress(progressStatus, containerId, noTaskMessage) {
    let containerRef = document.getElementById(containerId);
    containerRef.innerHTML = "";
    let filteredTasks = tasks.filter(task => task.progress === progressStatus);
    if (filteredTasks.length === 0) {
        containerRef.innerHTML = getBoardNoTaskTemplate(noTaskMessage);
    } else {
        for (let i = 0; i < filteredTasks.length; i++) {
            containerRef.innerHTML += getBoardTaskTemplate(filteredTasks[i]);
        }
    }
}

function startDragging(taskId) {
    currentDraggedElement = taskId;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(progress) {
    let task = tasks.find(t => t.id === currentDraggedElement);
    task.progress = progress;
    updateOnDatabase(`tasks/${currentDraggedElement}`, task)
    renderTasksBoard();
    removeAllHighlight();
}

function removeAllHighlight() {
    removeHighlight('highlight-todo');
    removeHighlight('highlight-in-progress');
    removeHighlight('highlight-await-feedback');
    removeHighlight('highlight-done');
}

function highlight(containerId) {
    document.getElementById(containerId).classList.add('drag-area-highlight');
}

function removeHighlight(containerId) {
    document.getElementById(containerId).classList.remove('drag-area-highlight');
}

function renderAssignedTo(task) {
    let assignedToArray = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo];
    let assignedToContent = "";
    for (let i = 0; i < assignedToArray.length; i++) {
        let contact = contacts.find(c => c.name === assignedToArray[i]);
        let initial = contact.avatar.initials;
        let color = contact.avatar.color;
        assignedToContent += getAssignedToTemplate(initial, color);
    }
    return assignedToContent;
}

function renderTaskProgressBar(subtasks) {
    if (!subtasks || subtasks.length === 0) {
        return '';
    } else {
        let totalSubtasks = subtasks.length;
        let completedSubtasks = subtasks.filter(subtask => subtask.completed == true).length;
        let progressBar = getTaskProgressBarTemplate(totalSubtasks, completedSubtasks);
        return progressBar;
    }
}

function closeDetailTaskOverlay() {
    document.body.style.overflow = '';
    let overlayBoardDetailRef = document.getElementById('overlay-board-detail');
    let overlayBoardEditRef = document.getElementById('overlay-board-edit');
    overlayBoardDetailRef.classList.add('slide-out')
    overlayBoardEditRef.classList.add('slide-out')
    setTimeout(() => {
        overlayBoardDetailRef.classList.add('d-none');
        overlayBoardDetailRef.classList.remove('slide-out');
        overlayBoardEditRef.classList.add('d-none');
        overlayBoardEditRef.classList.remove('slide-out');
    }, 200);
}

function bubblingProtection(event) {
    event.stopPropagation();
}

function showDetailTaskOverlay(taskId) {
    document.body.style.overflow = 'hidden';
    let overlayBoardRef = document.getElementById('overlay-board-detail');
    overlayBoardRef.classList.remove('d-none');
    overlayBoardRef.classList.add('slide-in');
    setTimeout(() => {
        overlayBoardRef.classList.remove('slide-in');
    }, 200);
    overlayBoardRef.innerHTML = "";
    let task = tasks.find(t => t.id === taskId);
    overlayBoardRef.innerHTML = getTaskOverlayTemplate(task);
}

function renderSubtasksOverlay(task) {
    let subtasksArray = task.subtasks;
    if (!subtasksArray || subtasksArray.length === 0) {
        return 'No subtasks in this task!';
    } else {
        let ctnSubtasks = "";
        for (let indexSubTask = 0; indexSubTask < subtasksArray.length; indexSubTask++) {
            ctnSubtasks += getSubtasksOverlayTemplate(indexSubTask, task);
        }
        return ctnSubtasks;
    }
}

function renderAssignedToOverlay(task) {
    let assignedToArray = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo];
    let assignedToContent = "";
    for (let i = 0; i < assignedToArray.length; i++) {
        let contact = contacts.find(c => c.name === assignedToArray[i]);
        let initial = contact.avatar.initials;
        let color = contact.avatar.color;
        let name = assignedToArray[i];
        assignedToContent += getAssignedToTemplateOverlay(initial, color, name);
    }
    return assignedToContent;
}

function formatDate(dateString) {
    let [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function updateSubtaskStatus(indexSubTask, taskId) {
    let task = tasks.find(t => t.id === taskId);
    let subtasksArray = task.subtasks;
    subtasksArray[indexSubTask].completed = !subtasksArray[indexSubTask].completed;
    updateOnDatabase(`tasks/${taskId}`, task);
    renderTasksBoard();
}

function toggleCheckbox(indexSubTask, taskId) {
    const checkbox = document.getElementById(`checkbox${indexSubTask}`);
    checkbox.checked = !checkbox.checked;
    updateSubtaskStatus(indexSubTask, taskId);
}

function showEditTaskOverlay(taskId) {
    document.getElementById('overlay-board-detail').classList.add('d-none');
    let overlayBoardEditRef = document.getElementById('overlay-board-edit');
    overlayBoardEditRef.classList.remove('d-none');
    overlayBoardEditRef.innerHTML = "";
    let task = tasks.find(t => t.id === taskId);
    console.log(task);
    overlayBoardEditRef.innerHTML = getEditOverlayTemplate(task);
    updateAssignedContacts();
}

function getEditOverlayTemplate(task) {
    return `
        <div onclick="bubblingProtection(event)" id="overlay-edit-task-board" class="overlay-edit-task-board ctn-task no-hover d-flex-x">

            <div class="ctn-close d-flex-y">
                <img onclick="closeDetailTaskOverlay()" class="btn-close-detail-task"
                    src="../assets/img/close.svg" alt="Image Close">
            </div>

            <div class="ctn-main-edit-task d-flex-y">
                <form class="d-flex-x">
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
                        <input type="text" id="input-assigned-edit" class="" onclick="toggleDropdown()" name="assigned" placeholder="Select contacts to assign"></input>
                        <div class="dropdown-contacts" id="dropdown-contacts">
                            ${renderAllContactsInAssignedTo(task)}
                        </div>
                        <div id="assigned-content" class="assigned-content d-flex-y gap-8"></div>
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
       `
}

function renderAllContactsInAssignedTo(task) {
    let allContacts = "";
    for (let iContact = 0; iContact < contacts.length; iContact++) {
        let name = contacts[iContact].name;
        let initial = contacts[iContact].avatar.initials;
        let color = contacts[iContact].avatar.color;
        allContacts += getAssignedToEditTemplateOverlay(initial, color, name, task, iContact);
    }
    return allContacts;
}

function checkContactIsAssignedTo(name, task) {
    let assignedToArray = Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo];
    for (let iName = 0; iName < assignedToArray.length; iName++) {
        if (assignedToArray[iName] == name) {
            return 'checked';
        }
    }
    return '';
}

function toggleCheckboxContact(iContact) {
    const checkbox = document.getElementById(`checkboxContact${iContact}`);
    checkbox.checked = !checkbox.checked;
    updateAssignedContacts();
}

function updateAssignedContacts() {
    let assignedContentRef = document.getElementById('assigned-content');
    assignedContentRef.innerHTML = '';
    let checkboxes = document.querySelectorAll('.checkbox-contact');
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const initial = contacts[index].avatar.initials;
            const color = contacts[index].avatar.color;
            assignedContentRef.innerHTML += `<div class="assigned-to d-flex" style="background-color:${color};">${initial}</div>`;
        }
    });
}



function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.toggle("show");
}

function changePrio(selectedPrio) {
    let btnUrgentRef = document.getElementById('btn-urgent');
    let btnMediumRef = document.getElementById('btn-medium');
    let btnLowRef = document.getElementById('btn-low');
    removeAllActivButtons(btnUrgentRef, btnMediumRef, btnLowRef);
    if (selectedPrio === 'Urgent') {
        changePrioUrgent(btnUrgentRef, btnMediumRef, btnLowRef);
    } else if (selectedPrio === 'Medium') {
        changePrioMedium(btnUrgentRef, btnMediumRef, btnLowRef)
    } else if (selectedPrio === 'Low') {
        changePrioLow(btnUrgentRef, btnMediumRef, btnLowRef);
    }
}

function changePrioUrgent(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnUrgentRef.classList.add('urgent-active');
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentwhitesym.png';
    btnMediumRef.querySelector('img').src = '../assets/img/mediumsym.png';
    btnLowRef.querySelector('img').src = '../assets/img/lowsym.png';
}

function changePrioMedium(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnMediumRef.classList.add('medium-active');
    btnMediumRef.querySelector('img').src = '../assets/img/mediumwhitesym.png';
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentsym.png';
    btnLowRef.querySelector('img').src = '../assets/img/lowsym.png';
}

function changePrioLow(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnLowRef.classList.add('low-active');
    btnLowRef.querySelector('img').src = '../assets/img/lowwhitesym.png';
    btnUrgentRef.querySelector('img').src = '../assets/img/urgentsym.png';
    btnMediumRef.querySelector('img').src = '../assets/img/mediumsym.png';
}

function removeAllActivButtons(btnUrgentRef, btnMediumRef, btnLowRef) {
    btnUrgentRef.classList.remove('urgent-active');
    btnMediumRef.classList.remove('medium-active');
    btnLowRef.classList.remove('low-active');
}

