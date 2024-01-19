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
          <div className="main-card" key={index}>
          
            <div className="main-card-header">
              <div className="main-card-title"> {category.name}</div>
            </div>
            {category.groceryItems && (
              <div className="main-card-text-container">
                <GroceryItemConponent data={category.groceryItems} />
              </div>
            )}
            
           </div>
        ))}
    </>
  );
};


export default Content;
