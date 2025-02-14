document.addEventListener("DOMContentLoaded", function () {
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const completedCount = document.getElementById("completedCount");
    const taskCompletionChart = document.getElementById('taskCompletionChart');

    let tasksData = []; // Store individual task details

    const chart = new Chart(taskCompletionChart, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Task Completion Status',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    let completed = 0;

    addTaskBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const createdTime = new Date(); // Store the exact Date object
            const formattedTime = createdTime.toLocaleTimeString();
            const taskId = tasksData.length;

            const li = document.createElement("li");
            li.innerHTML = `
                <span>${taskText} <span class="datesize">(${formattedTime})</span></span>
                <button class="editBtn"><i class="fa fa-edit"></i></button>
                <button class="deleteBtn"><i class="fa fa-trash"></i></button>
                <input type="checkbox" class="completeBtn" />
                <span class="completion-time"></span>
            `;
            taskList.appendChild(li);

            alert("Task Added!");
            taskInput.value = '';

            tasksData.push({
                id: taskId,
                name: `${taskText} (${formattedTime})`,
                createdTime: createdTime,
                completedTime: null,
                completed: 0
            });

            updateChart();

            const completeBtn = li.querySelector(".completeBtn");
            const deleteBtn = li.querySelector(".deleteBtn");
            const editBtn = li.querySelector(".editBtn");
            const completionTimeSpan = li.querySelector(".completion-time");

            completeBtn.addEventListener("change", function () {
                if (completeBtn.checked) {
                    li.classList.add('success');
                    const completedTime = new Date();
                    const totalSeconds = Math.floor((completedTime - tasksData[taskId].createdTime) / 1000);
                    const minutes = Math.floor(totalSeconds / 60);
                    const seconds = totalSeconds % 60;
                    tasksData[taskId].completedTime = completedTime;
                    tasksData[taskId].completed = 1;
                    completed++;

                    // Show completion time in UI
                    completionTimeSpan.innerHTML =`✅ Completed in ${minutes} min ${seconds} sec`;
                } else {
                    tasksData[taskId].completedTime = null;
                    tasksData[taskId].completed = 0;
                    li.classList.remove('success');
                    completed--;
                    completionTimeSpan.innerHTML = ""; // Clear completion time if unchecked
                }
                completedCount.innerHTML = completed;
                updateChart();
            });

            deleteBtn.addEventListener("click", function () {
                tasksData = tasksData.filter(task => task.id !== taskId);
                taskList.removeChild(li);
                if (completeBtn.checked) {
                    completed--;
                    completedCount.innerHTML = completed;
                }
                updateChart();
            });

            editBtn.addEventListener("click", function () {
                const newTaskText = prompt("Edit your task:", taskText);
                if (newTaskText) {
                    li.querySelector("span").innerHTML = `${newTaskText} <span class="datesize">(${formattedTime})</span>`;
                    tasksData[taskId].name = `${newTaskText} (${formattedTime})`;
                    updateChart();
                }
            });
        }
    });

    function updateChart() {
        chart.data.labels = tasksData.map(task => task.name);
        chart.data.datasets[0].data = tasksData.map(task => task.completed);
        chart.update();
    }
});