function closeDetailTaskOverlay() {
    document.getElementById('overlay-board').classList.add('d-none');
    document.getElementById('overlay-detail-task-board').classList.add('d-none');
}

function showDetailTaskOverlay() {
    document.getElementById('overlay-board').classList.remove('d-none');
    document.getElementById('overlay-detail-task-board').classList.remove('d-none');
}

function bubblingProtection(event) {
    event.stopPropagation();
}