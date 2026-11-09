// Study Task Tracker - logic
// Tasks are stored in the browser's localStorage so they survive page reloads.

(function () {
  "use strict";

  var STORAGE_KEY = "study-tasks";

  // ----- State -----
  var tasks = loadTasks(); // [{ id, text, completed }]
  var currentFilter = "all"; // "all" | "active" | "completed"

  // ----- Element references -----
  var form = document.getElementById("task-form");
  var input = document.getElementById("task-input");
  var list = document.getElementById("task-list");
  var emptyState = document.getElementById("empty-state");
  var countLabel = document.getElementById("task-count");
  var clearCompletedBtn = document.getElementById("clear-completed");
  var filterButtons = document.querySelectorAll(".filter-btn");

  // ----- Storage helpers -----
  function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // ----- Rendering -----
  function getVisibleTasks() {
    if (currentFilter === "active") {
      return tasks.filter(function (t) { return !t.completed; });
    }
    if (currentFilter === "completed") {
      return tasks.filter(function (t) { return t.completed; });
    }
    return tasks;
  }

  function render() {
    var visible = getVisibleTasks();

    // Rebuild the list
    list.innerHTML = "";
    visible.forEach(function (task) {
      list.appendChild(createTaskElement(task));
    });

    // Empty state message
    if (tasks.length === 0) {
      emptyState.textContent = "No tasks yet. Add your first study task above.";
      emptyState.hidden = false;
    } else if (visible.length === 0) {
      emptyState.textContent =
        currentFilter === "active" ? "No active tasks. Nice work!" : "No completed tasks yet.";
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
    }

    // Remaining count
    var remaining = tasks.filter(function (t) { return !t.completed; }).length;
    countLabel.textContent = remaining + (remaining === 1 ? " task left" : " tasks left");

    // Show "Clear completed" only when something is completed
    clearCompletedBtn.hidden = !tasks.some(function (t) { return t.completed; });
  }

  function createTaskElement(task) {
    var li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.dataset.id = task.id;

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task done");
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    var span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    var del = document.createElement("button");
    del.className = "task-delete";
    del.type = "button";
    del.setAttribute("aria-label", "Delete task");
    del.textContent = "×";
    del.addEventListener("click", function () {
      deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    return li;
  }

  // ----- Actions -----
  function addTask(text) {
    tasks.push({
      id: String(Date.now()) + Math.random().toString(16).slice(2),
      text: text,
      completed: false
    });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    tasks = tasks.map(function (t) {
      return t.id === id ? { id: t.id, text: t.text, completed: !t.completed } : t;
    });
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) { return t.id !== id; });
    saveTasks();
    render();
  }

  function clearCompleted() {
    tasks = tasks.filter(function (t) { return !t.completed; });
    saveTasks();
    render();
  }

  // ----- Events -----
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    addTask(text);
    input.value = "";
    input.focus();
  });

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentFilter = btn.dataset.filter;
      filterButtons.forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });
      render();
    });
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);

  // First render
  render();
})();
