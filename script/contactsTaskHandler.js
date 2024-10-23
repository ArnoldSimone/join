/**
 * Updates the contact name in all tasks where the contact is assigned.
 * @param {string} contactId - The contact ID.
 * @param {string} newName - The new name of the contact.
 */
async function updateContactNameInTasks(contactId, newName) {
    const tasksData = await fetchTasks();

    for (const taskId in tasksData) {
        const task = tasksData[taskId];
        if (task.assignedTo && Array.isArray(task.assignedTo)) {
            const assignedContact = task.assignedTo.find(contact => contact.id === contactId);
            if (assignedContact) {
                assignedContact.name = newName;
                await patchAssignedToInTask(taskId, task.assignedTo);
            }
        }
    }
}


/**
 * Patches the assignedTo array in a specific task by sending a PATCH request to update Firebase.
 * 
 * @param {string} taskId - The ID of the task to update.
 * @param {Array} assignedTo - The updated assignedTo array.
 */
async function patchAssignedToInTask(taskId, assignedTo) {
    await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
        method: 'PATCH',
        body: JSON.stringify({ assignedTo }),
        headers: { 'Content-Type': 'application/json' }
    });
}


/**
 * Removes a contact from all tasks associated with it.
 * @param {string} contactId - The ID of the contact to be removed from tasks.
 * @returns {Promise<boolean>} Returns true if the contact was removed from any task, false otherwise.
 */
async function removeContactFromTasks(contactId) {
    const contactData = await fetchContacts(contactId);
    if (!contactData) {
        return false;
    }

    const contactName = contactData.name;
    const tasksData = await fetchTasks();
    return await removeContactFromAllTasks(tasksData, contactId, contactName);
}


/**
 * Removes a contact from all tasks by updating each task's assigned contacts.
 * @param {Object} tasksData - The tasks data containing all tasks.
 * @param {string} contactId - The ID of the contact to be removed.
 * @param {string} contactName - The name of the contact to be removed.
 * @returns {Promise<boolean>} Returns true if the contact was removed from any task, false otherwise.
 */
async function removeContactFromAllTasks(tasksData, contactId, contactName) {
    let removed = false;
    
    for (const taskId in tasksData) {
        const task = tasksData[taskId];
        if (task) {
            removed = await updateTaskAssignedTo(task, contactId, contactName, taskId) || removed;
        }
    }
    
    return removed;
}


/**
 * Fetches all tasks from the database.
 * @returns {Promise<Object>} Returns an object containing all tasks if the fetch is successful, otherwise an empty object.
 */
async function fetchTasks() {
    const response = await fetch(`${BASE_URL}/tasks.json`);
    if (!response.ok) {
        return {};
    }
    return await response.json();
}


/**
 * Updates the assigned contacts for a specific task by removing the specified contact.
 * @param {Object} task - The task object to be updated.
 * @param {string} contactId - The ID of the contact to be removed from the task.
 * @param {string} contactName - The name of the contact to be removed from the task.
 * @param {string} taskId - The ID of the task being updated.
 * @returns {Promise<boolean>} Returns true if the update was successful, false otherwise.
 */
async function updateTaskAssignedTo(task, contactId, contactName, taskId) {
    if (task.assignedTo && Array.isArray(task.assignedTo)) {
        const assignedContact = task.assignedTo.find(contact => contact.id === contactId);
        if (assignedContact) {
            const updatedAssignedTo = task.assignedTo.filter(contact => contact.id !== contactId);
            const patchResponse = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
                method: 'PATCH',
                body: JSON.stringify({ assignedTo: updatedAssignedTo })
            });
            if (patchResponse.ok) {return true;} 
            else {await patchResponse.text();}
        }}
    return false;
}