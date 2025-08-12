interface LoadCartTabsResult {
  tabs: any[];
  activeTabId: number;
  nextTabId: number;
}

interface ShopData {
  id: string;
  name: string;
  products?: any[];
  categories?: any[];
  cartTabs?: any[];
  activeTabId?: number;
  nextTabId?: number;
  timestamp?: number;
}

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  discount: number;
  product_name?: string;
}

export interface Order {
  offline_id: string;
  user_id: number;
  discount: number;
  total: number;
  payment_method: string;
  items: OrderItem[];
  timestamp?: number; // Optional timestamp for when order was created
}

interface ShopOrders {
  shop_id: string;
  orders: Order[];
}

interface OrderDb {
  amount: string;
  cashier_name: string;
  customer: string;
  date: string;
  item_discount: string;
  item_name: string;
  order_id: number;
  payment_status: string;
  payment_type: string;
  quantity: string;
}

interface ShopOrdersDb {
  shop_id: string;
  orders: OrderDb[];
}

class IndexedDBManager {
  private dbName: string;
  private version: number;
  private db: IDBDatabase | null;

  constructor() {
    this.dbName = "PosTerminalDB";
    this.version = 6;
    this.db = null;
  }

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store for shops (main store that contains everything)
        if (!db.objectStoreNames.contains("shops")) {
          db.createObjectStore("shops", { keyPath: "id" });
        }

        // Store for shop-specific products
        if (!db.objectStoreNames.contains("shopProducts")) {
          db.createObjectStore("shopProducts", { keyPath: "shopId" });
        }

        // Store for shop-specific categories
        if (!db.objectStoreNames.contains("shopCategories")) {
          db.createObjectStore("shopCategories", { keyPath: "shopId" });
        }

        // Store for shop-specific cart tabs
        if (!db.objectStoreNames.contains("shopCartTabs")) {
          db.createObjectStore("shopCartTabs", { keyPath: "shopId" });
        }

