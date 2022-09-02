import { useState, useEffect, useContext } from "react";
import { Link, Route, Routes } from "react-router-dom";
import {
  AppShell,
  Button,
  Navbar,
  Header,
  ScrollArea,
  MediaQuery,
  Burger,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { IconHome } from "@tabler/icons";
import { useGetAllUsernames } from "./hooks/useGetAllUsernames";
import { useGetCurrentWeekNumber } from "./hooks/useGetCurrentWeekNumber";
import { AuthContext } from "./store/auth-context";
import { HomePage } from "./pages/HomePage/HomePage";
import { SportsbookLinks, SupercontestLinks } from "./navigation/ChadNavLinks";
import { sportsbookRoutes, supercontestRoutes } from "./navigation/ChadRoutes";
import "./App.css";
import { ChadNavLink } from "./navigation/ChadNavLink";

declare var google: any;

const App = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  const { isLoggedIn, username, login, logout } = useContext(AuthContext);

  const theme = useMantineTheme();

  const { data: allUsernames } = useGetAllUsernames();
  const { data: currentWeekNumber } = useGetCurrentWeekNumber();

  useEffect(() => {
    if (!isGoogleLoaded) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = () => setIsGoogleLoaded(true);
      document.body.appendChild(script);
    } else {
      if (!isLoggedIn) {
        const callbackFunction = async (googleResponse: {
          credential: string;
        }) => {
          const chadResponse = await fetch("http://localhost:8080/login", {
            method: "PUT",
            headers: {
              Authorization: googleResponse.credential,
            },
          });
          if (chadResponse.ok) {
            const userInfo = await chadResponse.json();
            login(googleResponse.credential, userInfo);
          } else {
            alert("Error signing in");
          }
        };

        google.accounts.id.initialize({
          client_id:
            "345501740434-jo29djgbs63avb1v8kqm3ftv4k865aqs.apps.googleusercontent.com",
          callback: callbackFunction,
        });

        google.accounts.id.renderButton(document.getElementById("signInDiv"), {
          theme: "outline",
          size: "large",
        });

        google.accounts.id.prompt();
      }
    }
  }, [isGoogleLoaded, isLoggedIn, login]);

  const closeNavbarHandler = () => {
    setOpen(false);
  };

  if (!allUsernames || !currentWeekNumber) {
    return null;
  }

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colors.gray[0],
        },
      }}
      header={
        <Header height={100} p="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={open}
                  onClick={() => setOpen((open) => !open)}
                  size="md"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Link to="/">
                <img src={require("./assets/gigachad.png")} alt="logo" />
              </Link>
              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Text
                  ml="xl"
                  style={{
                    fontStyle: "italic",
                    fontWeight: "bold",
                    fontSize: "2rem",
                  }}
                >
                  Chad's SuperBook&#8482;
                </Text>
              </MediaQuery>
            </div>
            {!isLoggedIn && <div id="signInDiv" />}
            {isLoggedIn && (
              <div>
                <div className="signedInAs">{username}</div>
                <Button
                  variant="gradient"
                  gradient={{ from: "teal", to: "blue" }}
                  className="button"
                  onClick={logout}
                >
                  <span style={{ fontWeight: "bold" }}>Sign out</span>
                </Button>
              </div>
            )}
          </div>
        </Header>
      }
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!open}
          width={{ sm: 220, lg: 300 }}
        >
          <Navbar.Section
            style={{ marginBottom: "1rem" }}
            grow
            component={ScrollArea}
          >
            <ChadNavLink
              to="/"
              label="Home"
              icon={<IconHome size={24} color="green" />}
              closeNavbar={closeNavbarHandler}
            />
            <SportsbookLinks closeNavbar={closeNavbarHandler} />
            <SupercontestLinks closeNavbar={closeNavbarHandler} />
          </Navbar.Section>
        </Navbar>
      }
    >
      <ToastContainer
        position="top-center"
        autoClose={3000}
        newestOnTop
        closeOnClick
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {sportsbookRoutes}
        {supercontestRoutes}
      </Routes>
    </AppShell>
  );
};

export default App;
