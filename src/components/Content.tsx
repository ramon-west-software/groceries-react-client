import { FC } from "react";
import GroceryItemComponent from "./GroceryItemComponent";
import { GroceryItem, Resource, StorageArea } from "./Interfaces";

interface ContentProps {
  storageArea: StorageArea;
  handleGroceryItemClick: (categoryId: number, item: GroceryItem) => void;
  handleResourceClick: (resource: Resource) => void;
}

const type = `${import.meta.env.VITE_CATEGORY_TITLE}`;

const Content: FC<ContentProps> = ({
  storageArea,
  handleGroceryItemClick,
  handleResourceClick,
}) => {
  return (
    <>
      {storageArea &&
        Array.isArray(storageArea.categories) &&
        storageArea.categories.map((category, index) => (
          <div className="main-card" key={index}>
            <div
              className="main-card-header"
              onClick={() =>
                handleResourceClick({
                  type: type || "Error",
                  parentId: storageArea.id,
                  id: category.id,
                  name: category.name,
                  childResources: null,
                  purchaseDate: null,
                  expirationDate: null,
                })
              }
            >
              <div className="main-card-title"> {category.name}</div>
            </div>
            <div className="main-card-text-container">
              <GroceryItemComponent
                category={category}
                handleGroceryItemClick={handleGroceryItemClick}
              />
            </div>
          </div>
        ))}
      <div className="main-card" key={-1}>
        <div
          className="main-card-header"
          onClick={() =>
            handleResourceClick({
              type: type || "Error",
              parentId: storageArea.id,
              id: null,
              name: null,
              childResources: null,
              purchaseDate: null,
              expirationDate: null,
            })
          }
        >
          <div className="main-card-title"> Add Category</div>
        </div>
      </div>
    </>
  );
};

export default Content;
