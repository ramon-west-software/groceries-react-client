import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";

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
  return (
    <>
      <div className="grocery-list-card">
        <div className="grocery-list-card-header">
          <div className="grocery-list-card-title"> Grocery List</div>
        </div>
        <div className="grocery-list-card-text-container">
          <div className="grocery-list-card-text">groceries . . .</div>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default GroceryList;
