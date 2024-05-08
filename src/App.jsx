import "./App.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import FirstPage from "./components/FirstPage";
import SecondPage from "./components/SecondPage";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route path="" element={<FirstPage />} />
        <Route path="second" element={<SecondPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
