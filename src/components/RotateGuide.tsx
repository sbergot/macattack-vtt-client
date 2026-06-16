import { Group, Circle, Line } from "react-konva";
import type {
  TokenAngleHandler,
  TokenData,
} from "../types/token";

type RotateGuideProps = {
  token: TokenData;
  rotateRadius: number;
  rotateHandlePosition: { x: number; y: number };
  onRotate: TokenAngleHandler;
  onRotateGuideEnd: (tokenId: string) => void;
};

export function RotateGuide({
  token,
  rotateRadius,
  rotateHandlePosition,
  onRotate,
  onRotateGuideEnd,
}: RotateGuideProps) {
  return <Group x={token.x} y={token.y}>
    <Circle
      radius={rotateRadius}
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

        const snappedX = Math.sin((nextAngle * Math.PI) / 180) * rotateRadius;
        const snappedY = -Math.cos((nextAngle * Math.PI) / 180) * rotateRadius;
        event.target.position({ x: snappedX, y: snappedY });
        onRotate(token.id, Math.round(nextAngle));
      } }
      onDragEnd={() => {
        onRotateGuideEnd(token.id);
      } } />
  </Group>;
}