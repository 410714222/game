const gameData = [
   // 原本的 gameData = [...] 刪掉，改成下面這樣
async function loadGames() {
    try {
        // 向後端請求資料
        const response = await fetch('http://localhost:3000/api/games');
        const gameData = await response.json();
        
        // 呼叫你原本寫好的渲染函數
        renderGames(gameData); 
    } catch (error) {
        console.error("抓取資料失敗:", error);
    }
}

// 網頁載入時執行
window.onload = loadGames;
];

window.onload = () => { renderGames(gameData); };

function renderGames(data) {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = data.map(game => `
        <div class="game-card" onclick="openModal(${game.id})">
            <img src="${game.img}">
            <div class="card-body">
                <h3>${game.title}</h3>
                <div class="tag"># ${game.category}</div>
            </div>
        </div>
    `).join('');
}

function filterGames(category, event) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    const filtered = (category === '全部') ? gameData : gameData.filter(g => g.category === category);
    renderGames(filtered);
}

function openModal(id) {
    const game = gameData.find(g => g.id === id);
    if (!game) return;
    document.getElementById('modal-title').innerText = game.title;
    document.getElementById('modal-desc').innerText = game.desc;
    document.getElementById('modal-video').src = game.video;
    document.getElementById('game-modal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // 禁止底層捲動
}

function closeModal() {
    document.getElementById('game-modal').style.display = 'none';
    document.getElementById('modal-video').src = "";
    document.body.style.overflow = 'auto';
}