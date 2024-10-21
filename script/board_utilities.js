
async function moveTaskResponsive(progressStatus, taskId) {
    let task = tasks.find(t => t.id === taskId);
    task.progress = progressStatus;
    await updateOnDatabase(`tasks/${taskId}`, task);
    renderTasksBoard();
}



function toggleMenuMoveTo(taskId) {
    document.getElementById(`menu-${taskId}`).classList.toggle('d-none');
}



function handleClickMenu(event) {
    event.stopPropagation();
}


function startDragging(taskId) {
    currentDraggedElement = taskId;
    const taskElement = document.getElementById(`task-${taskId}`);
    taskElement.style.transform = 'rotate(4deg)';
}



function allowDrop(ev) {
    ev.preventDefault();
}



async function moveTo(progress) {
    let task = tasks.find(t => t.id === currentDraggedElement);
    task.progress = progress;
    await updateOnDatabase(`tasks/${currentDraggedElement}`, task)
    renderTasksBoard();
    removeAllHighlight();
    resetDraggingState();
}



function resetDraggingState() {
    if (currentDraggedElement) {
        const taskElement = document.getElementById(`task-${currentDraggedElement}`);
        taskElement.style.transform = '';
        currentDraggedElement = null;
    }
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



function bubblingProtection(event) {
    event.stopPropagation();
}



function formatDate(dateString) {
    let [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}


async function toggleCheckbox(indexSubTask, taskId) {
    let checkbox = document.getElementById(`checkbox${indexSubTask}`);
    checkbox.checked = !checkbox.checked;
    await updateSubtaskStatus(indexSubTask, taskId);
}

