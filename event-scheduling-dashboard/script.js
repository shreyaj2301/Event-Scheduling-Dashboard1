document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const eventTableBody = document.getElementById('eventTableBody');
    const saveEventBtn = document.getElementById('saveEvent');
    const searchBar = document.getElementById('searchBar');

    let events = []; // Array to store event data

    // Generate calendar
    function generateCalendar() {
        for (let i = 1; i <= 30; i++) {
            const day = document.createElement('div');
            day.innerText = i;
            day.dataset.date = `2025-01-${i.toString().padStart(2, '0')}`;
            day.className = 'date-cell';
            day.addEventListener('click', () => openEventModal(day.dataset.date));
            calendar.appendChild(day);
        }
    }

    // Open modal to add/edit events
    function openEventModal(date) {
        document.getElementById('eventDate').value = date;
        document.getElementById('eventId').value = ''; // Reset hidden field
        document.getElementById('eventName').value = '';
        document.getElementById('eventTime').value = '';
        document.getElementById('eventDescription').value = '';
        document.getElementById('eventModalLabel').innerText = `Add/Edit Event for ${date}`;
        new bootstrap.Modal(document.getElementById('eventModal')).show();
    }

    // Save event
    saveEventBtn.addEventListener('click', () => {
        const id = document.getElementById('eventId').value || Date.now().toString(); // Generate unique ID if not editing
        const name = document.getElementById('eventName').value.trim();
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;
        const desc = document.getElementById('eventDescription').value.trim();

        if (name && date && time && desc) {
            const existingEvent = events.find(event => event.id === id);
            if (existingEvent) {
                // Update existing event
                existingEvent.name = name;
                existingEvent.date = date;
                existingEvent.time = time;
                existingEvent.desc = desc;
            } else {
                // Add new event
                events.push({ id, name, date, time, desc });
            }
            renderEvents();
            bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide(); // Close modal
            clearForm(); // Clear form fields
        } else {
            alert('Please fill all fields!');
        }
    });

    // Clear form
    function clearForm() {
        document.getElementById('eventId').value = '';
        document.getElementById('eventName').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventTime').value = '';
        document.getElementById('eventDescription').value = '';
    }

    // Render events in the table
    function renderEvents() {
        eventTableBody.innerHTML = ''; // Clear previous table rows

        events.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.desc}</td>
                <td>${event.date}</td>
                <td>${event.time}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                </td>
            `;
            eventTableBody.appendChild(row);

            // Edit Event
            row.querySelector('.edit-btn').addEventListener('click', () => {
                document.getElementById('eventId').value = event.id;
                document.getElementById('eventName').value = event.name;
                document.getElementById('eventDate').value = event.date;
                document.getElementById('eventTime').value = event.time;
                document.getElementById('eventDescription').value = event.desc;
                new bootstrap.Modal(document.getElementById('eventModal')).show();
            });

            // Delete Event
            row.querySelector('.delete-btn').addEventListener('click', () => {
                events = events.filter(e => e.id !== event.id);
                renderEvents();
            });
        });
    }

    // Search functionality
    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        document.querySelectorAll('#eventTableBody tr').forEach(row => {
            row.style.display = Array.from(row.children)
                .some(td => td.innerText.toLowerCase().includes(query)) ? '' : 'none';
        });
    });

    generateCalendar(); // Initialize calendar
});
