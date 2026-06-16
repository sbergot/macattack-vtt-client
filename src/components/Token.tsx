import { useRef } from "react";
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
  const ROTATE_RADIUS = 78;
  const angleRad = (token.angle * Math.PI) / 180;
  const rotateHandlePosition = {
    x: Math.sin(angleRad) * ROTATE_RADIUS,
    y: -Math.cos(angleRad) * ROTATE_RADIUS,
  };

  const isSelected = tokenSelection.tokenId === token.id;
  const showMoveGuide = isSelected && tokenSelection.mode === "move";
  const showRotateGuide = isSelected && tokenSelection.mode === "rotate";

  return (
    <>
      {isSelected && showMoveGuide ? (
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
      {isSelected && showRotateGuide ? (
        RotateGuide(token, ROTATE_RADIUS, rotateHandlePosition, onRotate, onRotateGuideEnd)
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
          const start = tokenSelection.origin;

          const constrained = constrainOnAngle(
            token.angle,
            { x: event.target.x(), y: event.target.y() },
            start,
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

function RotateGuide(token: TokenData, ROTATE_RADIUS: number, rotateHandlePosition: { x: number; y: number; }, onRotate: TokenAngleHandler, onRotateGuideEnd: (tokenId: string) => void) {
  return <Group x={token.x} y={token.y}>
    <Circle
      radius={ROTATE_RADIUS}
      stroke="#f59e0b"
      strokeWidth={2}
      opacity={0.9}
      dash={[8, 6]} />
    <Line
      points={[0, 0, rotateHandlePosition.x, rotateHandlePosition.y]}
      stroke="#f59e0b"
      strokeWidth={2}
      opacity={0.9} />
    <Circle
      x={rotateHandlePosition.x}
      y={rotateHandlePosition.y}
      radius={11}
      fill="#f59e0b"
      stroke="#fef3c7"
      strokeWidth={2}
      draggable
      onDragMove={(event) => {
        const localX = event.target.x();
        const localY = event.target.y();
        const nextAngle = ((Math.atan2(localX, -localY) * 180) / Math.PI + 360) % 360;

        const snappedX = Math.sin((nextAngle * Math.PI) / 180) * ROTATE_RADIUS;
        const snappedY = -Math.cos((nextAngle * Math.PI) / 180) * ROTATE_RADIUS;
        event.target.position({ x: snappedX, y: snappedY });
        onRotate(token.id, Math.round(nextAngle));
      } }
      onDragEnd={() => {
        onRotateGuideEnd(token.id);
      } } />
  </Group>;
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
