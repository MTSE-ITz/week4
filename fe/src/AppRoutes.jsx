import { Routes, Route } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import FavouritePage from "./pages/FavouritePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root layout */}
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="favourites" element={<FavouritePage userId={7} />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
