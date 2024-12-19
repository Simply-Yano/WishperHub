// Open the popup
function openPopup() {
    const popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.classList.remove('hidden');
}
function closePopup(){
    const popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.classList.add('hidden');
}

// Open the comment box for a specific note
function openCommentBox(noteId) {
    const commentButton = document.querySelector(`#commentBtn-${noteId}`);
    commentButton.style.display = 'none'; // Hide the comment button

    const commentBoxPopup = document.querySelector(`#commentBox-${noteId}`);
    commentBoxPopup.classList.remove('hidden');
}

// Close the comment box for a specific note
function closeCommentBox(noteId) {
    const commentButton = document.querySelector(`#commentBtn-${noteId}`);
    commentButton.style.display = 'block'; // Show the comment button again

    const commentBoxPopup = document.querySelector(`#commentBox-${noteId}`);
    commentBoxPopup.classList.add('hidden');
}

// Add note functionality with word limit validation
function addNote() {
    const noteInput = document.getElementById('popupInput');
    const userName = document.getElementById('userName').value.trim();
    const noteContent = noteInput.value.trim();

    // Calculate the word count
    const wordCount = noteContent.split(/\s+/).filter(word => word).length;

    if (wordCount > 100) {
        alert("Your note exceeds the 100-word limit. Please shorten it before adding.");
        return;
    }

    if (!noteContent) {
        alert("Note content cannot be empty.");
        return;
    }

    if (!userName) {
        alert("Please provide your name.");
        return;
    }

    // Create a unique ID for the note
    const noteId = `note-${Date.now()}`;

    // Create a new note dynamically
    const notesContainer = document.getElementById('notesContainer');
    const newNote = document.createElement('div');
    newNote.className = 'note';
    newNote.innerHTML = `
        <div class="note-title">${noteContent}</div>
        <div class="note-date">by: ${userName}  ${new Date().toLocaleDateString()}</div><hr>
        <button id="commentBtn-${noteId}" class="comment" onclick="openCommentBox('${noteId}')">Comment</button>
        <div id="commentBox-${noteId}" class="commentBox hidden">
            <div id="commentsContainer-${noteId}" class="comments-container"></div>
            <input class="commentinput" type="text" id="commentInput-${noteId}" placeholder="Write a comment...">
            <div class="cmtButtonCullection">
                <button class="cmtclosebutton" onclick="addComment('${noteId}')">Post</button>
                <button class="cmtclosebutton" onclick="closeCommentBox('${noteId}')">Close</button>
            </div>
        </div>
    `;
    notesContainer.appendChild(newNote);

    // Clear the popup input and hide it
    noteInput.value = '';
    closePopup();
}

// Add a comment to a specific note
function addComment(noteId) {
    const commentInput = document.getElementById(`commentInput-${noteId}`);
    const commentContent = commentInput.value.trim();

    if (!commentContent) {
        alert("Comment cannot be empty.");
        return;
    }

    const commentsContainer = document.getElementById(`commentsContainer-${noteId}`);
    const newComment = document.createElement('div');
    newComment.className = 'comment';
    newComment.textContent = commentContent;
    commentsContainer.appendChild(newComment);

    // Clear the comment input field
    commentInput.value = '';
}

// Update word count dynamically
function updateWordCount() {
    const noteInput = document.getElementById('popupInput');
    const wordCount = noteInput.value.trim().split(/\s+/).filter(word => word).length;
    const wordCountDisplay = document.getElementById('wordCount');
    wordCountDisplay.textContent = `${wordCount}/100`;

    // Disable the Add Note button if word count exceeds 100
    const addButton = document.querySelector('.popup button:first-child');
    addButton.disabled = wordCount > 100;
    addButton.style.backgroundColor = wordCount > 100 ? '#ccc' : '#007BFF';
}

// Initialize event listeners
function initializeEventListeners() {
    const noteInput = document.getElementById('popupInput');
    noteInput.addEventListener('input', updateWordCount);

    const addButton = document.querySelector('.popup button:first-child');
    addButton.addEventListener('click', addNote);

    const closeButtons = document.querySelectorAll('.close-popup');
    closeButtons.forEach(button => button.addEventListener('click', closePopup));
}
// Run initialization on page load
document.addEventListener('DOMContentLoaded', initializeEventListeners);
