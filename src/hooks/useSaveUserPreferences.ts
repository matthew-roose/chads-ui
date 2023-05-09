import { useMutation } from "@tanstack/react-query";
import { UserPreferences } from "../types/UserPreferences";

interface SaveUserPreferencesRequest {
  googleJwt: string;
  userPreferences: UserPreferences;
}

const saveUserPreferences = async (
  request: SaveUserPreferencesRequest
): Promise<UserPreferences> =>
  fetch(`${process.env.REACT_APP_API_URL}/user-preferences`, {
    body: JSON.stringify(request.userPreferences),
    method: "PUT",
    headers: {
      Authorization: request.googleJwt,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export const useSaveUserPreferences = () =>
  useMutation((request: SaveUserPreferencesRequest) =>
    saveUserPreferences(request)
  );
