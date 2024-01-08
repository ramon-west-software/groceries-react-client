import { FC } from "react";
import { GroceryItem } from "./Interfaces";

interface GroceryItemsProps {
  data: GroceryItem[];
}

const GroceryItemConponent: FC<GroceryItemsProps> = ({ data }) => {
  return (
    <>
      <div className="main-card-text">
        {data &&
          Array.isArray(data) &&
          data.map((item, index) => (
            <ul key={index}>
              <li key={index}>
                {item.name} - Purchased {item.purchaseDate} - Good for{" "}
                {item.duration} days since purchase
              </li>
            </ul>
          ))}
      </div>
    </>
  );
};

export default GroceryItemConponent;