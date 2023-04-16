import { createContext, useContextSelector } from "use-context-selector";
const UserContext = createContext({});
export const useUserContext = () => useContextSelector(UserContext, (c) => c);

const UserProvider = ({ value, children }) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
export default UserProvider;
