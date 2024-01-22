import React, { useState, useEffect } from "react";
import MenuToggle from "./MenuToggle";
import Content from "./Content";
import CreateItems from "./CreateItems";
import { GroceryItem, StorageArea, UserData } from "./Interfaces";
import { useNavigate } from "react-router-dom";

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

const url = "http://localhost:8080";
const userEndpoint = "/api/v1/users/";
const userId = "3";
const defaultView = "Groceries";

interface HomeProps {
  token: string | null;
}

const Home: React.FC<HomeProps> = ({ token }) => {
  // App states
  const navigate = useNavigate();
  const [data, setData] = useState<UserData>(defaultData);
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Main content view state
  const [selectedView, setSelectedView] = useState(defaultView);
  // CreateItem vs GroceryList state
  const [showCreateItem, setShowCreateItem] = useState(false);
  // Selected components to edit/create
  const [selectedArea, setSelectedArea] =
    useState<StorageArea>(defaultStorageArea);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedGroceryItem, setSelectedGroceryItem] =
    useState<GroceryItem | null>(null);

  // Event handlers
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    isSidebarOpen? handleViewSelect(selectedView) : handleViewSelect(defaultView);
  };

  const handleViewSelect = (view: string) => {
    // set header title
    if (view != selectedView ){
      setSelectedView(view);
    } else {
      setSelectedView(defaultView);
    }
    setShowCreateItem(false);

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
          const response = await fetch(url + userEndpoint + userId, getRequestOptions);
          const json = await response.json();
          setData(json[0].userData);
        } catch (error) {
          console.error(error);
          navigate("/login");
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
                      id: selectedGroceryItem.id,
                      name: selectedGroceryItem.name,
                      purchaseDate: selectedGroceryItem.purchaseDate,
                      itemDuration: selectedGroceryItem.itemDuration,
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
