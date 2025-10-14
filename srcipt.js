const taskInput = document.getElementById('task');
const priorityInput = document.getElementById('priority');
const categoryInput = document.getElementById('category');
const deadlineInput = document.getElementById('deadline');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Tampilkan semua tugas saat halaman dibuka
displayTasks();

// Fungsi tambah tugas
addTaskBtn.addEventListener('click', () => {
  const task = taskInput.value.trim();
  const priority = priorityInput.value;
  const category = categoryInput.value;
  const deadline = deadlineInput.value;

  if (task === '' || deadline === '') {
    alert('Isi semua kolom terlebih dahulu!');
    return;
  }

  const newTask = {
    id: Date.now(),
    name: task,
    priority,
    category,
    deadline,
    done: false
  };

  tasks.push(newTask);
  saveTasks();
  displayTasks();

  // Reset input
  taskInput.value = '';
  deadlineInput.value = '';
});

// Fungsi tampilkan tugas
function displayTasks(filter = 'all') {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.done;
    if (filter === 'done') return task.done;
    return true;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<p class="empty">Tidak ada tugas<br>Tambahkan tugas baru untuk memulai</p>`;
    return;
  }

  filteredTasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task-item';
    if (task.done) div.classList.add('done');

    div.innerHTML = `
      <div class="info">
        <span><strong>${task.name}</strong></span>
        <span class="details">
          ${task.category} • ${task.priority} • ${new Date(task.deadline).toLocaleString('id-ID')}
        </span>
      </div>
      <div>
        <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})">
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;

    taskList.appendChild(div);
  });
}

// Tandai tugas selesai
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) task.done = !task.done;
    return task;
  });
  saveTasks();
  displayTasks();
}

// Hapus tugas
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  displayTasks();
}

// Simpan ke localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Filter
document.getElementById('showAll').addEventListener('click', () => displayTasks('all'));
document.getElementById('showActive').addEventListener('click', () => displayTasks('active'));
document.getElementById('showDone').addEventListener('click', () => displayTasks('done'));

// Hapus semua tugas yang selesai
document.getElementById('clearDone').addEventListener('click', () => {
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  displayTasks();
});
