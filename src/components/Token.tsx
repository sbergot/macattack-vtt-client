import { Circle, Group, Line, Text } from "react-konva";
import type { TokenData, TokenMoveHandler } from "../types/token";

type TokenProps = {
  token: TokenData;
  onMove: TokenMoveHandler;
};

export function Token({ token, onMove }: TokenProps) {
  return (
    <Group
      x={token.x}
      y={token.y}
      draggable
      onDragMove={(event) => {
        onMove(token.id, {
          x: Math.round(event.target.x()),
          y: Math.round(event.target.y()),
        });
      }}
    >
      <Circle
        radius={26}
        fill={token.color}
        shadowColor="rgba(10, 17, 40, 0.35)"
        shadowBlur={12}
        shadowOffsetY={6}
      />
      <Circle radius={30} stroke="rgba(255,255,255,0.9)" strokeWidth={3} />
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
  );
}