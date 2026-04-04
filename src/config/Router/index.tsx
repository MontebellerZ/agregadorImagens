import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../../components/Layout";
import Home from "../../components/Screens/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
