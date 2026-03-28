/**
 * 獨立商店存取金鑰 (Merchant Access Key) 清單
 * 
 * 說明：
 * 1. 本檔案用於區分各商店後台與 KDS 的存取權限。
 * 2. 請在下方 MERCHANT_KEYS 物件中，新增您的商店 ID 與對應的金鑰。
 * 3. 注意：金鑰僅用於前端初步隔離，請避免對外公開。
 */
window.MERCHANT_KEYS = {
  "demo": "123456",
  // "store-id": "access-key"
};
