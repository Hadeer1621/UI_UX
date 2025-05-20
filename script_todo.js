// TaskManager object using object literal notation
var taskManager = {
    // Properties to store DOM references
    taskInput: document.getElementById('taskInput'), // Input field for task text
    taskDate: document.getElementById('taskDate'),   // Input field for task date
    taskTime: document.getElementById('taskTime'),   // Input field for task time
    taskList: document.getElementById('taskList'),   // UL element to hold task list items

    // Method to initialize event listeners
    init: function () {
        // Add Enter key listener to the task input field
        this.taskInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                taskManager.addTask(); // Trigger task addition when Enter is pressed
            }
        });
    },

    // Method to add a new task with optional date and time
    addTask: function () {
        var taskText = this.taskInput.value.trim(); // Get and trim task text
        var taskDate = this.taskDate.value;         // Get task date value
        var taskTime = this.taskTime.value;         // Get task time value

        if (taskText !== '') {                     // Ensure task text is not empty
            // Create task elements
            var li = document.createElement('li');         // New list item for the task
            var taskItem = document.createElement('div');  // Div to contain task elements
            taskItem.className = 'task-item';              // Assign class for styling

            // Create checkbox for marking task as complete
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';                    // Set as checkbox type
            checkbox.onclick = function () {               // Toggle completion on click
                taskManager.toggleComplete(taskItem);
            };

            // Create task text span with specific class
            var taskSpan = document.createElement('span');
            taskSpan.className = 'task-text';              // Add class to identify task text
            taskSpan.textContent = taskText;               // Set task text content

            // Create datetime display if date or time is provided
            if (taskDate || taskTime) {
                var datetimeDisplay = document.createElement('span'); // Span for date/time
                datetimeDisplay.className = 'datetime-display';       // Add class for styling
                datetimeDisplay.textContent = 'Due: ';                // Start with "Due: " prefix

                // Get current date and tomorrow for comparison
                var today = new Date();
                var tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);

                // Convert taskDate to Date object if provided
                var taskDateObj = taskDate ? new Date(taskDate) : null;

                // Display "Today" or "Tomorrow" if date matches, otherwise use raw date
                if (taskDateObj) {
                    var isToday = taskDateObj.toDateString() === today.toDateString();
                    var isTomorrow = taskDateObj.toDateString() === tomorrow.toDateString();
                    
                    if (isToday) {
                        datetimeDisplay.textContent += 'Today ';     // Show "Today" for current date
                    } else if (isTomorrow) {
                        datetimeDisplay.textContent += 'Tomorrow ';  // Show "Tomorrow" for next day
                    } else {
                        datetimeDisplay.textContent += taskDate + ' '; // Use raw date format otherwise
                    }
                }
                if (taskTime) {
                    datetimeDisplay.textContent += taskTime;         // Append time if provided
                }
                taskItem.appendChild(datetimeDisplay);               // Add datetime to task item
            }

            // Create edit button
            var editIcon = document.createElement('button');
            editIcon.className = 'edit-icon';               // Add class for styling
            editIcon.innerHTML = '✏️';                      // Use pencil emoji for edit
            editIcon.onclick = function () {                // Trigger edit on click
                taskManager.editTask(taskSpan, li);
            };

            // Create delete button
            var deleteIcon = document.createElement('button');
            deleteIcon.className = 'delete-icon';           // Add class for styling
            deleteIcon.innerHTML = '🗑️';                   // Use trash can emoji
            deleteIcon.onclick = function () {              // Remove task on click
                taskManager.deleteTask(li);
            };

            // Assemble task structure
            taskItem.appendChild(checkbox);    // Add checkbox to task item
            taskItem.appendChild(taskSpan);    // Add task text to task item
            li.appendChild(taskItem);          // Add task item to list item
            li.appendChild(editIcon);          // Add edit button to list item
            li.appendChild(deleteIcon);        // Add delete button to list item

            // Add to list and clear inputs
            this.taskList.appendChild(li);     // Append completed task to the list
            this.taskInput.value = '';         // Clear task text input
            this.taskDate.value = '';          // Clear date input
            this.taskTime.value = '';          // Clear time input
        }
    },

    // Method to toggle task completion
    toggleComplete: function (taskItem) {
        var taskSpan = taskItem.querySelector('.task-text'); // Select span with 'task-text' class
        taskSpan.classList.toggle('Completed');              // Toggle completion style
    },

    // Method to edit a task
    editTask: function (taskSpan, li) {
        var currentText = taskSpan.textContent;             // Get current task text
        var input = document.createElement('input');        // Create input field for editing
        input.type = 'text';                                // Set input type to text
        input.value = currentText;                          // Pre-fill with current text
        input.className = 'edit-input';                     // Add class for styling

        // Replace task span with input field
        taskSpan.style.display = 'none';                    // Hide original text
        taskItem = li.querySelector('.task-item');          // Get task item div
        taskItem.insertBefore(input, taskSpan.nextSibling); // Insert input after checkbox

        // Focus on input and handle save
        input.focus();
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {                        // Save on Enter key
                taskManager.saveEdit(taskSpan, input, li);
            }
        });
        input.addEventListener('blur', function () {        // Save when input loses focus
            taskManager.saveEdit(taskSpan, input, li);
        });
    },

    // Method to save edited task
    saveEdit: function (taskSpan, input, li) {
        var newText = input.value.trim();                   // Get and trim new text
        if (newText !== '') {                               // Ensure new text is not empty
            taskSpan.textContent = newText;                 // Update task text
        }
        taskSpan.style.display = '';                        // Show task text again
        input.remove();                                     // Remove input field
    },

    // Method to delete a task
    deleteTask: function (taskElement) {
        this.taskList.removeChild(taskElement);            // Remove the task from the list
    }
};

// Initialize the task manager
taskManager.init(); // Set up event listeners when script loads

// Add click event for the button
document.querySelector('button').addEventListener('click', function () {
    taskManager.addTask(); // Trigger task addition when button is clicked
});