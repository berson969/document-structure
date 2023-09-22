function saveTasks()  {
    const tasks = Array.from(document.querySelectorAll('.task__title')).map(task => task.textContent)
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function loadTasks() {
    const storage = localStorage.getItem("tasks")
    console.log('storage', storage)
    if (storage) {
        const tasks = JSON.parse(storage)
        tasks.forEach( task => {
            addTask(task)
            removeTask()
        })
    }
}

function removeTask() {
    const removes = document.querySelectorAll('.task__remove')

    removes.forEach( remove => {
        remove.addEventListener("click", (event) => {
            event.preventDefault()
            remove.parentElement.remove()
            saveTasks()
        })
    })
}

function addTask(text) {
    const tasksContainer = document.getElementById('tasks__list')
    const taskHTML = `
              <div class="task">
                <div class="task__title">${text}</div>
                <a href="#" class="task__remove">&times;</a>
              </div>`

    tasksContainer.insertAdjacentHTML('beforeend', taskHTML)
}


window.addEventListener('load', loadTasks)

const form = document.getElementById('tasks__form')

form.addEventListener("submit", (event) => {
    event.preventDefault()
    const input = document.getElementById("task__input")
    if (input.value) {
        addTask(input.value)
        input.value = ''

        saveTasks()
        removeTask()
    }
})

