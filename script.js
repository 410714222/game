// 建立一個變數存放目前載入的資料
let currentGameData = [];

/**
 * 核心功能：載入資料
 * @param {string} fileName - 檔案名稱 (如 data1.json)
 * @param {Event} event - 點擊事件 (選填)
 */
async function loadData(fileName, event = null) {
    const grid = document.getElementById('game-grid');
    
    // 1. 顯示載入中狀態 (對使用者比較友善)
    grid.innerHTML = '<div style="color:var(--neon-cyan); padding:20px;">SYSTEM LOADING...</div>';

    // 2. 處理按鈕高亮
    if (event) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }

    try {
        // 3. 抓取 JSON (增加快取控制防止舊資料干擾)
        const response = await fetch(fileName + '?v=' + new Date().getTime());
        
        if (!response.ok) throw new Error(`找不到檔案: ${fileName}`);
        
        currentGameData = await response.json();
        
        // 4. 執行渲染
        renderGames(currentGameData);
        console.log(`成功讀取: ${fileName}`, currentGameData);

    } catch (error) {
        grid.innerHTML = `<div style="color:red; padding:20px;">ERROR: 無法讀取數據庫 (${fileName})</div>`;
        console.error("讀取失敗原因:", error);
    }
}

// 渲染卡片到 HTML
function renderGames(data) {
    const grid = document.getElementById('game-grid');
    
    if (data.length === 0) {
        grid.innerHTML = '<div style="color:white; padding:20px;">此分類目前無資料</div>';
        return;
    }

    grid.innerHTML = data.map(game => `
        <div class="game-card" onclick="openModal(${game.id})">
            <img src="${game.img}" onerror="this.src='https://via.placeholder.com/300?text=Image+Error'">
            <div class="card-body">
                <h3>${game.title}</h3>
                <div class="tag"># ${game.category || 'Game'}</div>
            </div>
        </div>
    `).join('');
}

// 視窗控制
function openModal(id) {
    const game = currentGameData.find(g => g.id === id);
    if (!game) return;

    document.getElementById('modal-title').innerText = game.title;
    document.getElementById('modal-desc').innerText = game.desc || "暫無介紹";
    document.getElementById('modal-video').src = game.video;
    document.getElementById('game-modal').style.display = 'block';
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    document.getElementById('game-modal').style.display = 'none';
    document.getElementById('modal-video').src = "";
    document.body.style.overflow = 'auto';
}

// 網頁開啟時，預設執行讀取 data1.json
window.addEventListener('DOMContentLoaded', () => {
    loadData('data1.json');
});