//UTILITIES

function createPElementAddClassAndText(className, text){
    const p = document.createElement('p');
    p.textContent = text;
    p.classList.add(className);
    return p;
}

function createDivElementAndAddClass(className) {
    const div =document.createElement('div');
    div.classList.add(className);
    return div;
}

// ERRORS SHOWING

function exitError() {
    const exitBtn = document.querySelector('div.exit');
    exitBtn.addEventListener('click', () => {
        document.body.removeChild(exitBtn.parentElement.parentElement);
    })
}

async function showError(res) {
    const message = (await res.json()).message;
    const divObscure = createDivElementAndAddClass('obscure');
    const divError = createDivElementAndAddClass('error');
    const divExit = createDivElementAndAddClass('exit');
    const p = document.createElement('p');
    p.textContent = message;
    const i = document.createElement('i');
    i.classList.add('fas', 'fa-times');
    divExit.appendChild(i);
    divError.appendChild(p);
    divError.appendChild(divExit)
    divObscure.appendChild(divError);
    document.body.appendChild(divObscure);
    exitError();
}

//EDIT DESCRIPTION

function launchEditBtnFunctionality (btn) {
    const taskContainer = btn.parentElement;
    if (!(taskContainer.hasAttribute('data-edited'))) {
        taskContainer.setAttribute('data-edited', String(true));
        const descriptionContainer = taskContainer.children[0];
        const textArea = document.createElement('textarea');
        textArea.value = descriptionContainer.textContent;
        textArea.setAttribute('rows', String(1));
        btn.textContent = 'save';
        taskContainer.children[1].style.display = 'none';
        btn.style.flexBasis = '26.66%'
        btn.addEventListener('click', () => updateRequestSend(btn), {once: true});
        taskContainer.removeChild(descriptionContainer);
        taskContainer.prepend(textArea);
    }
}

function addEventListenerToEditBtns() {
    const editBtns = document.querySelectorAll('.edit');

    editBtns.forEach(
        btn =>  btn.addEventListener('click', ()=> launchEditBtnFunctionality(btn))
    );
}

addEventListenerToEditBtns();

//UPDATE A TASK

async function updateRequestSend(btn) {
    const id = btn.getAttribute('data-id')
    const taskContainer = btn.parentElement;
    const textArea = taskContainer.children[0]
    const description = textArea.value;
    const res = await fetch(`/todoList/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            description,
        })
    });
    if (res.status === 200) {
        if (!description) {
            btn.classList.toggle('done')
            btn.textContent = btn.classList.contains('done') ? 'done' : 'not done';
        }
        else {
            btn.textContent = 'edit description'
            taskContainer.removeAttribute('data-edited');
            const descriptionContainer = document.createElement('p');
            descriptionContainer.textContent = textArea.value
            descriptionContainer.classList.add('description');
            taskContainer.removeChild(textArea);
            taskContainer.prepend(descriptionContainer);
            taskContainer.children[1].style.display = 'flex';
            btn.style.flexBasis = '13.33%'
        }
    } else {
        await showError(res);
    }
}

function updateStatusOfTask() {
    const changeStatusBtns = document.querySelectorAll('.change');
    changeStatusBtns.forEach(
        btn => btn.addEventListener('click', () => updateRequestSend(btn))
    );
}

updateStatusOfTask();

// DELETE A TASK

async function deleteRequestSend(btn) {
    const id = btn.getAttribute('data-id');
    const res = await fetch(`/todoList/${id}`, {
        method: 'DELETE',
    });
    if (res.status === 200) {
        btn.parentElement.parentElement.removeChild(btn.parentElement);
    } else {
        await showError(res);
    }
}

function deleteTask() {
    const deleteBtns = document.querySelectorAll('.delete');

    deleteBtns.forEach(
        btn => btn.addEventListener('click', () => deleteRequestSend(btn))
    );
}

deleteTask();

//INSERT A NEW TASK

function insertTask() {
    const addBtn = document.querySelector('.add-new-task-button');
    const description = document.querySelector('section.add-new-task>textarea');
    const todoListSection = document.querySelector('.todolist')

    addBtn.addEventListener('click', async () => {
        const descriptionValue = description.value;
        const descriptionToSend = JSON.stringify({description: descriptionValue,});
        const res = await fetch('/todoList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: descriptionToSend,
        })
        if (res
            .status === 201) {
            const taskContainer = document.createElement('div');
            taskContainer.classList.add('task');
            const descriptionContainer = createPElementAddClassAndText('description', descriptionValue);
            const changeStatusBtn = createPElementAddClassAndText('change', 'not done');
            const deleteBtn = createPElementAddClassAndText('delete', 'delete');
            const editBtn = createPElementAddClassAndText('edit', 'edit description');
            const taskId = await res.json();
            changeStatusBtn.setAttribute('data-id', taskId);
            deleteBtn.setAttribute('data-id', taskId);
            editBtn.setAttribute('data-id', taskId);
            changeStatusBtn.addEventListener('click', () => updateRequestSend(changeStatusBtn));
            deleteBtn.addEventListener('click', () => deleteRequestSend(deleteBtn));
            editBtn.addEventListener('click', () => launchEditBtnFunctionality(editBtn));
            const childrenOfTaskContainer = [descriptionContainer, changeStatusBtn, deleteBtn, editBtn];
            childrenOfTaskContainer.forEach(child => {
                taskContainer.appendChild(child);
            });
            todoListSection.appendChild(taskContainer);
        } else {
            await showError(res);
        }
    });
}

insertTask();
