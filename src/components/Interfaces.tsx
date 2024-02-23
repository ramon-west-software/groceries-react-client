export interface GroceryItem {
    id: number;
    name: string;
    purchaseDate: string;
    itemDuration: number;
  }

export interface Category {
    id: number;
    name: string;
    groceryItems: GroceryItem[];
}

export interface StorageArea {
    id: number;
    name: string;
    categories: Category[];
}  

export interface UserData {
    id: number;
    name: string;
    storageAreas: StorageArea[];
}

// Resource should replace GroceryItem, Category, and StorageArea
export interface Resource {
    type: string | null;
    parentId: number | null;
    id: number | null;
    name: string | null;
    childResources: Resource[] | null;
    purchaseDate: string | null;
    expirationDate: string | null;
  }