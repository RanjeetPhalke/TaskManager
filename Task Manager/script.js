const taskName = document.getElementById("taskName");
const priority = document.getElementById("priority");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskRemark = document.getElementById("taskRemark");
const addTaskBtn = document.getElementById("addTask");
const clearAll = document.querySelector(".clear-btn");
const taskBox = document.querySelector(".task-box");
const filterPriority = document.getElementById("filterPriority");
const filterDate = document.getElementById("filterDate");
const applyFilters = document.getElementById("applyFilters");

let taskmanager = JSON.parse(localStorage.getItem("taskmanager-list")) || [];
let editIndex = null;

function showTasks(filter = {}) {
    let taskHTML = "";
    taskmanager.forEach((task, id) => {
        if ((filter.priority && filter.priority !== "All" && task.priority !== filter.priority) ||
            (filter.date && task.date !== filter.date)) return;

        taskHTML += `
            <tr class="${task.completed ? 'completed' : ''}">
                <td><input type="checkbox" onchange="toggleComplete(${id})" ${task.completed ? 'checked' : ''}></td>
                <td>${task.name}</td>
                <td>${task.priority}</td>
                <td>${task.date}</td>
                <td>${task.time}</td>
                <td>${task.remark}</td>
                <td class="actions">
                    <button class="edit" onclick="startEditTask(${id})">Edit</button>
                    <button class="delete" onclick="deleteTask(${id})">Delete</button>
                </td>
            </tr>
        `;
    });
    taskBox.innerHTML = taskHTML || `<tr><td colspan="7">No tasks available</td></tr>`;
}

function addTask() {
    if (!taskName.value.trim() || !taskDate.value || !taskTime.value) {
        alert("Please fill in all required fields (Task, Date, Time).")
        return;
    }

    let newTask = {
        name: taskName.value.trim(),
        priority: priority.value,
        date: taskDate.value,
        time: taskTime.value,
        remark: taskRemark.value.trim(),
        completed: false
    };

    if (editIndex !== null) {
        taskmanager[editIndex] = newTask;
        editIndex = null;
        addTaskBtn.textContent = "Add Task";
    } else {
        taskmanager.push(newTask);
    }

    localStorage.setItem("taskmanager-list", JSON.stringify(taskmanager));
    resetForm();
    showTasks();
}

function startEditTask(id) {
    let task = taskmanager[id];
    taskName.value = task.name;
    priority.value = task.priority;
    taskDate.value = task.date;
    taskTime.value = task.time;
    taskRemark.value = task.remark;
    editIndex = id;
    addTaskBtn.textContent = "Update Task";
}

function deleteTask(id) {
    taskmanager.splice(id, 1);
    localStorage.setItem("taskmanager-list", JSON.stringify(taskmanager));
    showTasks();
}

function clearAllTasks() {
    taskmanager = [];
    localStorage.setItem("taskmanager-list", JSON.stringify(taskmanager));
    showTasks();
}

function toggleComplete(id) {
    if (taskmanager[id]) {
        taskmanager[id].completed = !taskmanager[id].completed;
    localStorage.setItem("taskmanager-list", JSON.stringify(taskmanager));
    showTasks();
}}

function resetForm() {
    taskName.value = "";
    taskDate.value = "";
    taskTime.value = "";
    taskRemark.value = "";
    addTaskBtn.textContent = "Add Task";
    editIndex = null;
}

function applyFilter() {
    showTasks({
        priority: filterPriority.value,
        date: filterDate.value
    });
}

clearAll.addEventListener("click", clearAllTasks);
addTaskBtn.addEventListener("click", addTask);
applyFilters.addEventListener("click", applyFilter);
showTasks();
