let taskList = document.getElementById("tasks");

//Provera da li je nesto upisano u input polje
function checkTask () {
    let taskInput = document.getElementById("newTask");
    if (taskInput.value !== "") {
        addTaskToList();
    } else {
        document.getElementById("addBtn").addEventListener("click", function(event){
            event.preventDefault()});
        alert("You didn't enter any text, try again!")
    }
}

//Dodavanje zadataka u listu i ciscenje inputa nakon pritiska dugmeta
function addTaskToList() {
    //kreiranje li sa sadrzajem inputa, span(dugmeta) i dodavanje u ul
    let taskInput = document.getElementById("newTask").value;
    let listIt = document.createElement("li");
    let spanTask = document.createElement("span");
    let taskText = document.createTextNode(`${taskInput}`);
    spanTask.appendChild(taskText);
    listIt.appendChild(spanTask);
    let btnInsideTask = document.createElement("span");
    let spanClass = document.createAttribute("class");
    spanClass.value = "removeBtn"
    btnInsideTask.setAttributeNode(spanClass);
    btnInsideTask.innerHTML = "&times;"
    listIt.appendChild(btnInsideTask);
    taskList.appendChild(listIt);
    //resetovanje forme 
    document.getElementsByTagName("form")[0].reset();
    //brisanje elemenata liste pritiskom na x
    let removeBtns = document.getElementsByClassName("removeBtn");
    for (let i = 0; i < removeBtns.length; i++) {
        removeBtns[i].addEventListener("click", removeListItem);
    };
    localStorage.setItem('savedTasks', taskList.innerHTML);
}
    
document.getElementById('addBtn').addEventListener('click', checkTask);
document.getElementById("newTask").addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      document.getElementById("addBtn").click();
      event.preventDefault();
    }
  });


//Brisanje zadataka iz liste (jedan po jedan)
function removeListItem() {
    let continueRemove = confirm("Are you sure you want to remove this task? This action cannot be undone.");
    if (continueRemove) {
        this.parentElement.parentElement.removeChild(this.parentElement);
        localStorage.setItem('savedTasks', taskList.innerHTML);
    }
};

//Brisanje svih zadataka iz liste 
function removeAllTasks () {
    let listItems = taskList.getElementsByTagName("li");
    if (listItems.length === 0) {
        alert("No tasks to be cleared.")
    } else {
        let continueClear = confirm("Are you sure you want to clear all tasks? This action cannot be undone.");
        if (continueClear) {
            while (listItems.length > 0) {
                taskList.removeChild(listItems[0]); 
            }
    localStorage.clear();
        }
    }
}
document.getElementById('clearBtn').addEventListener('click', removeAllTasks);

//Filtriranje zadataka
function filterTasks() {
    let filterInput = document.getElementById('filterTask');
    let filter = filterInput.value.toUpperCase();
    let listItems = taskList.getElementsByTagName('li');
    for (let i = 0; i < listItems.length; i++) {
        let firstSpan = listItems[i].getElementsByTagName("span")[0];
        if (firstSpan.innerHTML.toUpperCase().indexOf(filter) > -1) {
            listItems[i].style.display = "block";
        } else {
            listItems[i].style.display = "none";
        }
    }
};
let filterT = document.getElementById('filterTask');
    filterT.addEventListener('keyup', filterTasks);

//Vracanje sacuvanih zadataka pri otvaranju stranice
let saved = localStorage.getItem('savedTasks');
if (saved) {
	taskList.innerHTML = saved;
}
