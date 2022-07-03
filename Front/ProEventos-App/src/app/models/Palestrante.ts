
import { RedeSocial } from "./RedeSocial";
import { Lote } from "./Lote";
import { Evento } from "./Evento";

export interface Palestrante {
  id: number;
  nome: string;
  miniCurriculo: string;
  imagemURL: string;
  telefone: string;
  email: string;
  lotes: Lote[];
  redesSociais: RedeSocial[];
  palestrantesEventos: Evento[];
}
