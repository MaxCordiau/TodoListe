document.addEventListener('DOMContentLoaded', () => {
    const todoListElement = document.getElementById('todo-list');
    const completedListElement = document.getElementById('completed-list');
    const todoForm = document.getElementById('todo-form');
    const nameTacheInput = document.getElementById('name_tache');

    function fetchTodoList() {
        fetch('todolist.php')
            .then(response => response.json())
            .then(todolist => {
                todoListElement.innerHTML = '';
                completedListElement.innerHTML = '';

                todolist.forEach(task => {
                    const li = document.createElement('li');
                    li.classList.add('flex', 'justify-between', 'items-center', 'mb-2');

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = task.completed;
                    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id, checkbox.checked));

                    const taskName = document.createElement('span');
                    taskName.textContent = task.tache;
                    taskName.classList.add('flex-1', 'ml-2');
                    taskName.addEventListener('dblclick', () => enableEditing(taskName, task.id, task.tache));

                    const actionsDiv = document.createElement('div');
                    const editButton = document.createElement('button');
                    editButton.classList.add('edit-btn', 'text-blue-500', 'mr-2');
                    editButton.textContent = 'Modifier';
                    editButton.addEventListener('click', () => enableEditing(taskName, task.id, task.tache));

                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('delete-btn', 'text-red-500');
                    deleteButton.textContent = 'Supprimer';
                    deleteButton.addEventListener('click', () => deleteTask(task.id));

                    actionsDiv.appendChild(editButton);
                    actionsDiv.appendChild(deleteButton);

                    li.appendChild(checkbox);
                    li.appendChild(taskName);
                    li.appendChild(actionsDiv);

                    if (task.completed) {
                        completedListElement.appendChild(li);
                    } else {
                        todoListElement.appendChild(li);
                    }
                });
            })
            .catch(error => console.error('Erreur:', error));
    }

    function addTodo(event) {
        event.preventDefault();
        const name_tache = nameTacheInput.value.trim();

        if (name_tache) {
            fetch('todolist.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `name_tache=${encodeURIComponent(name_tache)}`,
            })
            .then(() => {
                nameTacheInput.value = '';
                fetchTodoList();
            })
            .catch(error => console.error('Erreur:', error));
        }
    }

    function toggleTaskCompletion(id, completed) {
        fetch('todolist.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${id}&completed=${completed}`,
        })
        .then(() => fetchTodoList())
        .catch(error => console.error('Erreur:', error));
    }

    // function enableEditing(taskNameElement, taskId, currentName) {
    //     const input = document.createElement('input');
    //     input.type = 'text';
    //     input.value = currentName;
    //     input.classList.add('flex-1', 'ml-2', 'border', 'p-1');

    //     input.addEventListener('keydown', (event) => {
    //         if (event.key === 'Enter') {
    //             updateTaskName(taskId, input.value);
    //         }
    //     });

    //     input.addEventListener('blur', () => {
    //         updateTaskName(taskId, input.value);
    //     });

    //     taskNameElement.replaceWith(input);
    //     input.focus();
    // }


    todoForm.addEventListener('submit', addTodo);

    fetchTodoList();
});
