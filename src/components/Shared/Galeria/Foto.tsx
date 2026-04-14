import React from "react";
import type { ImageProps } from "react-bootstrap";

const Foto = React.memo((props: ImageProps) => <img {...props} />);

export default Foto;
