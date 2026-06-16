export type TokenData = {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  angle: number;
};

export interface Point {
  x: number;
  y: number;
}

export type TokenSelection = {
  tokenId: string | null;
} & ({ mode: "move"; origin: Point } | { mode: "rotate" } | { mode: null });

export type TokenMoveHandler = (
  tokenId: string,
  position: Point,
) => void;

export type TokenSelectHandler = (tokenId: string) => void;

export type TokenActionHandler = (tokenId: string) => void;

export type TokenAngleHandler = (tokenId: string, angle: number) => void;