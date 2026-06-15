import { useRef } from "react";
import { Circle, Group, Line, Rect, Text } from "react-konva";
import type {
  TokenActionHandler,
  TokenData,
  TokenMoveHandler,
  TokenSelectHandler,
} from "../types/token";

type TokenProps = {
  token: TokenData;
  onMove: TokenMoveHandler;
  onSelect: TokenSelectHandler;
  onMoveAction: TokenActionHandler;
  isSelected: boolean;
  showMoveGuide: boolean;
  guideOrigin: { x: number; y: number } | null;
  onMoveGuideEnd: (tokenId: string) => void;
};

type TokenActionButtonProps = {
  x: number;
  y: number;
  label: string;
  onClick?: () => void;
};

function TokenActionButton({ x, y, label, onClick }: TokenActionButtonProps) {
  return (
    <Group x={x} y={y} onClick={onClick} onTap={onClick}>
      <Rect
        width={68}
        height={24}
        cornerRadius={12}
        fill="rgba(15, 23, 42, 0.95)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={1}
      />
      <Text
        x={14}
        y={6}
        text={label}
        fontSize={11}
        fontStyle="600"
        fill="#f8fafc"
      />
    </Group>
  );
}

export function Token({
  token,
  onMove,
  onSelect,
  onMoveAction,
  isSelected,
  showMoveGuide,
  guideOrigin,
  onMoveGuideEnd,
}: TokenProps) {
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);

  return (
    <>
      {isSelected && showMoveGuide && guideOrigin ? (
        <Line
          x={guideOrigin.x}
          y={guideOrigin.y}
          points={[0, -450, 0, 450]}
          stroke="#f59e0b"
          strokeWidth={3}
          dash={[10, 8]}
          opacity={0.95}
          rotation={token.angle}
        />
      ) : null}
      <Group
        x={token.x}
        y={token.y}
        scaleX={isSelected ? 1.1 : 1}
        scaleY={isSelected ? 1.1 : 1}
        draggable
        onClick={() => onSelect(token.id)}
        onTap={() => onSelect(token.id)}
        onDragStart={(event) => {
          dragStartPosition.current = {
            x: event.target.x(),
            y: event.target.y(),
          };
        }}
        onDragMove={(event) => {
          if (showMoveGuide) {
            const start = guideOrigin ??
              dragStartPosition.current ?? {
                x: token.x,
                y: token.y,
              };

            const angleRad = (token.angle * Math.PI) / 180;
            const axis = {
              x: Math.sin(angleRad),
              y: -Math.cos(angleRad),
            };

            const delta = {
              x: event.target.x() - start.x,
              y: event.target.y() - start.y,
            };

            const projectedDistance = delta.x * axis.x + delta.y * axis.y;
            const constrained = {
              x: start.x + axis.x * projectedDistance,
              y: start.y + axis.y * projectedDistance,
            };

            event.target.position(constrained);
            onMove(token.id, {
              x: Math.round(constrained.x),
              y: Math.round(constrained.y),
            });
            return;
          }

          onMove(token.id, {
            x: Math.round(event.target.x()),
            y: Math.round(event.target.y()),
          });
        }}
        onDragEnd={() => {
          if (showMoveGuide) {
            onMoveGuideEnd(token.id);
          }
          dragStartPosition.current = null;
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
          <Circle
            radius={35}
            stroke="#fde68a"
            strokeWidth={3}
            opacity={0.9}
          />
        ) : null}
        {isSelected && !showMoveGuide ? (
          <>
            <TokenActionButton
              x={40}
              y={-26}
              label="Move"
              onClick={() => onMoveAction(token.id)}
            />
            <TokenActionButton x={40} y={4} label="Rotate" />
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