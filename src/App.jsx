import "./App.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import FirstPage from "./components/FirstPage";
import SecondPage from "./components/SecondPage";
import Detail from "./components/Detail";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route path="" element={<FirstPage />} />
        <Route path="weekly-exchange" element={<SecondPage />} />
        <Route path="/overview/:id" element={<Detail />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
}

export default App;
