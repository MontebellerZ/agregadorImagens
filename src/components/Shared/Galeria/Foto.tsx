import React from "react";
import type { ImageProps } from "react-bootstrap";
import type { TFoto } from "../../../types/foto.type";
import styles from "./foto.module.scss";
import { getCategoriasFoto } from "../../../utils/getCategoriasFoto";

interface IFoto extends ImageProps {
	fotoObj?: TFoto;
	categoriasVersion?: number;
	onClick?: () => void;
}

const Foto = React.memo(({ fotoObj, categoriasVersion = 0, onClick, ...props }: IFoto) => {
	void categoriasVersion;
	const categorias = fotoObj ? getCategoriasFoto(fotoObj) : [];

	return (
		<div className={styles.fotoWrapper} onClick={onClick}>
			<img {...props} />
			{categorias.length > 0 && (
				<div className={styles.categorias}>
					{categorias.map((categoria) => (
						<span
							key={categoria.id}
							className={styles.tag}
							style={categoria.cor ? { backgroundColor: categoria.cor } : undefined}
						>
							{categoria.nome}
						</span>
					))}
				</div>
			)}
		</div>
	);
});

export default Foto;
