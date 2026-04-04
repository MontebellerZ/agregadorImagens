export type TFoto = {
  arquivo: string;
  data: () => Promise<{ default: string }>;
  loaded?: {
    src: string;
    width: number;
    height: number;
    aspect: number;
  };
};
