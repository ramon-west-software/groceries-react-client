import React, { useState, useEffect } from "react";
import MenuToggle from "./MenuToggle";
import Content from "./Content";
import CreateItems from "./CreateItems";
import {
  GroceryItem,
  StorageArea,
  UserData,
  Resource,
} from "./Interfaces";
import { useNavigate } from "react-router-dom";
import GroceryList from "../GroceryListComponent";
import CreateResourceForm from "./CreateResourceForm";

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

const type = `${import.meta.env.VITE_STORAGE_TITLE}`;
const defaultView = `${import.meta.env.VITE_DEFAULT_TITLE}`;

interface HomeProps {
  token: string | null;
  userId: number | null;
}

const Home: React.FC<HomeProps> = ({ token, userId }) => {
  // User
  const [userData, setUserData] = useState<UserData>(defaultData);
  // App states
  const navigate = useNavigate();
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Content state
  const [showContent, setShowContent] = useState(false);
  // Main content view state
  const [selectedView, setSelectedView] = useState(defaultView);
  // CreateItem vs GroceryList state
  const [showCreateItem, setShowCreateItem] = useState(false);
  // Show createResource component
  const [showCreateResource, setShowCreateResource] = useState(false);
  // Selected components to edit/create
  const [selectedArea, setSelectedArea] =
    useState<StorageArea>(defaultStorageArea);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedGroceryItem, setSelectedGroceryItem] =
    useState<GroceryItem | null>(null);

  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );

  // Event handlers
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleViewSelect = (view: string) => {
    // set header title
    if (view != selectedView) {
      setSelectedView(view);
      setShowContent(true);
    } else {
      setSelectedView(defaultView);
      setShowContent(false);
    }
    setShowCreateItem(false);

    const foundStorageArea = userData.storageAreas.find(
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

  const handleGroceryItemClick = (categoryId: number, item: GroceryItem) => {
    setShowCreateItem(true);
    setSelectedCategoryId(categoryId);
    setSelectedGroceryItem(item);
  };

  const handleCancelCreateItem = () => {
    setShowCreateItem(false);
  };

  const handleResourceClick = (resource: Resource) => {
    setShowCreateResource(true);
    setSelectedResource(resource);
  };

  const handleCancelCreateResource = () => {
    setShowCreateResource(false);
  };

  const handleRequest = async () => {
    if (token) {
      const getRequestOptions = {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      };

      try {
        const usersEndpoint = `${import.meta.env.VITE_SERVER}${
          import.meta.env.VITE_USER_ENDPOINT
        }/${userId}`;
        const response = await fetch(usersEndpoint, getRequestOptions);
        const json = await response.json();
        setUserData(json[0].userData);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    handleRequest();
  }, [token]);

  return (
    <>
      <div className="header">
        <button
          className="toggle-btn"
          onClick={() => {
            toggleSidebar();
          }}
        >
          <MenuToggle />
        </button>
        <h1>{selectedView}</h1>
      </div>
      <div className="container">
        <div className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
          {userData &&
            userData.storageAreas.map((storageArea, index) => (
              <div
                key={index}
                className="sidebar-card"
                onClick={() => {
                  handleViewSelect(storageArea.name);
                  toggleSidebar();
                  handleResourceClick({
                    type: type || "Error",
                    parentId: userId,
                    id: storageArea.id,
                    name: storageArea.name,
                    childResources: null,
                    purchaseDate: null,
                    expirationDate: null,
                  });
                }}
              >
                <div className="sidebar-card-title">{storageArea.name}</div>
              </div>
            ))}
          <div
            key={-1}
            className="sidebar-card"
            onClick={() => {
              handleResourceClick({
                type: type || "Error",
                parentId: userId,
                id: null,
                name: null,
                childResources: null,
                purchaseDate: null,
                expirationDate: null,
              });
            }}
          >
            <div className="sidebar-card-title">Add Storage Area</div>
            <div className="sidebar-card-footer"></div>
          </div>
        </div>
        <div className={`main-content ${isSidebarOpen ? "show" : ""}`}>
          {showContent && (
            <div className="main-card-container">
              {selectedArea.id != -1 && (
                <Content
                  storageArea={
                    selectedArea !== undefined
                      ? selectedArea
                      : defaultStorageArea
                  }
                  handleGroceryItemClick={handleGroceryItemClick}
                  handleResourceClick={handleResourceClick}
                />
              )}
            </div>
          )}

          {showCreateItem && (
            <div className="create-item-container">
              <CreateItems
                authToken={token || ""}
                categoryId={selectedCategoryId}
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
          {showCreateResource && (
            <div className="create-item-container">
              <CreateResourceForm
                authToken={token || ""}
                formTitle={selectedResource?.type || null}
                resource={selectedResource}
                triggerRefetch={() => {
                  setShowCreateResource(false);
                }}
                onCancel={handleCancelCreateResource}
              />
            </div>
          )}
          {
            <div className="grocery-list-container">
              <GroceryList groceryList={[]} />
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Home;
