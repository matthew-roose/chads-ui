import React, { useState, useCallback, PropsWithChildren } from "react";

interface UserInfo {
  username: string;
  firstName: string;
  lastName: string;
}

export const AuthContext = React.createContext({
  googleJwt: "",
  isLoggedIn: false,
  username: "",
  firstName: "",
  lastName: "",
  login: (googleJwt: string, userInfo: UserInfo) => {},
  logout: () => {},
});

const retrieveLocalStorage = () => {
  const storedGoogleJwt = localStorage.getItem("googleJwt");
  const storedUsername = localStorage.getItem("username");
  const storedFirstName = localStorage.getItem("firstName");
  const storedLastName = localStorage.getItem("lastName");

  return {
    googleJwt: storedGoogleJwt,
    username: storedUsername,
    firstName: storedFirstName,
    lastName: storedLastName,
  };
};

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const storedData = retrieveLocalStorage();

  let initialGoogleJwt;
  let initialUsername;
  let initialFirstName;
  let initialLastName;

  if (storedData) {
    initialGoogleJwt = storedData.googleJwt;
    initialUsername = storedData.username;
    initialFirstName = storedData.firstName;
    initialLastName = storedData.lastName;
  }

  const [googleJwt, setGoogleJwt] = useState(initialGoogleJwt);
  const [username, setUsername] = useState(initialUsername);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);

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

  const contextValue = {
    googleJwt: googleJwt || "",
    isLoggedIn: isLoggedIn,
    username: username || "",
    firstName: firstName || "",
    lastName: lastName || "",
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
