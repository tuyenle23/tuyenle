const STORAGE_KEY = 'personal_schedule_events';

let events = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    renderEvents();
    setDefaultDate();
    
    document.getElementById('eventForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('filterType').addEventListener('change', filterEvents);
});

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').value = today;
}

function loadEvents() {
    events = loadFromLocalStorage(STORAGE_KEY, []);
}

function saveEvents() {
    saveToLocalStorage(STORAGE_KEY, events);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const event = {
        id: Date.now().toString(),
        title: document.getElementById('eventTitle').value.trim(),
        date: document.getElementById('eventDate').value,
        startTime: document.getElementById('eventStartTime').value,
        endTime: document.getElementById('eventEndTime').value,
        description: document.getElementById('eventDesc').value.trim(),
        type: document.getElementById('eventType').value,
        createdAt: new Date().toISOString()
    };
    
    if (!event.title || !event.date) {
        alert('Vui lòng nhập tiêu đề và chọn ngày!');
        return;
    }
    
    events.push(event);
    saveEvents();
    renderEvents();
    resetForm();
}

function resetForm() {
    document.getElementById('eventForm').reset();
    setDefaultDate();
}

function renderEvents() {
    const container = document.getElementById('eventsContainer');
    let filteredEvents = events;
    
    if (currentFilter !== 'all') {
        filteredEvents = events.filter(e => e.type === currentFilter);
    }
    
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (filteredEvents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>${events.length === 0 ? 'Chưa có sự kiện nào. Hãy thêm sự kiện đầu tiên!' : 'Không có sự kiện phù hợp với bộ lọc.'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredEvents.map(event => `
        <div class="event-item" data-id="${event.id}">
            <div class="event-date">
                <div class="day">${new Date(event.date).getDate()}</div>
                <div class="month">${new Date(event.date).toLocaleDateString('vi-VN', { month: 'short' })}</div>
            </div>
            <div class="event-content">
                <div class="event-title-row">
                    <h3 class="event-title">${escapeHtml(event.title)}</h3>
                    <span class="event-type ${event.type}">${getTypeLabel(event.type)}</span>
                </div>
                <div class="event-meta">
                    ${event.startTime ? `<span>🕐 ${event.startTime}${event.endTime ? ' - ' + event.endTime : ''}</span>` : ''}
                    <span>📅 ${formatDate(event.date)}</span>
                </div>
                ${event.description ? `<p class="event-desc">${escapeHtml(event.description)}</p>` : ''}
                <div class="event-actions">
                    <button class="btn-edit" onclick="editEvent('${event.id}')">Sửa</button>
                    <button class="btn-delete" onclick="deleteEvent('${event.id}')">Xóa</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getTypeLabel(type) {
    const labels = {
        personal: 'Cá nhân',
        work: 'Công việc',
        health: 'Sức khỏe',
        other: 'Khác'
    };
    return labels[type] || type;
}

function filterEvents() {
    currentFilter = document.getElementById('filterType').value;
    renderEvents();
}

function deleteEvent(id) {
    if (confirm('Xóa sự kiện này?')) {
        events = events.filter(e => e.id !== id);
        saveEvents();
        renderEvents();
    }
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (!event) return;
    
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventStartTime').value = event.startTime || '';
    document.getElementById('eventEndTime').value = event.endTime || '';
    document.getElementById('eventDesc').value = event.description || '';
    document.getElementById('eventType').value = event.type;
    
    deleteEvent(id);
    document.getElementById('eventTitle').focus();
}

function clearAllEvents() {
    if (events.length === 0) return;
    if (confirm(`Xóa tất cả ${events.length} sự kiện? Hành động này không thể hoàn tác!`)) {
        events = [];
        saveEvents();
        renderEvents();
    }
}

function exportData() {
    const data = {
        events: events,
        exportedAt: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData() {
    document.getElementById('importFile').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.events && Array.isArray(data.events)) {
                if (confirm(`Nhập ${data.events.length} sự kiện? Dữ liệu hiện tại sẽ bị ghi đè.`)) {
                    events = data.events;
                    saveEvents();
                    renderEvents();
                    alert('Nhập dữ liệu thành công!');
                }
            } else {
                alert('File JSON không đúng định dạng!');
            }
        } catch (err) {
            alert('Lỗi đọc file: ' + err.message);
        }
        event.target.value = '';
    };
    reader.readAsText(file);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}