let currentGameData = [];

// 1. 核心載入函數
async function loadData(target, event) {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '<div style="color:#00f2ff; padding:20px;">SYSTEM LOADING...</div>';

    // 處理按鈕高亮
    if (event) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }

    try {
        let finalData = [];
        const timestamp = new Date().getTime(); 

        if (target === 'all') {
            // 讀取全部 5 個檔案
            const files = ['data1.json', 'data2.json', 'data3.json', 'data4.json', 'data5.json', 'data6.json];
            const promises = files.map(file => 
                fetch(`${file}?v=${timestamp}`).then(res => {
                    if (!res.ok) throw new Error(`找不到 ${file}`);
                    return res.json();
                })
            );
            const results = await Promise.all(promises);
            finalData = results.flat(); 
        } else {
            // 讀取單一檔案
            const response = await fetch(`${target}?v=${timestamp}`);
            if (!response.ok) throw new Error(`找不到 ${target}`);
            finalData = await response.json();
        }

        currentGameData = finalData;
        renderGames(currentGameData);

    } catch (error) {
        grid.innerHTML = `<div style="color:red; padding:20px;">ERROR: ${error.message}</div>`;
        console.error("讀取失敗:", error);
    }
}

// 2. 渲染遊戲卡片
function renderGames(data) {
    const grid = document.getElementById('game-grid');
    if (!data || data.length === 0) {
        grid.innerHTML = '<div style="color:white; padding:20px;">無資料</div>';
        return;
    }

    grid.innerHTML = data.map(game => `
        <div class="game-card" onclick="openModal(${game.id})">
            <img src="${game.img}" onerror="this.src='https://via.placeholder.com/300?text=Image+Error'">
            <div class="card-body">
                <h3>${game.title}</h3>
                <div class="tag">${Array.isArray(game.category) ? game.category.map(c => `#${c}`).join(' ') : `#${game.category}`}</div>
            </div>
        </div>
    `).join('');
}

// 3. 視窗控制
function openModal(id) {
    const game = currentGameData.find(g => g.id == id);
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

// 網頁啟動時自動跑「全部」
window.onload = () => loadData('all');

// 渲染畫面
function renderGames(data) {
    const grid = document.getElementById('game-grid');
    if (data.length === 0) {
        grid.innerHTML = '<div style="color:white; padding:20px;">無資料</div>';
        return;
    }

    grid.innerHTML = data.map(game => `
        <div class="game-card" onclick="openModal(${game.id})">
            <img src="${game.img}" onerror="this.src='https://via.placeholder.com/300?text=Image+Error'">
            <div class="card-body">
                <h3>${game.title}</h3>
                <div class="tag">${Array.isArray(game.category) ? game.category.map(c => `#${c}`).join(' ') : `#${game.category}`}</div>
            </div>
        </div>
    `).join('');
}

// Modal 控制 (保持原樣)
function openModal(id) {
    const game = currentGameData.find(g => g.id === id);
    if (!game) return;
    document.getElementById('modal-title').innerText = game.title;
    document.getElementById('modal-desc').innerText = game.desc;
    document.getElementById('modal-video').src = game.video;
    document.getElementById('game-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('game-modal').style.display = 'none';
    document.getElementById('modal-video').src = "";
}

// 預設載入全部
window.onload = () => loadData('all');



