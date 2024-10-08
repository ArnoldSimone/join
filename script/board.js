let currentDraggedElement;
let tasks;
let contacts;
let foundContacts = [];
let selectedContacts = [];

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

function renderAssignedTo(assignedTo) {
    let assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    if (!assignedToArray || assignedToArray.length === 0 || assignedToArray == '') {
        return '';
    } else {
        let assignedToContent = "";
        for (let i = 0; i < assignedToArray.length; i++) {
            let contact = contacts.find(c => c.name === assignedToArray[i]);
            let initial = contact.avatar.initials;
            let color = contact.avatar.color;
            assignedToContent += getAssignedToTemplate(initial, color);
        }
        return assignedToContent;
    }
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
    if (!subtasksArray || subtasksArray.length === 0 || subtasksArray === "") {
        return 'No subtasks in this task!';
    } else {
        let ctnSubtasks = "";
        for (let indexSubTask = 0; indexSubTask < subtasksArray.length; indexSubTask++) {
            ctnSubtasks += getSubtasksOverlayTemplate(indexSubTask, task);
        }
        return ctnSubtasks;
    }
}

function renderAssignedToOverlay(assignedTo) {
    let assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    if (!assignedToArray || assignedToArray.length === 0 || assignedToArray == '') {
        return '';
    } else {
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


let currentlyAssignedContacts = [];



function showEditTaskOverlay(taskId) {
    document.getElementById('overlay-board-detail').classList.add('d-none');
    let overlayBoardEditRef = document.getElementById('overlay-board-edit');
    overlayBoardEditRef.classList.remove('d-none');
    overlayBoardEditRef.innerHTML = "";
    let task = tasks.find(t => t.id === taskId);
    console.log(task);
    //rendert Overlay
    overlayBoardEditRef.innerHTML = getEditOverlayTemplate(task);
    updateAssignedContacts();
}

//rendert alle existierenden Kontakte in das Dropdown
function renderAllContactsInAssignedTo(taskId) {
    let task = tasks.find(t => t.id === taskId);
    let allContacts = "";
    let assignedContacts = task.assignedTo;
    for (let iContact = 0; iContact < contacts.length; iContact++) {
        let name = contacts[iContact].name;
        let initial = contacts[iContact].avatar.initials;
        let color = contacts[iContact].avatar.color;

        let isChecked = assignedContacts.includes(contacts[iContact].name) ? 'checked' : '';
        allContacts += getAssignedToEditTemplateOverlay(initial, color, name, task, iContact, isChecked);
    }
    return allContacts;
}

function toggleCheckboxContact(iContact) {
    let checkbox = document.getElementById(`checkboxContact${iContact}`);
    checkbox.checked = !checkbox.checked;

    let contactRef = document.getElementById(`contact${iContact}`);
    if (checkbox.checked) {
        contactRef.classList.add('checked');
    } else {
        contactRef.classList.remove('checked');
    }
    updateAssignedContacts();
}


function updateAssignedContacts() {
    let assignedContentRef = document.getElementById('assigned-content');
    assignedContentRef.innerHTML = '';
    let checkboxes = document.querySelectorAll('.checkbox-contact');
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            let initial = contacts[index].avatar.initials;
            let color = contacts[index].avatar.color;
            assignedContentRef.innerHTML += `<div class="assigned-to d-flex" style="background-color:${color};">${initial}</div>`;
        }
    });
}

function toggleDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.toggle("show");
}

function closeDropdown() {
    let dropdown = document.getElementById("dropdown-contacts");
    dropdown.classList.remove("show");
}




function changePrio(selectedPrio) {
    toggleDropdown
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


