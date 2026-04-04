import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import type { TCategoria } from "../../types/categoria.type";

interface ILinkCategoria {
  categoria?: TCategoria;
}

function LinkCategoria(props: ILinkCategoria) {
  const navigate = useNavigate();

  const link = props.categoria?.nome || "";
  const nome = props.categoria?.nome || "Ver tudo";

  const onClick = () => {
    navigate(`/categorias/${link}`);
  };

  return (
    <Button variant="secondary" onClick={onClick}>
      {nome}
    </Button>
  );
}

export default LinkCategoria;
