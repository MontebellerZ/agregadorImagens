import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import type { TCategoria } from "../../../types/categoria.type";

interface ILinkCategoria {
  categoria?: TCategoria;
}

function LinkCategoria(props: ILinkCategoria) {
  const navigate = useNavigate();

  const link = props.categoria?.nome || "";
  const nome = props.categoria?.nome || "Ver tudo";
  const cor = props.categoria?.cor;

  const onClick = () => {
    navigate(`/categorias/${link}`);
  };

  return (
    <Button
      variant="secondary"
      onClick={onClick}
      style={
        cor
          ? {
              backgroundColor: cor,
              borderColor: cor,
            }
          : undefined
      }
    >
      {nome}
    </Button>
  );
}

export default LinkCategoria;
