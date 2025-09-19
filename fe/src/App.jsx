import { Outlet } from 'react-router-dom';
import Header from './components/layout/header';
import axios from './util/axios.customize';
import { useContext, useEffect } from 'react';
import { Spin } from 'antd';
import { AuthContext } from './components/context/auth.context';

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      const res = await axios.get('/v1/api/account');
      if (res && !res.message) {
        setAuth({
          isAuthenticated: true,
          user: {
            id: res.id,
            email: res.email,
            name: res.name,
          },
        });
      }
      setAppLoading(false);
    };

    fetchAccount();
  }, []);

  return (
    <div>
      {appLoading === true ? (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
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
