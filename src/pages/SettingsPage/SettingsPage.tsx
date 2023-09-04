import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChadContext } from "../../store/chad-context";
import {
  Button,
  NativeSelect,
  Switch,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import {
  IconSun,
  IconMoonStars,
  IconBuildingBroadcastTower,
} from "@tabler/icons";
import classes from "./SettingsPage.module.css";
import { useGetUserPreferences } from "../../hooks/useGetUserPreferences";
import { useSaveUserPreferences } from "../../hooks/useSaveUserPreferences";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";

export const SettingsPage = () => {
  const { googleJwt, useDarkMode, toggleDarkMode } = useContext(ChadContext);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [carrier, setCarrier] = useState<string | null>(null);
  const [optInNewGamesNotification, setOptInNewGamesNotification] = useState<
    boolean | null
  >(null);
  const [optInMissingPicksNotification, setOptInMissingPicksNotification] =
    useState<boolean | null>(null);
  const [hasTriedToSubmit, setHasTriedToSubmit] = useState(false);

  const { data: savedUserPreferences, refetch: refetchUserPreferences } =
    useGetUserPreferences(googleJwt);

  const saveUserPreferences = useSaveUserPreferences();

  const theme = useMantineTheme();

  useEffect(() => {
    if (savedUserPreferences) {
      setPhoneNumber(savedUserPreferences.phoneNumber);
      setCarrier(savedUserPreferences.carrier || "Verizon");
      setOptInNewGamesNotification(
        savedUserPreferences.optInNewGamesNotification
      );
      setOptInMissingPicksNotification(
        savedUserPreferences.optInMissingPicksNotification
      );
    }
  }, [savedUserPreferences]);

  const phoneNumberErrorMessage =
    hasTriedToSubmit && !/^[1-9]\d{2}-\d{3}-\d{4}$/.test(phoneNumber || "")
      ? "Should be xxx-xxx-xxxx."
      : undefined;

  const haveUserPreferencesChanged =
    savedUserPreferences &&
    (phoneNumber !== savedUserPreferences.phoneNumber ||
      carrier !== savedUserPreferences.carrier ||
      optInNewGamesNotification !==
        savedUserPreferences.optInNewGamesNotification ||
      optInMissingPicksNotification !==
        savedUserPreferences.optInMissingPicksNotification);

  return (
    <div className={classes.page}>
      <Helmet>
        <title>Chad's | Settings</title>
      </Helmet>
      <div className={classes.title}>Settings</div>
      <Switch
        style={{ fontWeight: "bold" }}
        label="Dark Mode"
        color={theme.colorScheme === "dark" ? "gray" : "dark"}
        onLabel={
          <IconSun size="1rem" stroke={2.5} color={theme.colors.yellow[4]} />
        }
        offLabel={
          <IconMoonStars
            size="1rem"
            stroke={2.5}
            color={theme.colors.blue[6]}
          />
        }
        size="lg"
        checked={useDarkMode ? true : false}
        onChange={() => toggleDarkMode()}
        styles={() => ({
          body: {
            alignItems: "center",
          },
        })}
      />
      <div
        style={{ marginTop: "70px", marginBottom: "50px" }}
        className={classes.title}
      >
        Notification Preferences
      </div>
      {!googleJwt ? (
        <div
          style={{
            textAlign: "center",
            fontSize: "20px",
          }}
        >
          Please log in to set notification preferences.
        </div>
      ) : !savedUserPreferences ? (
        <LoadingSpinner />
      ) : (
        <>
          <div>
            <Switch
              style={{ fontWeight: "bold" }}
              label="Receive a text when new games are uploaded"
              color="green"
              onLabel="ON"
              offLabel="OFF"
              size="lg"
              checked={optInNewGamesNotification || false}
              onChange={(event) =>
                setOptInNewGamesNotification(event.currentTarget.checked)
              }
              styles={() => ({
                body: {
                  alignItems: "center",
                  margin: "0 10px",
                },
              })}
            />
            <Switch
              style={{
                fontWeight: "bold",
                marginTop: "1rem",
              }}
              label="Receive a text Saturday if I haven't made my picks"
              color="green"
              onLabel="ON"
              offLabel="OFF"
              size="lg"
              checked={optInMissingPicksNotification || false}
              onChange={(event) =>
                setOptInMissingPicksNotification(event.currentTarget.checked)
              }
              styles={() => ({
                body: {
                  alignItems: "center",
                  margin: "0 10px",
                },
              })}
            />
          </div>
          <TextInput
            style={{ marginTop: "2rem", width: "220px" }}
            placeholder="xxx-xxx-xxxx"
            label="Phone number (U.S. only)"
            size="md"
            withAsterisk
            error={phoneNumberErrorMessage}
            value={phoneNumber || ""}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
          <NativeSelect
            style={{ marginTop: "1rem", width: "220px" }}
            data={["Verizon", "AT&T", "T-Mobile", "Sprint"]}
            label="Carrier"
            icon={<IconBuildingBroadcastTower size="1rem" />}
            size="md"
            withAsterisk
            value={carrier || ""}
            onChange={(event) => setCarrier(event.target.value)}
          />
          <Button
            style={{ marginTop: "2rem" }}
            disabled={
              phoneNumber === null ||
              carrier === null ||
              !haveUserPreferencesChanged
            }
            variant="gradient"
            gradient={{ from: "teal", to: "lime" }}
            className={classes.button}
            onClick={() => {
              if (!/^[1-9]\d{2}-\d{3}-\d{4}$/.test(phoneNumber || "")) {
                setHasTriedToSubmit(true);
                return;
              }
              toast
                .promise(
                  saveUserPreferences.mutateAsync({
                    googleJwt,
                    userPreferences: {
                      phoneNumber,
                      carrier,
                      optInNewGamesNotification,
                      optInMissingPicksNotification,
                    },
                  }),
                  {
                    pending: "Saving your preferences...",
                    success: "Successfully saved your preferences!",
                    error: "Error saving your preferences!",
                  }
                )
                .then(() => refetchUserPreferences());
            }}
          >
            Save
          </Button>
        </>
      )}
    </div>
  );
};
