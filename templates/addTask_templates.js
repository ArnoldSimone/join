function generateCreateOption(name, initial, color, index) {
  return `
      <div class="assigned-content">
          <div class="assigned-user">
              <div class="assigned-initital d-flex" style="background-color: ${color};">
                  <p>${initial}</p>
              </div>
              <p>${name}</p>
          </div>
          <input onclick="selectionUser(${index})"  type="checkbox">
      </div>
  `;
}


function generateSearchHTML(name, initial, color, index) {
    return `
        <div class="assigned-content">
            <div class="assigned-user">
                <div class="assigned-initital d-flex" style="background-color: ${color};">
                    <p>${initial}</p>
                </div>
                <p>${name}</p>
            </div>
            <input onclick="selectionUser(${index})" type="checkbox">
        </div>
    `;
}


function generateSelectedUsersHTML(initial, color) {
    return `
        <div class="assigned-initital d-flex" style="background-color: ${color};">
            <p>${initial}</p>
        </div>
    `;
}