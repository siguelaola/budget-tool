import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

interface UserData {
  totalIncome: number;
  expenses: number;
  savings: number;
  investments: number;
}

interface UserDataProviderProps {
  children: React.ReactNode;
  session: Session;
}

const defaultUserData: UserData = {
  totalIncome: 0,
  expenses: 0,
  savings: 0,
  investments: 0,
};

const UserDataContext = createContext<{
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}>({
  userData: defaultUserData,
  setUserData: () => {},
});

export const UserDataProvider = ({
  children,
  session,
}: UserDataProviderProps) => {
  
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (userData === undefined) { 
        const storedData = localStorage.getItem("userData");
        if (storedData) {
            setUserData(JSON.parse(storedData));
        } else {
            setUserData({
                totalIncome: 0,
                expenses: 0,
                savings: 0,
                investments: 0,
              });
        }
    } else {
        localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);

// import { Session } from '@supabase/supabase-js'
// import { createContext, useState, useEffect, ReactNode } from 'react'

// type UserData = {
//   totalIncome: number,
//   expenses: number,
//   savings: number,
//   investments: number,
// }

// type User = {
//   id: string,
//   email: string,
//   userData: UserData,
// }

// type UserContextValue = {
//   user: User | null,
//   updateUser: (user: User) => void
// }

// type UserDataProviderProps = {
//   children: ReactNode;
//   session: Session;
// }

// const defaultUserData = {
//   totalIncome: 0,
//   expenses: 0,
//   savings: 0,
//   investments: 0,
// }

// const defaultUser = {
//   id: "",
//   email: "",
//   userData: defaultUserData,
// }

// export const UserContext = createContext<UserContextValue>({
//   user: defaultUser,
//   updateUser: () => {}
// })

// export const UserDataProvider = ({ children, session }: UserDataProviderProps) => {
//   const [user, setUser] = useState<User | null>(null)

//   useEffect(() => {
//     const savedUser = localStorage.getItem('user')
//     if (savedUser) {
//       setUser(JSON.parse(savedUser))
//     }
//   }, [])

//   useEffect(() => {
//     const fetchUser = async () => {
//       const response = await fetch('/api/user')
//       const data = await response.json()
//       setUser(data)
//       localStorage.setItem('user', JSON.stringify(data))
//     }

//     if (session?.user) {
//       fetchUser()
//     }
//   }, [session])

//   const updateUser = (newUser: User) => {
//     setUser(newUser)
//     localStorage.setItem('user', JSON.stringify(newUser))
//   }

//   return (
//     <UserContext.Provider value={{ user, updateUser }}>
//       {children}
//     </UserContext.Provider>
//   )
// }