        // Store for global app state (non-shop specific)
        if (!db.objectStoreNames.contains("appState")) {
          db.createObjectStore("appState", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("shopOrders")) {
          db.createObjectStore("shopOrders", { keyPath: "shop_id" });
        }
        if (!db.objectStoreNames.contains("ordersDb")) {
          db.createObjectStore("ordersDb", { keyPath: "shop_id" });
        }

        // Store for users (cached from API)
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "key" });
        }

        if (!db.objectStoreNames.contains("userShops")) {
          db.createObjectStore("userShops", { keyPath: "userId" });
        }

        // Clean up old stores if they exist (for migration)
        if (db.objectStoreNames.contains("cartTabs")) {
          db.deleteObjectStore("cartTabs");
        }
        if (db.objectStoreNames.contains("products")) {
          db.deleteObjectStore("products");
        }
        if (db.objectStoreNames.contains("categories")) {
          db.deleteObjectStore("categories");
        }
      };
    });
  }

  async getDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  // Shop Methods (Main shop management)
  async saveShop(shop: ShopData): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["shops"], "readwrite");
    const store = transaction.objectStore("shops");

    return new Promise((resolve, reject) => {
      const request = store.put({
        ...shop,
        timestamp: Date.now(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveShops(shops: ShopData[]): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["shops"], "readwrite");
    const store = transaction.objectStore("shops");

    return new Promise((resolve, reject) => {
      // Clear existing shops first
      store.clear();

      let completed = 0;
      const total = shops.length;

      if (total === 0) {
        resolve();
        return;
      }

      shops.forEach((shop) => {
        const request = store.put({
          ...shop,
          timestamp: Date.now(),
        });

        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        };

        request.onerror = () => reject(request.error);
      });
    });
  }

  async loadShop(shopId: string): Promise<ShopData | null> {
    const db = await this.getDB();
    const transaction = db.transaction(["shops"], "readonly");
    const store = transaction.objectStore("shops");

    return new Promise((resolve, reject) => {
      const request = store.get(shopId);
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async loadAllShops(): Promise<ShopData[]> {
    const db = await this.getDB();
    const transaction = db.transaction(["shops"], "readonly");
    const store = transaction.objectStore("shops");

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Shop-specific Products Methods
  async saveShopProducts(shopId: string, products: any[]): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["shopProducts"], "readwrite");
    const store = transaction.objectStore("shopProducts");

    return new Promise((resolve, reject) => {
      const request = store.put({
        shopId,
        data: products,
        timestamp: Date.now(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async loadShopProducts(shopId: string): Promise<any[] | null> {
    const db = await this.getDB();
    const transaction = db.transaction(["shopProducts"], "readonly");
    const store = transaction.objectStore("shopProducts");

    return new Promise((resolve, reject) => {
      const request = store.get(shopId);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Shop-specific Categories Methods
  async saveShopCategories(shopId: string, categories: any[]): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["shopCategories"], "readwrite");
    const store = transaction.objectStore("shopCategories");

    return new Promise((resolve, reject) => {
      const request = store.put({
        shopId,
        data: categories,
        timestamp: Date.now(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async loadShopCategories(shopId: string): Promise<any[] | null> {
    const db = await this.getDB();
    const transaction = db.transaction(["shopCategories"], "readonly");
    const store = transaction.objectStore("shopCategories");

    return new Promise((resolve, reject) => {
      const request = store.get(shopId);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Shop-specific Cart Tabs Methods
  async saveShopCartTabs(
    shopId: string,
    tabs: any[],
    activeTabId: number,
    nextTabId: number
  ): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["shopCartTabs"], "readwrite");
    const store = transaction.objectStore("shopCartTabs");

    return new Promise((resolve, reject) => {
      const request = store.put({
        shopId,
        tabs,
        activeTabId,
        nextTabId,
        timestamp: Date.now(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async loadShopCartTabs(shopId: string): Promise<LoadCartTabsResult> {
    const db = await this.getDB();
    const transaction = db.transaction(["shopCartTabs"], "readonly");
    const store = transaction.objectStore("shopCartTabs");

    return new Promise((resolve, reject) => {
      const request = store.get(shopId);
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          resolve({
            tabs: result.tabs || [],
            activeTabId: result.activeTabId || 1,
            nextTabId: result.nextTabId || 2,
          });
        } else {
          resolve({
            tabs: [],
            activeTabId: 1,
            nextTabId: 2,
          });
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ==================== ORDER MANAGEMENT METHODS ====================

  // Add a new order to a shop
  async addOrder(shopId: string, order: Order): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["shopOrders"], "readwrite");
    const store = transaction.objectStore("shopOrders");

    return new Promise((resolve, reject) => {
      // First, get existing orders for this shop
      const getRequest = store.get(shopId);

      getRequest.onsuccess = () => {
        const existing = getRequest.result;
        const orderWithTimestamp = {
          ...order,
          timestamp: order.timestamp || Date.now(),
        };

        let shopOrders: ShopOrders;

        if (existing) {
          // Shop exists, add order to existing orders array
          shopOrders = {
            shop_id: shopId,
            orders: [...existing.orders, orderWithTimestamp],
          };
        } else {
          // New shop, create new orders array
          shopOrders = {
            shop_id: shopId,
            orders: [orderWithTimestamp],
          };
        }

        // Save updated shop orders
        const putRequest = store.put(shopOrders);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getShopOrders(shopId: string): Promise<Order[]> {
    // console.log("Requested shopId:", shopId);
    // console.log("shopId type:", typeof shopId);
    const db = await this.getDB();
    const transaction = db.transaction(["shopOrders"], "readonly");
    const store = transaction.objectStore("shopOrders");

    return new Promise((resolve, reject) => {
      // const getAllKeysRequest = store.getAllKeys();
      // getAllKeysRequest.onsuccess = () => {
      //   const allKeys = getAllKeysRequest.result;
      //   console.log(allKeys);
      // };
      // console.log(shopId);
      const request = store.get(shopId);
      // console.log(request);
      request.onsuccess = () => {
        const result = request.result;
        // console.log(result);
        resolve(result ? result.orders : []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteShopOrders(shopId: string): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["shopOrders"], "readwrite");
    const store = transaction.objectStore("shopOrders");

    return new Promise((resolve, reject) => {
      const request = store.delete(shopId);
      request.onsuccess = () => resolve;
      request.onerror = () => reject(request.error);
    });
  }

  async getShopOrderCount(shopId: string): Promise<number> {
    const orders = await this.getShopOrders(shopId);
    return orders.length;
  }

  async saveOrdersDb(shopId: string, orders: OrderDb[]): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["ordersDb"], "readwrite");
    const store = transaction.objectStore("ordersDb");

    return new Promise((resolve, reject) => {
      const shopOrders: ShopOrdersDb = {
        shop_id: shopId,
        orders: orders,
      };

      const putRequest = store.put(shopOrders);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    });
  }

  async addOrderDb(shopId: string, order: OrderDb): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["ordersDb"], "readwrite");
    const store = transaction.objectStore("ordersDb");

    return new Promise((resolve, reject) => {
      // First, get existing orders for this shop
      const getRequest = store.get(shopId);

      getRequest.onsuccess = () => {
        const existing = getRequest.result;

        let shopOrders: ShopOrdersDb;

        if (existing) {
          // Shop exists, add order to existing orders array
          shopOrders = {
            shop_id: shopId,
            orders: [...existing.orders, order],
          };
        } else {
          // New shop, create new orders array
          shopOrders = {
            shop_id: shopId,
            orders: [order],
          };
        }

        // Save updated shop orders
        const putRequest = store.put(shopOrders);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getOrdersDb(shopId: string): Promise<OrderDb[]> {
    const db = await this.getDB();
    const transaction = db.transaction(["ordersDb"], "readonly");
    const store = transaction.objectStore("ordersDb");

    return new Promise((resolve, reject) => {
      const request = store.get(shopId);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.orders : []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Users Management Methods
  async saveUsers(users: any[]): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
      const usersData = {
        key: "cachedUsers",
        data: users,
        timestamp: Date.now(),
      };

      const request = store.put(usersData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedUsers(): Promise<any[] | null> {
    const db = await this.getDB();
    const transaction = db.transaction(["users"], "readonly");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
      const request = store.get("cachedUsers");
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Check if cache is still valid (24 hours)
          const cacheAge = Date.now() - result.timestamp;
          const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours

          if (cacheAge < maxCacheAge) {
            resolve(result.data);
          } else {
            resolve(null); // Cache expired
          }
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearCachedUsers(): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");

    return new Promise((resolve, reject) => {
      const request = store.delete("cachedUsers");
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // User Shops
  async saveUserShops(userId: string, shops: any[]): Promise<void> {
    const db = await this.getDB();
    const transaction = db.transaction(["userShops"], "readwrite");
    const store = transaction.objectStore("userShops");

    return new Promise((resolve, reject) => {
      const userShopsData = {
        userId,
        shops,
      };

      const request = store.put(userShopsData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUserShops(userId: string): Promise<any[]> {
    const db = await this.getDB();
    const transaction = db.transaction(["userShops"], "readonly");
    const store = transaction.objectStore("userShops");

    return new Promise((resolve, reject) => {
      const request = store.get(userId);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.shops : []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Check if we're offline
  isOffline() {
    return !navigator.onLine;
  }
}

const indexedDBManager = new IndexedDBManager();
export default indexedDBManager;
