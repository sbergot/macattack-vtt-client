import { useMemo, useState } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import type {
  TokenActionHandler,
  TokenAngleHandler,
  TokenData,
  TokenPosition,
  TokenSelectHandler,
} from "./types/token";

type UseTokenManagerResult = {
  orderedTokens: TokenData[];
  selectedTokenId: string | null;
  moveGuideTokenId: string | null;
  rotateGuideTokenId: string | null;
  moveGuideOrigin: TokenPosition | null;
  updateToken: (tokenId: string, position: TokenPosition) => void;
  updateTokenAngle: TokenAngleHandler;
  selectToken: TokenSelectHandler;
  activateMoveGuide: TokenActionHandler;
  activateRotateGuide: TokenActionHandler;
  completeMoveGuide: (tokenId: string) => void;
  completeRotateGuide: (tokenId: string) => void;
  clearSelection: (event: KonvaEventObject<MouseEvent | TouchEvent>) => void;
};

export function useTokenManager(initialTokens: TokenData[]): UseTokenManagerResult {
  const [tokens, setTokens] = useState<TokenData[]>(initialTokens);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [moveGuideTokenId, setMoveGuideTokenId] = useState<string | null>(null);
  const [rotateGuideTokenId, setRotateGuideTokenId] = useState<string | null>(
    null,
  );
  const [moveGuideOrigin, setMoveGuideOrigin] = useState<TokenPosition | null>(
    null,
  );

  const orderedTokens = useMemo(
    () =>
      tokens
        .slice()
        .sort((left, right) => left.label.localeCompare(right.label)),
    [tokens],
  );

  const updateToken = (tokenId: string, position: TokenPosition) => {
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
    if (tokenId !== selectedTokenId) {
      setMoveGuideTokenId(null);
      setRotateGuideTokenId(null);
      setMoveGuideOrigin(null);
    }
    setSelectedTokenId(tokenId);
  };

  const activateMoveGuide: TokenActionHandler = (tokenId) => {
    const activeToken = tokens.find((token) => token.id === tokenId);

    setSelectedTokenId(tokenId);
    setMoveGuideTokenId(tokenId);
    setRotateGuideTokenId(null);
    setMoveGuideOrigin(
      activeToken
        ? {
            x: activeToken.x,
            y: activeToken.y,
          }
        : null,
    );
  };

  const activateRotateGuide: TokenActionHandler = (tokenId) => {
    setSelectedTokenId(tokenId);
    setRotateGuideTokenId(tokenId);
    setMoveGuideTokenId(null);
    setMoveGuideOrigin(null);
  };

  const completeMoveGuide = (tokenId: string) => {
    if (moveGuideTokenId === tokenId) {
      setMoveGuideTokenId(null);
      setMoveGuideOrigin(null);
    }

    if (selectedTokenId === tokenId) {
      setSelectedTokenId(null);
    }
  };

  const completeRotateGuide = (tokenId: string) => {
    if (rotateGuideTokenId === tokenId) {
      setRotateGuideTokenId(null);
    }

    if (selectedTokenId === tokenId) {
      setSelectedTokenId(null);
    }
  };

  const clearSelection = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = event.target.getStage();
    if (event.target === stage) {
      setSelectedTokenId(null);
      setMoveGuideTokenId(null);
      setRotateGuideTokenId(null);
      setMoveGuideOrigin(null);
    }
  };

  return {
    orderedTokens,
    selectedTokenId,
    moveGuideTokenId,
    rotateGuideTokenId,
    moveGuideOrigin,
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