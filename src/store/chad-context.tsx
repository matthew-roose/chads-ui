import React, { useState, useCallback, PropsWithChildren } from "react";

interface UserInfo {
  username: string;
  firstName: string;
  lastName: string;
}

export const ChadContext = React.createContext({
  googleJwt: "",
  isLoggedIn: false,
  username: "",
  firstName: "",
  lastName: "",
  useDarkMode: "",
  login: (googleJwt: string, userInfo: UserInfo) => {},
  logout: () => {},
  toggleDarkMode: () => {},
});

const retrieveLocalStorage = () => {
  const storedGoogleJwt = localStorage.getItem("googleJwt");
  const storedUsername = localStorage.getItem("username");
  const storedFirstName = localStorage.getItem("firstName");
  const storedLastName = localStorage.getItem("lastName");
  const storedUseDarkMode = localStorage.getItem("useDarkMode");

  return {
    googleJwt: storedGoogleJwt,
    username: storedUsername,
    firstName: storedFirstName,
    lastName: storedLastName,
    useDarkMode: storedUseDarkMode,
  };
};

export const ChadContextProvider = ({ children }: PropsWithChildren) => {
  const storedData = retrieveLocalStorage();

  const [googleJwt, setGoogleJwt] = useState(storedData.googleJwt);
  const [username, setUsername] = useState(storedData.username);
  const [firstName, setFirstName] = useState(storedData.firstName);
  const [lastName, setLastName] = useState(storedData.lastName);
  const [useDarkMode, setUseDarkMode] = useState(storedData.useDarkMode);

  const isLoggedIn = !!googleJwt;

  const logoutHandler = useCallback(() => {
    setGoogleJwt(null);
    setUsername(null);
    setFirstName(null);
    setLastName(null);
    localStorage.removeItem("googleJwt");
    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    window.location.reload();
  }, []);

  const loginHandler = (googleJwt: string, userInfo: UserInfo) => {
    setGoogleJwt(googleJwt);
    setUsername(userInfo.username);
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    localStorage.setItem("googleJwt", googleJwt);
    localStorage.setItem("username", userInfo.username);
    localStorage.setItem("firstName", userInfo.firstName);
    localStorage.setItem("lastName", userInfo.lastName);
    window.location.reload();
  };

  const toggleDarkModeHandler = () => {
    setUseDarkMode((prevUseDarkMode) => (!prevUseDarkMode ? "true" : ""));
    localStorage.setItem(
      "useDarkMode",
      localStorage.getItem("useDarkMode") ? "" : "true"
    );
  };

  const contextValue = {
    googleJwt: googleJwt || "",
    isLoggedIn: isLoggedIn,
    username: username || "",
    firstName: firstName || "",
    lastName: lastName || "",
    useDarkMode: useDarkMode || "",
    login: loginHandler,
    logout: logoutHandler,
    toggleDarkMode: toggleDarkModeHandler,
  };

  return (
    <ChadContext.Provider value={contextValue}>{children}</ChadContext.Provider>
  );
};
