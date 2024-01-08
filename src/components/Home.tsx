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
const loginurl = "http://192.168.0.135:8080/api/v1/login";
const username = "Rex";
const password = "pass";
const basicAuthHeader = "Basic " + btoa(username + ":" + password);

const Home: React.FC = () => {
  // Component state variables
  const [token, setToken] = useState('');
  const [data, setData] = useState<UserData>(defaultData);
  const [selectedArea, setSelectedArea] =
    useState<StorageArea>(defaultStorageArea);
  const [selectedView, setSelectedView] = useState("Log in"); // Default view
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

  // 1st useEffect, gets JWT token
  // TODO: move into LOGIN component, 
  useEffect(() => {
    const login = async () => {
      const loginOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.4.5' },
        body: JSON.stringify({ username: 'Rex', password: 'password' })
      };

      try {
        const response = await fetch(loginurl, loginOptions);
        const data = await response.json();
        setToken(data.token); // Save the token to state
      } catch (error) {
        console.error(error);
      }
    };

    login(); // Trigger the login function when the component is mounted
  }, []); // The empty dependency array ensures that this effect runs only once, equivalent to componentDidMount
 
  // 2nd useEffect triggered when token is changed
  useEffect(() => {
    const handleRequest = async () => {
      // Check if the token is available before making the request
      if (token) {
        const getRequestOptions = {
          method: 'GET',
          headers: {
            // 'User-Agent': 'insomnia/8.4.5',
            Authorization: `${token}` // Use the token obtained from login
          }
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
        <h1>My Kitchen - {selectedView}</h1>
      </div>
      <div className="">
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
    </>
  );
};

export default Home;