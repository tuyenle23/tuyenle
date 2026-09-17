const TOOLS_STORAGE_KEY = 'personal_tools_links';

let tools = [];

const defaultTools = [
    // Windows
    { name: 'Windows 11 ISO (Microsoft)', category: 'windows', url: 'https://www.microsoft.com/software-download/windows11', desc: 'Trang tải chính thức Windows 11 từ Microsoft' },
    { name: 'Windows 10 ISO (Microsoft)', category: 'windows', url: 'https://www.microsoft.com/software-download/windows10', desc: 'Trang tải chính thức Windows 10 từ Microsoft' },
    { name: 'Rufus (Tạo USB boot)', category: 'windows', url: 'https://rufus.ie/', desc: 'Công cụ tạo USB boot cài Windows/Linux tốt nhất' },
    { name: 'Ventoy (Multi-boot USB)', category: 'windows', url: 'https://www.ventoy.net/', desc: 'Tạo USB multi-boot, kéo thả ISO là xong' },
    { name: 'Windows USB/DVD Download Tool', category: 'windows', url: 'https://www.microsoft.com/en-us/download/windows-usb-dvd-download-tool', desc: 'Công cụ chính thức Microsoft tạo USB cài Windows' },
    
    // Phone Apps
    { name: 'F-Droid (Kho app mở)', category: 'phone', url: 'https://f-droid.org/', desc: 'Kho ứng dụng FOSS cho Android, không quảng cáo' },
    { name: 'APKMirror', category: 'phone', url: 'https://www.apkmirror.com/', desc: 'Trang tải APK an toàn, kiểm tra chữ ký' },
    { name: 'APKPure', category: 'phone', url: 'https://apkpure.com/', desc: 'Kho APK lớn, có app bị gỡ trên Play Store' },
    { name: 'Termux (Terminal Linux)', category: 'phone', url: 'https://termux.dev/', desc: 'Môi trường Linux trên Android, không cần root' },
    { name: 'Magisk (Root Android)', category: 'phone', url: 'https://github.com/topjohnwu/Magisk', desc: 'Root systemless cho Android' },
    
    // Linux
    { name: 'Ubuntu Desktop', category: 'linux', url: 'https://ubuntu.com/download/desktop', desc: 'Phổ biến nhất, dễ dùng, hỗ trợ lâu dài (LTS)' },
    { name: 'Linux Mint', category: 'linux', url: 'https://linuxmint.com/download.php', desc: 'Dựa trên Ubuntu, giao diện Cinnamon quen thuộc Win' },
    { name: 'Fedora Workstation', category: 'linux', url: 'https://getfedora.org/', desc: 'Công nghệ mới nhất, kho phần mềm lớn' },
    { name: 'Debian', category: 'linux', url: 'https://www.debian.org/distrib/', desc: 'Ổn định nhất, cơ sở của Ubuntu/Mint' },
    { name: 'Arch Linux', category: 'linux', url: 'https://archlinux.org/download/', desc: 'Rolling release, cho người muốn tùy chỉnh tối đa' },
    { name: 'Kali Linux', category: 'linux', url: 'https://www.kali.org/get-kali/', desc: 'Chuyên cho bảo mật, pentesting' },
    { name: 'Pop!_OS', category: 'linux', url: 'https://pop.system76.com/', desc: 'Tối ưu cho developer, gaming, NVIDIA' },
    { name: 'Manjaro', category: 'linux', url: 'https://manjaro.org/download/', desc: 'Dựa trên Arch, dễ cài đặt hơn' },
    
    // Other
    { name: 'Chấm thi tự động', category: 'other', url: '#', desc: 'Công cụ chấm thi trắc nghiệm tự động' },
    { name: 'BalenaEtcher (Flash OS)', category: 'other', url: 'https://www.balenaetcher.com/', desc: 'Flash ISO ra USB/SD card, đa nền tảng' },
    { name: 'VirtualBox', category: 'other', url: 'https://www.virtualbox.org/', desc: 'Máy ảo miễn phí, chạy Linux/Win trên Win/Mac/Linux' },
    { name: 'VMware Workstation Player', category: 'other', url: 'https://www.vmware.com/products/workstation-player.html', desc: 'Máy ảo miễn phí cho cá nhân' },
    { name: 'WoeUSB-ng', category: 'other', url: 'https://github.com/WoeUSB/WoeUSB-ng', desc: 'Tạo USB cài Windows từ Linux' },
    { name: 'GitHub', category: 'other', url: 'https://github.com/', desc: 'Kho mã nguồn lớn nhất, tìm tool mã nguồn mở' },
];

