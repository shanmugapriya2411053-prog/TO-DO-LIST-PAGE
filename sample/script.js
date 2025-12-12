const input = document.getElementById('task-input');
const descInput = document.getElementById('desc-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('task-list');
const empty = document.getElementById('empty');

const STORAGE_KEY = "todo.tasks";

function loadTasks(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTasks(tasks){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function uid(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function createTaskElement(task){
  const li = document.createElement('li');
  li.className = "task";
  li.dataset.id = task.id;

  const title = document.createElement('div');
  title.className = "label";
  title.textContent = task.text;

  const desc = document.createElement('div');
  desc.className = "desc";
  desc.textContent = task.desc;

  const btns = document.createElement('div');
  btns.className = "btns";

  const editBtn = document.createElement('button');
  editBtn.className = "icon-btn";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", (e)=>{
    e.stopPropagation();
    editTask(task.id);
  });

  const delBtn = document.createElement('button');
  delBtn.className = "icon-btn icon-delete";
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", (e)=>{
    e.stopPropagation();
    deleteTask(task.id);
  });

  btns.appendChild(editBtn);
  btns.appendChild(delBtn);

  li.appendChild(title);
  li.appendChild(desc);
  li.appendChild(btns);

  return li;
}

function render(){
  const tasks = loadTasks();
  list.innerHTML = "";

  if(tasks.length === 0){
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  tasks.forEach(task=>{
    list.appendChild(createTaskElement(task));
  });
}

function addTask(){
  const text = input.value.trim();
  const desc = descInput.value.trim();

  if(!text) return;

  const tasks = loadTasks();
  tasks.unshift({
    id: uid(),
    text,
    desc
  });

  saveTasks(tasks);
  input.value = "";
  descInput.value = "";
  render();
}

addBtn.addEventListener("click", addTask);

function deleteTask(id){
  let tasks = loadTasks().filter(t => t.id !== id);
  saveTasks(tasks);
  render();
}

function editTask(id){
  const tasks = loadTasks();
  const t = tasks.find(task => task.id === id);
  if(!t) return;

  const newTitle = prompt("Edit Title:", t.text);
  if(newTitle === null) return;

  const newDesc = prompt("Edit Description:", t.desc);
  if(newDesc === null) return;

  t.text = newTitle.trim();
  t.desc = newDesc.trim();

  saveTasks(tasks);
  render();
}

render();

