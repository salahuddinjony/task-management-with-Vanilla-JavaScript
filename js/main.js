document.addEventListener("DOMContentLoaded", function () {
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const completedCount = document.getElementById("completedCount");

    const clock=document.getElementById("clock");
    const date=document.getElementById("date");

    setInterval(clockTimer,1000);

    function clockTimer(){
        const date=new Date();
        const hr=date.getHours();
        const mn=date.getMinutes();
        const sec=date.getSeconds();
        var months = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ];
        // var days = [
        //     "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        // ];
        const monthName = months[date.getMonth()];  
        const dayName = date.getDate();      
        

        clock.innerHTML=hr+":"+mn+":"+sec+"("+dayName+" "+monthName+")";
    }

    let completedTasks = 0;
    const completedTasksData = [];

    const taskCompletionChart = document.getElementById('taskCompletionChart');
    const chart = new Chart(taskCompletionChart, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Completed Tasks',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            }
        }
    });

    addTaskBtn.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${taskText}</span>
                <button class="editBtn"><i class="fa fa-edit"></i></button>
                <button class="deleteBtn"><i class="fa fa-trash"></i></button>
                <input type="checkbox" class="completeBtn" />
            `;
            taskList.appendChild(li);
            alert("Added!");
            taskInput.value = '';

            const completeBtn = li.querySelector(".completeBtn");
            const deleteBtn = li.querySelector(".deleteBtn");
            const editBtn = li.querySelector(".editBtn");

            completeBtn.addEventListener("change", function () {
                if (completeBtn.checked) {
                    li.classList.add("completed");
                    completedTasks++;
                } else {
                    li.classList.remove("completed");
                    completedTasks--;
                }
                completedCount.textContent = completedTasks;
                updateChart();
            });

            deleteBtn.addEventListener("click", function () {
                taskList.removeChild(li);
                if (completeBtn.checked) {
                    completedTasks--;
                }
                completedCount.textContent = completedTasks;
                // alert("Deleted!");
                updateChart();
            });

            editBtn.addEventListener("click", function () {
                const newTaskText = prompt("Edit your task:", taskText);
                if (newTaskText) {
                    li.querySelector("span").textContent = newTaskText;
                }
            });
        }
    });

    function updateChart() {
        const today = new Date().toLocaleDateString();

        if (completedTasksData.length === 0 || completedTasksData[completedTasksData.length - 1].date !== today) {
            completedTasksData.push({
                date: today,
                completed: completedTasks
            });

            chart.data.labels.push(today);
            chart.data.datasets[0].data.push(completedTasks);

            chart.update();
        }
    }
});