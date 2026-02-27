const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // 讓伺服器看得懂 JSON 格式

// 1. 連結到資料庫 (這裡用本地 MongoDB)
mongoose.connect('mongodb://localhost:27017/gameDB')
    .then(() => console.log("資料庫連結成功！"))
    .catch(err => console.log("連結失敗:", err));

// 2. 定義遊戲資料的「格式」
const gameSchema = new mongoose.Schema({
    title: String,
    category: String,
    img: String,
    video: String,
    desc: String
});
const Game = mongoose.model('Game', gameSchema);

// 3. 建立 API 路由：讓前端可以抓資料
app.get('/api/games', async (req, res) => {
    const allGames = await Game.find(); // 從資料庫撈出所有東西
    res.json(allGames);
});

// 啟動伺服器在 3000 端口
app.listen(3000, () => {
    console.log('後端伺服器運行在 http://localhost:3000');
});