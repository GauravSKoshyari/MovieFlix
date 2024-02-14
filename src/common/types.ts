
export type Position = {
    top: number;
    left: number;
  };
  

  export type UserProfile ={
     id:string;
     imageUrl:string;
     name:string;
  }

  export type ProfilesContextType = {
    profiles: UserProfile[];
    selectedProfileId: string;
  };
  

  export type ActionType={
    type:"edit"|"delete"|"add"|"current";
    // "current" for setting current profile
    payload:Partial<UserProfile>;
  } | {type:"load";payload:any}    // adding another case "load" for loading all profiles

  // Partial<T>  allows you to make all properties of a type T optional

  // note