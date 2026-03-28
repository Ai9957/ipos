# 🚀 智慧 iPOS 餐廳管理系統 (多租戶 SaaS 架構)

這是一個基於 **Serverless** 架構開發的輕量化「餐廳銷售點系統 (POS)」與「總部管理系統 (HQ)」。系統經過全面重構，已從單一店面升級為 **SaaS (軟體即服務) 多租戶架構**。採用 React + Firebase 構建，具備極速同步與強大的後端管理功能，適合從單店營運到連鎖加盟快速部署。

## 🌟 系統亮點
- **SaaS 總公司平台 (`HQ_admin.html`)**：具備安全登入保護、分店訂閱管理、權限控制，以及**跨店真實營收即時動態加總**。
- **全域公告發布功能**：總部修改系統設定或公告後，利用 Firebase 即時推送至所有分店後台，顯示高對比度的動態橫幅。
- **即時同步 (Real-time Sync)**：利用 Firebase Firestore 實現跨裝置（櫃台、內場、店長手機、總部）秒級同步。
- **Serverless 架構**：無需架設伺服器，直接透過前端連網即可使用，實現極低成本營運。

## 🛠 技術堆疊
- **核心框架**: React 18 (via UMD CDN)
- **資料庫/即時通訊**: Firebase Firestore (NoSQL, 即時連線)
- **樣式設計**: Vanilla CSS (現代化動態介面與毛玻璃設計效果)
- **架構特點**: Path-based 資料隔離 (`merchants/{mid}/`)

## 📂 系統架構簡介
1.  **總部營運管理中心 (`HQ_admin.html`)**
    *   **超級管理員防護**：獨立高質感登入頁面與憑證管理。
    *   **即時營運大盤**：自動建立各分店資料庫監聽，即時累加今日全平台真實營收。
    *   **一鍵公告發布**：發行跨平台維護公告。
2.  **前台點餐系統 (Demo 版: `index_demo.html`, SaaS 版: `index_saas.html`)**
    *   SaaS 版可根據 URL `?mid=` 自動載入專屬店面的菜單與標籤。
3.  **分店店長後台 (Demo 版: `admin_demo.html`, SaaS 版: `admin_saas.html`)**
    *   **權限控制**：根據角色開放專屬功能。
    *   **總部聯動**：接收總部系統公告 Banner 與訂閱到期預警資訊。
4.  **廚房看板 KDS (`kds.html` / `kds_saas.html`)**
    *   免登入展示待製訂單，具備動態顏色條超時警示。

## 🚀 部署與啟動
1.  **Firebase 配置**：
    系統程式內已有設定 Firebase Config 的邏輯，請替換為您專屬的專案金鑰。
2.  **直接執行**：
    本系統為純前端靜態應用架構，可直接將專案目錄放置於 GitHub Pages、Vercel 或任何 Web Hosting 進行對外服務，**無須繁雜的後端環境部署**。

## 📝 備註
- 此專案架構由 **Antigravity (Google DeepMind)** 輔助建構與效能調校。
- 專案程式碼具備高度模組化且完全在瀏覽器端運行 JSX (`Babel.standalone`)。
