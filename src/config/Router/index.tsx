import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../../components/Layout";
import Home from "../../components/Screens/Home";
import CategoriaStorage from "../Storage/Stores/Categoria.store";
import Categorias from "../../components/Screens/Categorias";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "categorias",
        element: <Categorias />,
        children: [{ path: ":nome" }],
        loader: ({ params }) => {
          const cat = params.nome;
          return cat ? CategoriaStorage.getByNome(cat) : null;
        },
      },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
