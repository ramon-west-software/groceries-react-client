import React, { useState, ChangeEvent, FormEvent } from "react";
import { UserData, StorageArea, Category, GroceryItem } from "./Interfaces";

// TODO: USE THIS FOR ADD/EDIT STORAGE, CATEGORY, AND ITEMS
interface CreateItemsProps {
  authToken: string;
}

// TODO: add jwt token to props, add 'data' to props for data.userId, add triggerRefetch method to props to retrigger useEffect

const STORAGE_ENDPOINT = "http://localhost:8080/api/v1/storageAreas";
const CATEGORY_ENDPOINT = "http://localhost:8080/api/v1/categories";
const ITEM_ENDPOINT = "http://localhost:8080/api/v1/items";

const CreateItems: React.FC<CreateItemsProps> = ({ authToken }) => {
  const [storageName, setStorageName] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [itemName, setItemName] = useState<string>("");
  const [purchaseDate, setPurchaseDate] = useState<string>("");
  const [itemDuration, setItemDuration] = useState<string>("");

  const createResource = async (url: string, data: object) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create resource: ${response.status} - ${errorData.message}`
        );
      }

      const responseData = await response.json();
      console.log("Resource created:", responseData);
    } catch (error) {
      console.error("Error creating resource:", (error as Error).message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (storageName && !categoryName && !itemName) {

      const storageData = {
        userId: 3,
        name: storageName,
      };

      console.log(storageData);
      // await createResource(STORAGE_ENDPOINT, storageData);
    } else if (storageName && categoryName && !itemName) {
      const categoryData = {
        userId: 3,
        storageId: 4,
        name: categoryName,
      };
      console.log(categoryData);
      // await createResource(CATEGORY_ENDPOINT, categoryData);
    } else if (storageName && categoryName && itemName) {
      const groceryItemData = {
        userId: 3,
        storageId: 4,
        categoryId: 18,
        name: itemName,
        itemDuration: parseInt(itemDuration, 10),
        purchaseDate,
      };
      console.log(groceryItemData);
      // await createResource(ITEM_ENDPOINT, groceryItemData);
    } else {
      console.error("Invalid input");
    }
  };

  type DataType = "StorageArea" | "Category" | "GroceryItem";

  function findItemByName(
    userData: UserData,
    itemName: string,
    dataType: DataType
  ): StorageArea | Category | GroceryItem | null {
    
      if (userData && userData.storageAreas) {
        for (const storageArea of userData.storageAreas) {
          if (storageArea.name === itemName && dataType === "StorageArea") {
            return storageArea;
          }

          if (storageArea.categories) {
            for (const category of storageArea.categories) {
              if (category.name === itemName && dataType === "Category") {
                return category;
              }

              if (category.groceryItems && dataType === "GroceryItem") {
                const groceryItem = category.groceryItems.find(
                  (item) => item.name === itemName
                );
                if (groceryItem) {
                  return groceryItem;
                }
              
            }
          }
        }
      }
    }

    return null;
  }

  return (
    <>
      <div className="main-card">
        <div className="main-card-header">
          <div className="main-card-title"> New Item</div>
        </div>
        <div className="main-card-text-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Storage Name:
              <input
                type="text"
                className="login-form-input"
                value={storageName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setStorageName(e.target.value)
                }
              />
            </label>
            <br />

            <label>
              Category Name:
              <input
                type="text"
                className="login-form-input"
                value={categoryName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCategoryName(e.target.value)
                }
              />
            </label>
            <br />

            <label>
              Item Name:
              <input
                type="text"
                className="login-form-input"
                value={itemName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setItemName(e.target.value)
                }
              />
            </label>
            <br />

            <label>
              Purchase Date:
              <input
                type="date"
                className="login-form-input"
                value={purchaseDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPurchaseDate(e.target.value)
                }
              />
            </label>
            <br />

            <label>
              Item Duration:
              <input
                type="number"
                className="login-form-input"
                value={itemDuration}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setItemDuration(e.target.value)
                }
              />
            </label>
            <br />

            <button type="submit" className="login-form-input">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default CreateItems;
