import { FC } from "react";
import GroceryItemConponent from "./GroceryItemConponent";
import { Category } from "./Interfaces";

interface ContentProps {
  data: Category[];
}

const Content: FC<ContentProps> = ({ data }) => {
  return (
    <>
      {data &&
        Array.isArray(data) &&
        data.map((category, index) => (
          <div className="main-card-container"key={index}>
            <div className="main-card-header">
              <div className="main-card-title"> {category.name}</div>
            </div>
            <div className="main-card-text-container">
              <GroceryItemConponent
                data={category.groceryItems}
              ></GroceryItemConponent>
            </div>
          </div>
        ))}
    </>
  );
};

export default Content;
