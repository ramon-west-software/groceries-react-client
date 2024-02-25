import React from "react";

interface GroceryListProps {
  groceryList: string[];
  //   triggerRefetch: () => void;
  //   onCancel: () => void;
}

const GroceryList: React.FC<GroceryListProps> = ({
  groceryList,
  //   triggerRefetch,
  //   onCancel,
}) => {
  groceryList = ["hard coded list", "eggs", "butter", "milk"];
  return (
    <>
      <div className="grocery-list-card">
        <div className="grocery-list-card-header">
          <div className="grocery-list-card-title"> Grocery List</div>
        </div>
        <div className="grocery-list-card-text-container">
          <div className="grocery-list-card-text">
            {Array.isArray(groceryList) &&
              groceryList.map((item, index) => {
                return (
                  <ul key={index}>
                    <li key={index}>
                      {item}
                    </li>
                  </ul>
                );
              })}
          </div>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default GroceryList;
