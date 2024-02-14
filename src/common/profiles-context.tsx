import React, { createContext, useContext, useEffect, useReducer } from "react";
import { ActionType, ProfilesContextType } from "./types";
import profilesReducer from "../reducer/profilesReducer";
import { useAuth } from "./auth";

type StoredProfiles = Map<string, ProfilesContextType>;
// note

const LOCAL_STORAGE_KEY = "profiles";
const ProfileContext = createContext<ProfilesContextType | null>(null);
const ProfileDispatchContext = createContext<React.Dispatch<ActionType> | null>(
  null,
);

export default function ProfilesProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const { user } = useAuth();

  const userProfiles = findProfile(user?.email as string);

  const [state, dispatch] = useReducer(profilesReducer, userProfiles); //2nd arg -> initial value

  useEffect(() => {
    if (user?.email) {
      if (state) {
        // syncing changes with localstorage
        // TODOS : doubt
        const storedProfiles = getProfiles();
        storedProfiles.set(user.email, state as ProfilesContextType);
        updateProfiles(storedProfiles);
      } else {
        // if there is no state
        dispatch({ type: "load", payload: userProfiles });
      }
    }
  }, [user?.email, state]);
  // todos:   when user.email changes

  return (
    <ProfileContext.Provider value={state}>
      <ProfileDispatchContext.Provider value={dispatch}>
        {children}
      </ProfileDispatchContext.Provider>
    </ProfileContext.Provider>
  );
}

// to handle profiles,for  each user which is logging in , we will use email as key and different profiles as value

function getProfiles(): StoredProfiles {
  return new Map(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]"));
  //   Map allows you to store key-value pairs where both the keys and the values can be of any type
}

function findProfile(id: string) {
  const profiles = getProfiles();

  //   get profile of logged in user
  //   'get' is used to retrieve value from map(profiles)
  return id ? profiles.get(id) ?? null : null;
}

function updateProfiles(profiles: StoredProfiles) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(Array.from(profiles)));
  //   can't directly stringify Map object
}

export const useProfilesContext = () => useContext(ProfileContext);
export const useProfilesDispatchContext = () =>
  useContext(ProfileDispatchContext) as React.Dispatch<ActionType>;
