import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage";
import RecipeDetails from "./pages/RecipesDetails";

import FavoriteRecipes from "./pages/FavoriteRecipes";
import UserProfile from "./pages/UserProfile";
import GeneratedRecipes from "./pages/GeneratedRecipes";
import DayPlanPage from "./pages/DayPlanPage";
import DayPlanDetails from "./pages/DayPlanDetails";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/calendar" element={<CalendarPage />} />

        <Route path="/recipes/:id" element={<RecipeDetails />} />


        <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/favorite-recipes" element={ <ProtectedRoute><FavoriteRecipes /></ProtectedRoute>} />
        <Route
          path="/generated-recipes"
          element={
            <ProtectedRoute>
              <GeneratedRecipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/day-plan"
          element={
            <ProtectedRoute>
              <DayPlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/day-plan/:id"
          element={
            <ProtectedRoute>
              <DayPlanDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
