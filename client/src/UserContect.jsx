import { createContext } from "react";


export const UserContext = createContext({})

export function UserContextProvider({children}) {
    return (
        {children}
    )
}