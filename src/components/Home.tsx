import React, { useState, useEffect } from "react";
import MenuToggle from "./MenuToggle";
import Content from "./Content";
import CreateItems from "./CreateItems";
import { GroceryItem, StorageArea, UserData } from "./Interfaces";

const defaultData: UserData = {
  id: 0,
  name: "Default",
  storageAreas: [],
};
const defaultStorageArea: StorageArea = {
  id: -1,
  name: "Default",
  categories: [{ id: -1, name: "", groceryItems: [] }],
};

const url = "http://localhost:8080/api/v1/users/3";

interface HomeProps {
  token: string | null;
}

const Home: React.FC<HomeProps> = ({ token }) => {
  // App states
  const [data, setData] = useState<UserData>(defaultData);
  const [selectedArea, setSelectedArea] =
    useState<StorageArea>(defaultStorageArea);
  const [selectedView, setSelectedView] = useState("Groceries");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedGroceryItem, setSelectedGroceryItem] =
    useState<GroceryItem | null>(null);

  // Event handlers
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleViewSelect = (view: string) => {
    // set header title
    if (view != selectedView ){
      setSelectedView(view);
    } else {
      setSelectedView("Groceries")
    }

    const foundStorageArea = data.storageAreas.find(
      (storageArea) => storageArea.name === view
    );

    if (foundStorageArea != selectedArea) {
      setSelectedArea(
        foundStorageArea && foundStorageArea.id != -1
          ? foundStorageArea
          : defaultStorageArea
      );
    } else {
      setSelectedArea(defaultStorageArea);
    }
    
  };

  const handleAddGroceryItemClick = () => {
    setShowCreateItem(true);
    setSelectedCategoryId(null);
  };

  const handleGroceryItemClick = (categoryId: number, item: GroceryItem) => {
    setShowCreateItem(true);
    setSelectedCategoryId(categoryId);
    setSelectedGroceryItem(item);
    console.log("Category ID: " + categoryId + "\nGrocery Item: " + item.name);
  };

  const handleCancelCreateItem = () => {
    setShowCreateItem(false);
  };

  useEffect(() => {
    const handleRequest = async () => {
      if (token) {
        const getRequestOptions = {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        };

        try {
          const response = await fetch(url, getRequestOptions);
          const json = await response.json();
          setData(json[0].userData);
        } catch (error) {
          console.error(error);
        }
      }
    };

    handleRequest();
  }, [token]);

  return (
    <>
      <div className="header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <MenuToggle />
        </button>
        <h1>{selectedView}</h1>
      </div>
      <div className="container">
        <div className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
          {data &&
            data.storageAreas.map((storageArea, index) => (
              <div
                key={index}
                className="sidebar-card"
                onClick={() => handleViewSelect(storageArea.name)}
              >
                <div className="sidebar-card-title"></div>
                <div className="sidebar-card-text">
                  <div className="fridge-icon"></div>
                </div>
                <div className="sidebar-card-footer">
                  <h3>{storageArea.name}</h3>
                </div>
              </div>
            ))}
          <div
            key={-1}
            className="sidebar-card"
            onClick={handleAddGroceryItemClick}
          >
            <div className="sidebar-card-title"></div>
            <div className="sidebar-card-text">
              <div className="fridge-icon"></div>
            </div>
            <div className="sidebar-card-footer">
              <h3>Add Storage Area</h3>
            </div>
          </div>
        </div>
        <div className={`main-content ${isSidebarOpen ? "show" : ""}`}>
          {selectedArea.id != -1 && (
          
            <div className="main-card-container">
              {selectedArea.id != -1 && (
                <Content
                  storageArea={
                    selectedArea !== undefined
                      ? selectedArea
                      : defaultStorageArea
                  }
                  handleGroceryItemClick={handleGroceryItemClick}
                />
              )}
            </div>
          
        )}

        {showCreateItem && (
          <div className="create-item-container">
            <CreateItems
              authToken={token || ""}
              userId={data.id.toString()}
              groceryItem={
                selectedGroceryItem !== null
                  ? {
                      id: -1,
                      name: "",
                      purchaseDate: "",
                      itemDuration: 0,
                    }
                  : null
              }
              triggerRefetch={() => {
                setShowCreateItem(false);
              }}
              onCancel={handleCancelCreateItem}
            />
          </div>
        )}
        {!showCreateItem && <div>Grocery List</div>}
        </div>
      </div>
    </>
  );
};

export default Home;
