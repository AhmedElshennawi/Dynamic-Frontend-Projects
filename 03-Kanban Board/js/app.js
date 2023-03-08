window.addEventListener("load", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks) {
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      const column = document.getElementById(task.status);
      column.querySelector(".dropzone").appendChild(taskElement);
    });
  }
});

const allowDrop = (event) => {
  event.preventDefault();
};

const drag = (event) => {
  event.dataTransfer.setData("text", event.target.id);
};

const drop = (event, columnId) => {
  event.preventDefault();
  const taskElementId = event.dataTransfer.getData("text");
  const taskElement = document.getElementById(taskElementId);
  const column = document.getElementById(columnId);
  column.querySelector(".dropzone").appendChild(taskElement);
  updateTaskStatus(taskElementId, columnId);
};

const addTask = (event) => {
  event.preventDefault();
  const taskName = document.getElementById("task-name").value;
  const taskDescription = document.getElementById("task-description").value;
  const task = {
    id: `task-${Date.now()}`,
    name: taskName,
    description: taskDescription,
    status: "not-started",
  };
  const taskElement = createTaskElement(task);
  const notStartedColumn = document.getElementById("not-started");
  const dropzone = notStartedColumn.querySelector(".dropzone");
  dropzone.appendChild(taskElement);

  // Clear the form
  document.getElementById("task-name").value = "";
  document.getElementById("task-description").value = "";

  // Save task in localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const createTaskElement = (task) => {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.setAttribute("draggable", "true");
  taskElement.setAttribute("id", task.id);
  taskElement.dataset.taskId = task.id;
  taskElement.dataset.taskStatus = task.status;
  taskElement.addEventListener("dragstart", dragstart_handler);
  taskElement.addEventListener("click", taskClickHandler);

  const taskHeader = document.createElement("div");
  taskHeader.classList.add("task-header");
  taskHeader.textContent = task.name;
  taskElement.appendChild(taskHeader);

  const taskDescription = document.createElement("div");
  taskDescription.classList.add("task-description");
  taskDescription.textContent = task.description;
  taskElement.appendChild(taskDescription);

  const taskButtons = document.createElement("div");
  taskButtons.classList.add("task-buttons");

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", editTaskHandler);
  taskButtons.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", deleteTaskHandler);
  taskButtons.appendChild(deleteButton);

  taskElement.appendChild(taskButtons);

  return taskElement;
};

const editTaskHandler = (event) => {
  const taskElement = event.target.closest(".task");
  const taskId = taskElement.dataset.taskId;
  const taskName = taskElement.querySelector(".task-header").textContent;
  const taskDescription =
    taskElement.querySelector(".task-description").textContent;

  // Set the form fields with the current task data
  const taskNameInput = document.getElementById("task-name");
  const taskDescriptionInput = document.getElementById("task-description");
  taskNameInput.value = taskName;
  taskDescriptionInput.value = taskDescription;

  // Remove the task from the DOM
  taskElement.remove();
};

const deleteTaskHandler = (event) => {
  const taskElement = event.target.closest(".task");
  taskElement.remove();
};

const taskClickHandler = (event) => {
  const taskElement = event.target.closest(".task");
  const taskId = taskElement.dataset.taskId;
  console.log(`Clicked task ${taskId}`);
};

const dragstart_handler = (event) => {
  event.dataTransfer.setData("text/plain", event.target.dataset.taskId);
  event.dataTransfer.dropEffect = "move";
};

const drop_handler = (event) => {
  event.preventDefault();
  const taskElement = document.querySelector(
    `[data-task-id="${event.dataTransfer.getData("text/plain")}"]`
  );
  const dropzone = event.target.closest(".dropzone");
  dropzone.appendChild(taskElement);
};

const dragover_handler = (event) => {
  event.preventDefault();
};

const updateTaskStatus = (taskId, status) => {
  // implementation of this function is not provided
  console.log(`Task ${taskId} status updated to ${status}`);

  // Update task status in localStorage
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  tasks[taskIndex].status = status;
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

document.getElementById("add-task").addEventListener("click", addTask);
