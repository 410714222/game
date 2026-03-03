// 核心變數：整個檔案只能出現這一次，解決 SyntaxError
let currentGameData = [];

// 1. 核心載入函數
async function loadData(target) {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '<div style="color:#00f2ff; padding:20px;">SYSTEM LOADING...</div>';

    try {
        let finalData = [];
        const timestamp = new Date().getTime(); 

        if (target === 'all') {
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
            const response = await fetch(`${target}?v=${timestamp}`);
            if (!response.ok) throw new Error(`找不到 ${target}`);
            finalData = await response.json();
        }

        currentGameData = finalData;
        renderGames(currentGameData);
    } catch (error) {
        grid.innerHTML = `<div style="color:red; padding:20px;">ERROR: ${error.message}</div>`;
    }
}

// 2. 渲染遊戲卡片
function renderGames(data) {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = ''; // 清空舊內容

    data.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${game.img}" onerror="this.src='https://via.placeholder.com/300?text=Image+Error'">
            <div class="card-body">
                <h3>${game.title}</h3>
                <div class="tag">${Array.isArray(game.category) ? game.category.map(c => `#${c}`).join(' ') : `#${game.category}`}</div>
            </div>
        `;
        // 使用 addEventListener 代替 onclick，解決 CSP 問題
        card.addEventListener('click', () => openModal(game.id));
        grid.appendChild(card);
    });
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

// 4. 初始化事件監聽
document.addEventListener('DOMContentLoaded', () => {
    // 綁定導覽按鈕
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadData(btn.getAttribute('data-target'));
        });
    });

    // 綁定關閉按鈕
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // 初始載入
    loadData('all');
});
