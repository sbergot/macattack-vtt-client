import { useMemo, useState } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import type {
  TokenActionHandler,
  TokenAngleHandler,
  TokenData,
  Point,
  TokenSelectHandler,
  TokenSelection,
} from "../types/token";

type UseTokenManagerResult = {
  orderedTokens: TokenData[];
  tokenSelection: TokenSelection;
  updateToken: (tokenId: string, position: Point) => void;
  updateTokenAngle: TokenAngleHandler;
  selectToken: TokenSelectHandler;
  activateMoveGuide: TokenActionHandler;
  activateRotateGuide: TokenActionHandler;
  completeMoveGuide: (tokenId: string) => void;
  completeRotateGuide: (tokenId: string) => void;
  clearSelection: (event: KonvaEventObject<MouseEvent | TouchEvent>) => void;
};

export function useTokenManager(
  initialTokens: TokenData[],
): UseTokenManagerResult {
  const [tokens, setTokens] = useState<TokenData[]>(initialTokens);
  const [tokenSelection, setTokenSelection] = useState<TokenSelection>({
    tokenId: null,
    mode: null,
  });

  const orderedTokens = useMemo(
    () =>
      tokens
        .slice()
        .sort((left, right) => left.label.localeCompare(right.label)),
    [tokens],
  );

  const updateToken = (tokenId: string, position: Point) => {
    setTokens((currentTokens) =>
      currentTokens.map((token) =>
        token.id === tokenId ? { ...token, ...position } : token,
      ),
    );
  };

  const updateTokenAngle: TokenAngleHandler = (tokenId, angle) => {
    setTokens((currentTokens) =>
      currentTokens.map((token) =>
        token.id === tokenId ? { ...token, angle } : token,
      ),
    );
  };

  const selectToken: TokenSelectHandler = (tokenId) => {
    if (tokenId !== tokenSelection.tokenId) {
      setTokenSelection({ tokenId, mode: null });
      return;
    }

    setTokenSelection({ tokenId, mode: null });
  };

  const activateMoveGuide: TokenActionHandler = (tokenId) => {
    console.debug("Activating move guide for token:", tokenId);
    const activeToken = tokens.find((token) => token.id === tokenId);

    setTokenSelection({
      tokenId,
      mode: "move",
      origin: activeToken
        ? { x: activeToken.x, y: activeToken.y }
        : { x: 0, y: 0 },
    });
  };

  const activateRotateGuide: TokenActionHandler = (tokenId) => {
    console.debug("Activating rotate guide for token:", tokenId);
    setTokenSelection({ tokenId, mode: "rotate" });
  };

  const completeMoveGuide = (tokenId: string) => {
    if (tokenSelection.tokenId === tokenId && tokenSelection.mode === "move") {
      setTokenSelection({ tokenId: null, mode: null });
    }
  };

  const completeRotateGuide = (tokenId: string) => {
    if (
      tokenSelection.tokenId === tokenId &&
      tokenSelection.mode === "rotate"
    ) {
      setTokenSelection({ tokenId: null, mode: null });
    }
  };

  const clearSelection = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = event.target.getStage();
    if (event.target === stage) {
      setTokenSelection({ tokenId: null, mode: null });
    }
  };

  return {
    orderedTokens,
    tokenSelection,
    updateToken,
    updateTokenAngle,
    selectToken,
    activateMoveGuide,
    activateRotateGuide,
    completeMoveGuide,
    completeRotateGuide,
    clearSelection,
  };
}
