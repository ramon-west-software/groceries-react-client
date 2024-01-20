import { FC } from "react";
import { GroceryItem, Category } from "./Interfaces";

interface GroceryItemsProps {
  category: Category;
  handleGroceryItemClick: (categoryId: number, item: GroceryItem) => void;
}

const GroceryItemConponent: FC<GroceryItemsProps> = ({
  category,
  handleGroceryItemClick,
}) => {
  return (
    <>
      <div className="main-card-text">
        {category &&
          Array.isArray(category.groceryItems) &&
          category.groceryItems.map((item, index) => {
            const formattedDate = new Date(
              item.purchaseDate
            ).toLocaleDateString("en-US");
            return (
              <ul
                key={index}
                onClick={() => handleGroceryItemClick(category.id, item)}
              >
                <li key={index}>
                  {item.id} - {item.name} <br />
                  Purchased: {formattedDate} <br />
                  Expires: {item.itemDuration} days after purchase.
                </li>
              </ul>
            );
          })}
        <ul
          onClick={() =>
            handleGroceryItemClick(category.id, {
              id: -1,
              name: "",
              purchaseDate: "",
              itemDuration: -1,
            })
          }
        >
          <li>Add Grocery Item</li>
        </ul>
      </div>
    </>
  );
};

export default GroceryItemConponent;