document.addEventListener('DOMContentLoaded', () => {
    loadTools();
    renderTools();
    
    document.getElementById('addToolForm').addEventListener('submit', handleAddTool);
});

function loadTools() {
    try {
        const stored = localStorage.getItem(TOOLS_STORAGE_KEY);
        let storedTools = [];
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) storedTools = parsed;
        }
        
        const existingUrls = new Set(storedTools.map(t => t.url));
        const merged = [...storedTools];
        defaultTools.forEach((def, idx) => {
            if (!existingUrls.has(def.url)) {
                merged.unshift({ ...def, id: def.id || 'default-merged-' + idx });
            }
        });
        
        tools = merged.length > 0 ? merged : [...defaultTools];
        saveTools();
    } catch (e) {
        console.error('Lỗi đọc localStorage:', e);
        tools = [...defaultTools];
    }
}

function saveTools() {
    if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage(TOOLS_STORAGE_KEY, tools);
    } else {
        localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(tools));
    }
}

function renderTools() {
    const categories = {
        windows: { container: 'windowsTools', title: '🪟 Cài đặt Windows' },
        phone: { container: 'phoneApps', title: '📱 App điện thoại' },
        linux: { container: 'linuxDistros', title: '🐧 Các bản Linux' },
        other: { container: 'otherTools', title: '🔧 Công cụ hữu ích khác' }
    };
    
    Object.keys(categories).forEach(cat => {
        const catTools = tools.filter(t => t.category === cat);
        const container = document.getElementById(categories[cat].container);
        if (!container) return;
        
        if (catTools.length === 0) {
            container.innerHTML = '<div class="empty-tools"><p>Chưa có công cụ nào. Hãy thêm bên dưới!</p></div>';
            return;
        }
        
        container.innerHTML = catTools.map((tool, index) => `
            <div class="tool-card" data-id="${tool.id || 'default-' + index}">
                <div class="tool-card-header">
                    <h3 class="tool-name">${escapeHtml(tool.name)}</h3>
                    <span class="tool-category-badge ${tool.category}">${getCategoryLabel(tool.category)}</span>
                </div>
                ${tool.desc ? `<p class="tool-desc">${escapeHtml(tool.desc)}</p>` : ''}
                <div class="tool-url">${escapeHtml(tool.url)}</div>
                <div class="tool-actions">
                    <button class="btn-open" onclick="window.open('${escapeHtml(tool.url)}', '_blank')">Mở link</button>
                    <button class="btn-delete-tool" onclick="deleteTool('${tool.id || 'default-' + index}')">Xóa</button>
                </div>
            </div>
        `).join('');
    });
}

function getCategoryLabel(cat) {
    const labels = {
        windows: 'Windows',
        phone: 'Điện thoại',
        linux: 'Linux',
        other: 'Khác'
    };
    return labels[cat] || cat;
}

function handleAddTool(e) {
    e.preventDefault();
    
    const tool = {
        id: Date.now().toString(),
        name: document.getElementById('toolName').value.trim(),
        category: document.getElementById('toolCategory').value,
        url: document.getElementById('toolUrl').value.trim(),
        desc: document.getElementById('toolDesc').value.trim(),
        addedAt: new Date().toISOString()
    };
    
    if (!tool.name || !tool.url) {
        alert('Vui lòng nhập tên và link!');
        return;
    }
    
    try {
        new URL(tool.url);
    } catch {
        alert('Link không hợp lệ!');
        return;
    }
    
    tools.push(tool);
    saveTools();
    renderTools();
    resetToolForm();
}

function resetToolForm() {
    const form = document.getElementById('addToolForm');
    if (form) form.reset();
}

function deleteTool(id) {
    if (confirm('Xóa công cụ này?')) {
        tools = tools.filter(t => (t.id || '') !== id);
        saveTools();
        renderTools();
    }
}

function exportTools() {
    const data = {
        tools: tools,
        exportedAt: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tools-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importTools() {
    const input = document.getElementById('importToolsFile');
    if (input) input.click();
}

function handleToolsImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.tools && Array.isArray(data.tools)) {
                if (confirm(`Nhập ${data.tools.length} công cụ? Dữ liệu hiện tại sẽ bị ghi đè.`)) {
                    tools = data.tools;
                    saveTools();
                    renderTools();
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
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}