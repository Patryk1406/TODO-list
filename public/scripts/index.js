//UPDATE STATUS OF A TASK
const changeStatusButtons = document.querySelectorAll('.change');

changeStatusButtons.forEach( btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('done')
        btn.textContent = btn.classList.contains('done') ? 'done' : 'not done';
        const id = btn.getAttribute('data-id')
        fetch(`/todoList/${id}`, {
            method: 'PATCH',
        })
    })
})

// DELETE A TASK
const deleteButtons = document.querySelectorAll('.delete');

deleteButtons.forEach(( btn => {
    btn.addEventListener('click', () => {
       btn.parentElement.parentElement.removeChild(btn.parentElement);
       const id = btn.getAttribute('data-id');
       fetch(`/todoList/${id}`, {
           method: 'DELETE',
       })
    })
}))

//INSERT A NEW TASK
const addButton = document.querySelector('.add-new-task-button');
const description = document.querySelector('.description-new-task');
const todoListSection = document.querySelector('.todolist')

addButton.addEventListener('click', async () => {
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task');
    const descriptionContainer = document.createElement('p');
    const descriptionValue = description.value;
    descriptionContainer.textContent = descriptionValue;
    descriptionContainer.classList.add('description');
    const changeStatusBtn = document.createElement('p');
    changeStatusBtn.textContent = 'not done';
    changeStatusBtn.classList.add('change');
    const deleteBtn = document.createElement('p');
    deleteBtn.textContent = 'delete';
    deleteBtn.classList.add('delete');
    const childrenOfTaskContainer = [descriptionContainer, changeStatusBtn, deleteBtn];
    childrenOfTaskContainer.forEach(child => {
        taskContainer.appendChild(child);
    });
    todoListSection.appendChild(taskContainer);
    const descriptionToSend = JSON.stringify({description: descriptionValue,});
    const response = await fetch('/todoList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: descriptionToSend,
    })
    const taskId = await response.json()
    changeStatusBtn.setAttribute('data-id', taskId)
    deleteBtn.setAttribute('data-id', taskId)
    changeStatusBtn.addEventListener('click', () => {
        changeStatusBtn.classList.toggle('done')
        changeStatusBtn.textContent = changeStatusBtn.classList.contains('done') ? 'done' : 'not done';
        fetch(`/todoList/${taskId}`, {
            method: 'PATCH',
        })
    })
    deleteBtn.addEventListener('click', () => {
        deleteBtn.parentElement.parentElement.removeChild(deleteBtn.parentElement);
        fetch(`/todoList/${taskId}`, {
            method: 'DELETE',
        })
    })
})

