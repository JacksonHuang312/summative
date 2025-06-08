import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context";
import HomeView from "./views/HomeView.jsx";
import RegisterView from "./views/RegisterView.jsx";
import LoginView from "./views/LoginView.jsx";
import MovieView from "./views/MovieView.jsx";
import DetailView from "./views/DetailView.jsx";
import GenreView from "./views/GenreView.jsx";
import ErrorView from "./views/ErrorView.jsx";
import SettingsView from "./views/SettingsView.jsx";
import SearchView from "./views/SearchView.jsx";
import CartView from './views/CartView.jsx';
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/login" element={<LoginView />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/movies" element={<MovieView />}>
              <Route path="genre/:genre_id" element={<GenreView />} />
              <Route path="details/:id" element={<DetailView />} />
              <Route path="search" element={<SearchView />} />
            </Route>
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/cart" element={<CartView />} />
          </Route>
          
          <Route path="*" element={<ErrorView />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App;