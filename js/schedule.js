const STORAGE_KEY = 'personal_schedule_events';

let events = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    setDefaultDate();
    renderEvents();
    
    const form = document.getElementById('eventForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    const filterType = document.getElementById('filterType');
    if (filterType) {
        filterType.addEventListener('change', filterEvents);
    }
});

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('eventDate');
    if (dateInput) dateInput.value = today;
}

function loadEvents() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        events = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(events)) events = [];
    } catch (e) {
        console.error('Lỗi đọc:', e);
        events = [];
    }
}

function saveEvents() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
        console.error('Lỗi lưu:', e);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const titleEl = document.getElementById('eventTitle');
    const dateEl = document.getElementById('eventDate');
    const startEl = document.getElementById('eventStartTime');
    const endEl = document.getElementById('eventEndTime');
    const descEl = document.getElementById('eventDesc');
    const typeEl = document.getElementById('eventType');
    
    const newEvent = {
        id: Date.now().toString(),
        title: titleEl ? titleEl.value.trim() : '',
        date: dateEl ? dateEl.value : '',
        startTime: startEl ? startEl.value : '',
        endTime: endEl ? endEl.value : '',
        description: descEl ? descEl.value.trim() : '',
        type: typeEl ? typeEl.value : 'personal',
        createdAt: new Date().toISOString()
    };
    
    if (!newEvent.title || !newEvent.date) {
        alert('Vui lòng nhập tiêu đề và chọn ngày!');
        return;
    }
    
    events.push(newEvent);
    saveEvents();
    renderEvents();
    
    const form = document.getElementById('eventForm');
    if (form) form.reset();
    setDefaultDate();
}

function renderEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;

    let filteredEvents = [...events];
    
    if (currentFilter !== 'all') {
        filteredEvents = filteredEvents.filter(e => e.type === currentFilter);
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
    
    container.innerHTML = filteredEvents.map(event => {
        const dObj = new Date(event.date);
        const day = isNaN(dObj.getDate()) ? '' : dObj.getDate();
        const month = isNaN(dObj.getMonth()) ? '' : dObj.toLocaleDateString('vi-VN', { month: 'short' });
        
        return `
            <div class="event-item" data-id="${event.id}">
                <div class="event-date">
                    <div class="day">${day}</div>
                    <div class="month">${month}</div>
                </div>
                <div class="event-content">
                    <div class="event-title-row">
                        <h3 class="event-title">${escapeHtml(event.title)}</h3>
                        <span class="event-type ${event.type}">${getTypeLabel(event.type)}</span>
                    </div>
                    <div class="event-meta">
                        ${event.startTime ? `<span>🕐 ${escapeHtml(event.startTime)}${event.endTime ? ' - ' + escapeHtml(event.endTime) : ''}</span>` : ''}
                        <span>📅 ${escapeHtml(event.date)}</span>
                    </div>
                    ${event.description ? `<p class="event-desc">${escapeHtml(event.description)}</p>` : ''}
                    <div class="event-actions">
                        <button class="btn-delete" type="button" onclick="deleteEvent('${event.id}')">Xóa</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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
    const filterEl = document.getElementById('filterType');
    if (filterEl) currentFilter = filterEl.value;
    renderEvents();
}

function deleteEvent(id) {
    if (confirm('Xóa sự kiện này?')) {
        events = events.filter(e => e.id !== id);
        saveEvents();
        renderEvents();
    }
}

function clearAllEvents() {
    if (events.length === 0) return;
    if (confirm(`Xóa tất cả ${events.length} sự kiện?`)) {
        events = [];
        saveEvents();
        renderEvents();
    }
}

function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}
