export type TFoto = {
  arquivo: string;
  data: () => Promise<{ default: string }>;
};
