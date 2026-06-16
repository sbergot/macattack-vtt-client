import { Circle, Group, Line, Text } from "react-konva";
import type {
  TokenActionHandler,
  TokenAngleHandler,
  TokenData,
  TokenMoveHandler,
  TokenSelectHandler,
  Point,
  TokenSelection,
} from "../types/token";
import { TokenActionButton } from "./TokenActionButton";
import { RotateGuide } from "./RotateGuide";

type TokenProps = {
  token: TokenData;
  onMove: TokenMoveHandler;
  onRotate: TokenAngleHandler;
  onSelect: TokenSelectHandler;
  onMoveAction: TokenActionHandler;
  onRotateAction: TokenActionHandler;
  tokenSelection: TokenSelection;
  onMoveGuideEnd: (tokenId: string) => void;
  onRotateGuideEnd: (tokenId: string) => void;
};

export function Token({
  token,
  tokenSelection,
  onMove,
  onRotate,
  onSelect,
  onMoveAction,
  onRotateAction,
  onMoveGuideEnd,
  onRotateGuideEnd,
}: TokenProps) {
  const isSelected = tokenSelection?.tokenId === token.id;
  const showMoveGuide = isSelected && tokenSelection.mode === "move";
  const showRotateGuide = isSelected && tokenSelection.mode === "rotate";

  return (
    <>
      {showMoveGuide ? (
        <Line
          x={tokenSelection.origin.x}
          y={tokenSelection.origin.y}
          points={[0, -450, 0, 450]}
          stroke="#f59e0b"
          strokeWidth={3}
          dash={[10, 8]}
          opacity={0.95}
          rotation={token.angle}
        />
      ) : null}
      {showRotateGuide ? (
        <RotateGuide
          token={token}
          onRotate={onRotate}
          onRotateGuideEnd={onRotateGuideEnd}
        />
      ) : null}
      <Group
        x={token.x}
        y={token.y}
        scaleX={isSelected ? 1.1 : 1}
        scaleY={isSelected ? 1.1 : 1}
        draggable={showMoveGuide}
        onClick={() => onSelect(token.id)}
        onTap={() => onSelect(token.id)}
        onDragMove={(event) => {
          if (!showMoveGuide) {
            return;
          }

          const constrained = constrainOnAngle(
            token.angle,
            { x: event.target.x(), y: event.target.y() },
            tokenSelection.origin,
          );

          event.target.position(constrained);
          onMove(token.id, constrained);
        }}
        onDragEnd={() => {
          if (showMoveGuide) {
            onMoveGuideEnd(token.id);
          }
        }}
      >
        {isSelected ? (
          <Circle
            radius={40}
            fill="#f59e0b"
            opacity={0.2}
            shadowColor="#f59e0b"
            shadowBlur={22}
          />
        ) : null}
        <Circle
          radius={26}
          fill={token.color}
          shadowColor="rgba(10, 17, 40, 0.35)"
          shadowBlur={12}
          shadowOffsetY={6}
        />
        <Circle
          radius={30}
          stroke={isSelected ? "#f59e0b" : "rgba(255,255,255,0.9)"}
          strokeWidth={isSelected ? 5 : 3}
        />
        {isSelected ? (
          <Circle radius={35} stroke="#fde68a" strokeWidth={3} opacity={0.9} />
        ) : null}
        {isSelected && !showMoveGuide && !showRotateGuide ? (
          <>
            <TokenActionButton
              x={40}
              y={-26}
              label="Move"
              onClick={() => onMoveAction(token.id)}
            />
            <TokenActionButton
              x={40}
              y={4}
              label="Rotate"
              onClick={() => onRotateAction(token.id)}
            />
          </>
        ) : null}
        <Line
          points={[0, -32, -8, -16, 8, -16]}
          closed
          fill="#f8fafc"
          stroke="rgba(9, 17, 31, 0.8)"
          strokeWidth={1.5}
          rotation={token.angle}
        />
        <Text
          text={token.label}
          offsetX={8}
          offsetY={10}
          fontSize={20}
          fontStyle="700"
          fill="#f8fafc"
        />
      </Group>
    </>
  );
}

function constrainOnAngle(angle: number, target: Point, start: Point): Point {
  const angleRad = (angle * Math.PI) / 180;
  const axis = {
    x: Math.sin(angleRad),
    y: -Math.cos(angleRad),
  };

  const delta = {
    x: target.x - start.x,
    y: target.y - start.y,
  };

  const projectedDistance = delta.x * axis.x + delta.y * axis.y;
  const constrained = {
    x: Math.round(start.x + axis.x * projectedDistance),
    y: Math.round(start.y + axis.y * projectedDistance),
  };
  return constrained;
}
