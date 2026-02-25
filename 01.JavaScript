function showDetail(gameId) {
   在實際專案中，這裡會根據 gameId 去後端資料庫抓資料
  alert(你點擊了 ID 為  + gameId +  的遊戲！n接下來系統會跳轉到詳情頁，並加載 YouTube 影片與文字介紹。);
  
   範例跳轉：window.location.href = `game-detail.htmlid=${gameId}`;
}