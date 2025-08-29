import { createContext, useContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    email: "",
    name: ""
  },
  appLoading: false,
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useContext({
    isAuthenticated: false,
    user: {
      email: "",
      name: ""
    },
  });

  const [appLoading, setAppLoading] = useContext(true);
  return (
    <AuthContext.Provider value={{ 
      auth, setAuth, appLoading, setAppLoading 
    }}>
      {props.children}
    </AuthContext.Provider>
  )
};
