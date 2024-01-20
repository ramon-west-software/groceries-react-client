import React, { FC } from "react";
import GroceryItemConponent from "./GroceryItemConponent";
import { GroceryItem, StorageArea } from "./Interfaces";

interface ContentProps {
  storageArea: StorageArea;
  handleGroceryItemClick: (categoryId: number, item: GroceryItem) => void;
}

const Content: FC<ContentProps> = ({ storageArea, handleGroceryItemClick }) => {
  return (
    <>
      {storageArea &&
        Array.isArray(storageArea.categories) &&
        storageArea.categories.map((category, index) => (
          <div className="main-card" key={index}>
            <div className="main-card-header">
              <div className="main-card-title"> {category.name}</div>
            </div>
            <div className="main-card-text-container">
              <GroceryItemConponent
                category={category}
                handleGroceryItemClick={handleGroceryItemClick}
              />
            </div>
          </div>
        ))}
      <div className="main-card" key={-1}>
        <div className="main-card-header">
          <div className="main-card-title"> Add Category</div>
        </div>
      </div>
    </>
  );
};

export default Content;
