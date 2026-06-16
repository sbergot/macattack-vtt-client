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

export type TokenSelectHandler = (tokenId: string) => void;

export type TokenActionHandler = (tokenId: string) => void;

export type TokenAngleHandler = (tokenId: string, angle: number) => void;