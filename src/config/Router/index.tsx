import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "../../components/Layout";
import Home from "../../components/Screens/Home";
import CategoriaStorage from "../Storage/Stores/Categoria.store";
import Categorias from "../../components/Screens/Categorias";
import Lixeira from "../../components/Screens/Lixeira";

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
        path: "categorias/:nome?",
        element: <Categorias />,
        loader: ({ params }) => {
          const cat = params.nome ? decodeURIComponent(params.nome) : undefined;
          return cat ? CategoriaStorage.getByNome(cat) : null;
        },
      },
      {
        path: "lixeira",
        element: <Lixeira />,
      },
    ],
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
