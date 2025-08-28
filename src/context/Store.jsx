import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext();

async function getUser(setUser) {
  try {
    const token = localStorage.getItem("token");
    console.log(token+" store"); 

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/`,
      {},   
      {
        headers: {
          Authorization: `Bearer ${token}`,  
          "Content-Type": "application/json"
        }
      }
    );
    console.log(response.data.user);
    setUser(response.data.user);
  }
  catch (error) {
    setUser(null);
    console.log(error);
  }
}

function Store({ children }) {
  const [user, setUser] = useState(null);

  useEffect(()=>{
      getUser(setUser);
  },[]);
  

  return (
    <StoreContext.Provider value={{ user, setUser }}>
      {children}
    </StoreContext.Provider>
  );
}

export default Store;
