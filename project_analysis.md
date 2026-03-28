# 餐廳 POS 與 KDS 系統框架分析報告 (SaaS Arquitecture)

本專案是一個基於網頁前端技術開發的「餐廳 POS (銷售點服務) 與 KDS (廚房顯示系統)」。系統已從單店版演進為 **SaaS 多租戶架構**，支援總公司統一管理多個商家租戶。系統不依賴傳統後端 Node.js/Java，而是徹底透過 Firebase Firestore 實現即時資料同步並由前端進行邏輯封裝。

## 🛠 技術堆疊 (Tech Stack)

*   **前端核心**: HTML5, CSS3, JavaScript (ES6+)。
*   **UI 框架**: React 18 (透過 UMD 載入)，搭配 `@babel/standalone` 在瀏覽器即時編譯 JSX。
*   **資料庫**: Firebase Firestore (v9 compat)，負責跨裝置即時事件流傳輸。
*   **登入與授權**: 儲存區本地憑證 (`localStorage`) 實作的無伺服器防禦（具備擴充 Firebase Auth 彈性）。
*   **多租戶架構**: 採用 Path-based 動態資料隔離 (`merchants/{merchantId}/...`)。
*   **PDF/報表**: 使用 `html2pdf.js` 產生實體營業報表與圖表。

---

## 📂 核心架構分析

系統設計分為三個層級：**總公司管理層**、**商家 SaaS 層**、以及**單店展示層**。

### 1. 總公司管理層 (Headquarters)
*   **`HQ_admin.html` (總公司管理後台)**:
    *   **超級管理員登入 (`HQLoginOverlay`)**: 提供專屬的科技風登入頁面防護，密碼憑證可於系統設定區動態修改。
    *   **商家與訂閱管理**: 建立/編輯新商家預設配置、權限控制，並管控訂閱方案 (Free, Pro, Enterprise) 與 30 天到期預警。
    *   **全平台真實即時營收聚合**: 不依賴假資料（以往），現在於端點自動建立全加盟商 `$mid/orders` 的並行監聽機制，能在前端瞬間匯聚「真實的今日訂單營收總和」，極具技術亮點。
    *   **系統級公告下發機制**: 修改總部變數後，寫入公共 Firestore `hq_core/settings` 以驅動各分店介面。

### 2. 商家 SaaS 層 (Multi-tenant SaaS)
此層級以 `_saas.html` 後綴命名，藉由讀取 URL Parameter `?mid=xxx` 決定其資料源 (`baseRef`)：
*   **`index_saas.html` (SaaS 點餐前台)**: 切換分店專屬菜單。具備**訂閱到期攔截**機制，若過期則鎖定系統，阻擋接單。
*   **`admin_saas.html` (SaaS 店長後台)**: 供商家管理員查閱單店的報表。具備全局 `useEffect` 即時監聽 `hq_core/settings`，實現總部公告以 `Banner` 形勢跨平台強勢推送功能。
*   **`kds_saas.html` (SaaS 廚房看板)**: 專屬廚房邏輯隔離，提高處理效能。

### 3. 單店展示層 (Demo)
原先的單一店面檔案已重新命名為 `_demo.html` 形式：
*   **`index_demo.html` / `admin_demo.html`**:
    *   為獨立店鋪開發與離線測試基礎樣板（或沒有使用 URL param 切換的分支），方便獨立除錯 POS 功能。提供跟 SaaS 一致的 UI 組件。

---

## 💾 資料結構 (Data Schema)

目前採用了 **「主幹-分支 (Trunk and Branch)」** 的 NoSQL 結構來符合前端查詢成本的最佳化：

- `hq_core/` (全局設定層)
    - `settings`: (總部名稱 `name`, 公告資訊 `announcement`, 更新時間戳 `updatedAt`)
- `merchants/` (SaaS 商家資料層)
    - `{merchantId}/` (Document)
        - `menu_items/` (Sub-collection) - 商品名稱、價格、客製化選項等。
        - `orders/` (Sub-collection) - 收銀機與 KDS 的核心溝通管道，具狀態機標記。
        - `settings/` (Sub-collection) - 單店設定檔：
            - `branding` / `category_order` / `staff` / `printer`。

---

## 🌟 系統亮點總結

1.  **無感架構切換 (Zero-downtime Pivot)**: 僅透過 `window.POSDatabase` 原型封裝與 `mid` 的網址變化，即將原本單一店鋪的 POS，進化擁有百家分店擴充能力的輕型 SaaS 系統。
2.  **分散式即時運算**: 成功運用前端的 JS 事件迴圈並行處理跨店的 Collection 資料聚合，在不使用 Firebase Cloud Functions 的情況下也能實作出具備高度正確性的管理大盤。
3.  **UI/UX 極致體驗設計**: 以觸控螢幕作為主要目標設計，實作了訂製化的毛玻璃 Modal 與 Alert 提示框，移除了破壞體驗的原生瀏覽器彈窗，全面邁向現代化商用設備佈局。
