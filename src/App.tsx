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
  MantineProvider,
} from "@mantine/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { IconHome, IconSettings } from "@tabler/icons";
import { ChadContext } from "./store/chad-context";
import { HomePage } from "./pages/HomePage/HomePage";
import { ChadNavLinks } from "./navigation/ChadNavLinks";
import {
  sportsbookRoutes,
  supercontestRoutes,
  survivorRoutes,
} from "./navigation/ChadRoutes";
import { ChadNavLink } from "./navigation/ChadNavLink";
import {
  getSportsbookLinkData,
  getSupercontestLinkData,
  getSurvivorLinkData,
} from "./navigation/ChadLinkData";
import { SettingsPage } from "./pages/SettingsPage/SettingsPage";
import "./App.css";

declare var google: any;

const App = () => {
  const { isLoggedIn, username, useDarkMode, login, logout } =
    useContext(ChadContext);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  const theme = useMantineTheme();

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
          const chadResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/login`,
            {
              method: "PUT",
              headers: {
                Authorization: googleResponse.credential,
              },
            }
          );
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

  console.log(useDarkMode);
  const closeNavbarHandler = () => {
    setOpen(false);
  };

  return (
    <MantineProvider
      theme={useDarkMode ? { colorScheme: "dark" } : {}}
      withGlobalStyles
      withNormalizeCSS
    >
      <AppShell
        styles={
          useDarkMode
            ? {
                main: {
                  background: theme.colors.dark[6],
                },
              }
            : {
                main: {
                  background: theme.colors.gray[0],
                },
              }
        }
        header={
          <Header height={100} p="md">
            <div className="header">
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
                <Link to="/" style={{ textDecoration: "none" }}>
                  <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                    <Text
                      ml="xl"
                      className="chadsText"
                      style={{ color: useDarkMode ? "lightgray" : "black" }}
                    >
                      Chad's SuperBook
                    </Text>
                  </MediaQuery>
                </Link>
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
            style={{ zIndex: 101 }}
          >
            <Navbar.Section grow component={ScrollArea} type="never">
              <ChadNavLink
                to="/"
                label="Home"
                icon={<IconHome size={24} color="red" />}
                closeNavbar={closeNavbarHandler}
              />
              <ChadNavLinks
                closeNavbar={closeNavbarHandler}
                getLinkData={getSportsbookLinkData}
              />
              <ChadNavLinks
                closeNavbar={closeNavbarHandler}
                getLinkData={getSupercontestLinkData}
              />
              <ChadNavLinks
                closeNavbar={closeNavbarHandler}
                getLinkData={getSurvivorLinkData}
              />
              <ChadNavLink
                to="/settings"
                label="Settings"
                icon={<IconSettings size={24} color="gray" />}
                closeNavbar={closeNavbarHandler}
              />
              <div style={{ height: "10rem" }}></div>
            </Navbar.Section>
          </Navbar>
        }
      >
        <ToastContainer
          position="top-center"
          autoClose={2000}
          newestOnTop
          closeOnClick
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {sportsbookRoutes}
          {supercontestRoutes}
          {survivorRoutes}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
