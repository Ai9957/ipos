// db.js
// 這裡準備了 Firebase 的連線架構。若您有申請 Firebase 金鑰，請填入下方設定。
// 為了讓您在沒有金鑰的情況下也能立刻體驗 KDS 即時接單的魔力，
// 當設定檔空白時，系統會自動使用 LocalStorage 進行免設定的「跨分頁即時同步模擬（Offline DB）」。

window.POSDatabase = (function() {
  const firebaseConfig = {
    apiKey: "AIzaSyDTsrdVcwm7mi2aGoexNG4QqcEyn6JFqpw", 
    authDomain: "project-a60e1765-a61e-40db-82e.firebaseapp.com", 
    projectId: "project-a60e1765-a61e-40db-82e",
  };

  let dbMode = 'local';
  let dbInstance = null;

  // 動態檢查是否有 Firebase 的 CDN 與金鑰設定
  if (firebaseConfig.apiKey && typeof firebase !== 'undefined') {
    console.log("Using Firebase Realtime Backend...");
    firebase.initializeApp(firebaseConfig);
    dbInstance = firebase.firestore();
    dbMode = 'firebase';
  } else {
    console.log("Using Offline Sync (LocalStorage) for unconfigured demonstration.");
  }

  const saveOrder = async (orderInfo) => {
    const newOrder = {
      ...orderInfo,
      status: 'pending', // 狀態: pending (準備中), completed (已完成)
      createdAt: new Date().toISOString()
    };

    if (dbMode === 'firebase') {
      await dbInstance.collection('orders').add(newOrder);
    } else {
      newOrder.id = 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      const orders = JSON.parse(localStorage.getItem('pos_orders') || '[]');
      orders.push(newOrder);
      localStorage.setItem('pos_orders', JSON.stringify(orders));
      window.dispatchEvent(new CustomEvent('local-db-update'));
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    if (dbMode === 'firebase') {
      await dbInstance.collection('orders').doc(orderId).update({ status });
    } else {
      const orders = JSON.parse(localStorage.getItem('pos_orders') || '[]');
      const index = orders.findIndex(o => o.id === orderId);
      if (index !== -1) {
        orders[index].status = status;
        localStorage.setItem('pos_orders', JSON.stringify(orders));
        window.dispatchEvent(new CustomEvent('local-db-update'));
      }
    }
  };

  const subscribeToOrders = (callback) => {
    if (dbMode === 'firebase') {
      return dbInstance.collection('orders')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
          const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          callback(orders);
        });
    } else {
      const emitCallback = () => {
        const orders = JSON.parse(localStorage.getItem('pos_orders') || '[]');
        callback(orders.reverse());
      };
      
      const storageListener = (e) => {
        if (e.key === 'pos_orders') emitCallback();
      };
      
      window.addEventListener('storage', storageListener);
      window.addEventListener('local-db-update', emitCallback);
      
      emitCallback();
      
      return () => {
        window.removeEventListener('storage', storageListener);
        window.removeEventListener('local-db-update', emitCallback);
      };
    }
  };

  return { saveOrder, updateOrderStatus, subscribeToOrders };
})();
