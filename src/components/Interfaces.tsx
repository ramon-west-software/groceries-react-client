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