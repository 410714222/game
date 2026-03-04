let currentGameData = [];

// 1. 讀取 Excel 並轉換為 JSON 的工具函數
async function fetchExcel(fileName) {
    const timestamp = new Date().getTime();
    const response = await fetch(`${fileName}?v=${timestamp}`);
    if (!response.ok) throw new Error(`無法讀取 ${fileName}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // 轉換成 JSON
    return XLSX.utils.sheet_to_json(worksheet);
}

// 2. 核心載入邏輯
async function loadData(target) {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '<div style="color:#00f2ff; padding:20px; font-family:Orbitron;">DATABASE SYNCHRONIZING...</div>';

    try {
        let finalData = [];
        if (target === 'all') {
            // 同時抓取 data1 到 data6
            const files = ['data1.xlsx', 'data2.xlsx', 'data3.xlsx', 'data4.xlsx', 'data5.xlsx', 'data6.xlsx'];
            const promises = files.map(file => fetchExcel(file));
            const results = await Promise.all(promises);
            finalData = results.flat(); // 合併所有表格資料
        } else {
            // 抓取單一 Excel
            finalData = await fetchExcel(target);
        }

        currentGameData = finalData;
        renderGames(currentGameData);

    } catch (error) {
        grid.innerHTML = `<div style="color:red; padding:20px;">ERROR: ${error.message}</div>`;
        console.error(error);
    }
}

// 3. 渲染卡片 (保持原本的 CSS 結構)
function renderGames(data) {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = ''; 

    data.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${game.img}" onerror="this.src='https://via.placeholder.com/1000x562?text=Image+Missing'">
            <div class="card-body">
                <h3>${game.title}</h3>
                <div class="tag"># ${game.category || 'Game'}</div>
            </div>
        `;
        card.addEventListener('click', () => openModal(game.id));
        grid.appendChild(card);
    });
}

// 4. 視窗控制
function openModal(id) {
    // 因為 Excel 讀進來 ID 通常是數字，使用 == 比較安全
    const game = currentGameData.find(g => g.id == id);
    if (!game) return;
    
    document.getElementById('modal-title').innerText = game.title;
    document.getElementById('modal-desc').innerText = game.desc || "";
    document.getElementById('modal-video').src = game.video; // 記得 Excel 裡的網址要是 /embed/ 格式
    document.getElementById('game-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('game-modal').style.display = 'none';
    document.getElementById('modal-video').src = "";
    document.body.style.overflow = 'auto';
}

// 5. 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 綁定按鈕事件
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // 注意：這裡 HTML 裡的 data-target 要改為 .xlsx 結尾
            loadData(btn.getAttribute('data-target'));
        });
    });

    // 綁定關閉
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    loadData('all');
});
