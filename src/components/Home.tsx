import React, { useState, useEffect } from "react";
import MenuToggle from "./MenuToggle";
import Content from "./Content";
import { StorageArea, UserData } from "./Interfaces";

// default empty intefaces
const defaultData: UserData = {
  id: 0,
  name: "Default",
  storageAreas: [],
};
const defaultStorageArea: StorageArea = {
  id: 0,
  name: "Default",
  categories: [],
};

// HTTP constants, todo: move to a property file
const url = "http://192.168.0.135:8080/api/v1/users/3";

interface HomeProps {
  token: string | null;
}

const Home: React.FC<HomeProps> = ({ token }) => {
  // Component state variables
  const [data, setData] = useState<UserData>(defaultData);
  const [selectedArea, setSelectedArea] =
    useState<StorageArea>(defaultStorageArea);
  const [selectedView, setSelectedView] = useState("Groceries"); // Default view
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Functions to handle state changes
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // when a storage area is selected, find it in the data object and call setSelectedArea useState()
  const handleViewSelect = (view: string) => {
    setSelectedView(view);

    const foundStorageArea = data.storageAreas.find(
      (storageArea) => storageArea.name === view
    );

    // set userData.StorageArea[i] if found, otherwise set default Storage Area
    setSelectedArea(
      foundStorageArea !== undefined ? foundStorageArea : defaultStorageArea
    );
  };

  useEffect(() => {
    const handleRequest = async () => {
      // Check if the token is available before making the request
      if (token) {
        const getRequestOptions = {
          method: "GET",
          headers: {
            // 'User-Agent': 'insomnia/8.4.5',
            Authorization: `${token}`, // Use the token obtained from login
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

    handleRequest(); // Trigger the handleRequest function when the component is mounted or when the token changes
  }, [token]); // The effect depends on the token, so it will run when the token changes

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
                <div className="card-title"></div>
                <div className="card-text">
                  <div className="fridge-icon"></div>
                </div>
                <div className="card-footer">
                  <h3>{storageArea.name}</h3>
                </div>
              </div>
            ))}
        </div>
        <div className={`main-content ${isSidebarOpen ? "show" : ""}`}>
          <div className="main-card">
            {/* Render the content based on the selected view  */}
            {
              <Content
                data={
                  selectedArea !== undefined
                    ? selectedArea.categories
                    : defaultStorageArea.categories
                }
              />
            }
          </div>
          
        </div>
        <div className="create-item-container">placement holder for create items</div>
      </div>
    </>
  );
};

export default Home;
