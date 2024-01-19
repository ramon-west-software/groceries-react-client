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
          data.map((item, index) => {
            // Format purchaseDate as MM/DD/YYYY
            const formattedDate = new Date(item.purchaseDate).toLocaleDateString('en-US');

            return (
              <ul key={index}>
                <li key={index}>
                  {item.name} <br />
                  Purchased: {formattedDate} <br />
                  Expires: {item.itemDuration} days after purchase.
                </li>
              </ul>
            );
          })}
      </div>
    </>
  );
};



export default GroceryItemConponent;