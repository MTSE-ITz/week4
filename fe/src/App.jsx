import { Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import axios from "./util/axios.customize";
import Header from "./components/layout/header";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        const res = await axios.get(`/v1/api/user`);
        if (res && !res.message) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.email,
              name: res.name,
            },
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setAppLoading(false);
      }
    };
    fetchAccount();
  }, []);

  return (
    <div>
      {appLoading ? (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Spin />
        </div>
      ) : (
        <>
          <Header />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;
