import { FC } from "react";
import { GroceryItem, Category } from "./Interfaces";

interface GroceryItemsProps {
  category: Category;
  handleGroceryItemClick: (categoryId: number, item: GroceryItem) => void;
}

const GroceryItemComponent: FC<GroceryItemsProps> = ({
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
                onClick={() =>
                  handleGroceryItemClick(category.id, {
                    id: item.id,
                    name: item.name,
                    purchaseDate: item.purchaseDate,
                    itemDuration: item.itemDuration,
                  })
                }
              >
                <li key={index}>
                  {item.name} <br />
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
              itemDuration: 0,
            })
          }
        >
          <li>Add Grocery Item</li>
        </ul>
      </div>
    </>
  );
};

export default GroceryItemComponent;
