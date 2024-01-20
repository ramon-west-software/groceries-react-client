import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { UserData, GroceryItem } from "./Interfaces";

interface CreateItemsProps {
  authToken: string;
  userId: string;
  groceryItem?: GroceryItem | null;
  triggerRefetch: () => void;
  onCancel: () => void;
}

const ITEM_ENDPOINT = "http://localhost:8080/api/v1/items";

const CreateItems: React.FC<CreateItemsProps> = ({
  authToken,
  userId,
  groceryItem,
  triggerRefetch,
  onCancel,
}) => {
  const [itemId, setItemId] = useState<number | null>(groceryItem?.id || null);
  const [itemName, setItemName] = useState<string>(groceryItem?.name || "");
  const [purchaseDate, setPurchaseDate] = useState<string>(
    groceryItem?.purchaseDate || ""
  );
  const [itemDuration, setItemDuration] = useState<string>(
    groceryItem?.itemDuration.toString() || ""
  );
  const [isDataReady, setIsDataReady] = useState<boolean>(false);

  const createResource = async (url: string, data: object, method: string) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create/update resource: ${response.status} - ${errorData.message}`
        );
      }

      const responseData = await response.json();
      console.log("Resource created/updated:", responseData);
      triggerRefetch();
      onCancel();
    } catch (error) {
      console.error("Error creating/updating resource:", (error as Error).message);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = {
      userId,
      itemId: itemId,
      name: itemName,
      itemDuration: parseInt(itemDuration, 10),
      purchaseDate,
    };

    if (groceryItem !== null && groceryItem !== undefined) {
      const updatedItemData = { ...groceryItem, ...data };
      await createResource(
        `${ITEM_ENDPOINT}/${groceryItem.id}`,
        updatedItemData,
        "PUT"
      );
    } else {
      await createResource(ITEM_ENDPOINT, data, "POST");
    }
  };

  useEffect(() => {
    if (groceryItem) {
      setItemId(groceryItem.id);
      setItemName(groceryItem.name);
      setPurchaseDate(groceryItem.purchaseDate);
      setItemDuration(groceryItem.itemDuration.toString());
      setIsDataReady(true);
    }
  }, [groceryItem]);

  if (!isDataReady) {
    return null; // or loading state
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
              {groceryItem ? "Update" : "Submit"}
            </button>

            <button type="button" onClick={onCancel} className="login-form-input">
              Cancel
            </button>
          </form>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default CreateItems;
