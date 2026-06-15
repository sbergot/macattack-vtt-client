export type TokenData = {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  angle: number;
};

export type TokenPosition = Pick<TokenData, "x" | "y">;

export type TokenMoveHandler = (
  tokenId: string,
  position: TokenPosition,
) => void;