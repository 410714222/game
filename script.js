let currentGameData = [];

// 1. 核心載入函數 (負責單一檔案與全部合併)
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
            // 合併 1 到 6 個檔案
            const files = ['data1.json', 'data2.json', 'data3.json', 'data4.json', 'data5.json', 'data6.json'];
            const promises = files.map(file => 
                fetch(`${file}?v=${timestamp}`).then(res => {
                    if (!res.ok) throw new Error(`找不到 ${file}`);
                    return res.json();
                })
            );
            const results = await Promise.all(promises);
            finalData = results.flat(); 
        } else {
            // 讀取指定的單一檔案
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

// 2. 渲染遊戲卡片 (唯一版本)
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

// 3. 視窗控制 (唯一版本)
function openModal(id) {
    const game = currentGameData.find(g => g.id == id);
    if (!game) return;
    
    document.getElementById('modal-title').innerText = game.title;
    document.getElementById('modal-desc').innerText = game.desc || "暫無介紹";
    document.getElementById('modal-video').src = game.video;
    document.getElementById('game-modal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // 防止背景捲動
}

function closeModal() {
    document.getElementById('game-modal').style.display = 'none';
    document.getElementById('modal-video').src = "";
    document.body.style.overflow = 'auto'; // 恢復背景捲動
}

// 4. 網頁啟動時預設顯示全部 (唯一版本)
window.onload = () => loadData('all');
