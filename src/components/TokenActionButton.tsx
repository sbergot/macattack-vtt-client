import { KonvaEventObject } from "konva/lib/Node";
import { Group, Rect, Text } from "react-konva";

type TokenActionButtonProps = {
  x: number;
  y: number;
  label: string;
  onClick: () => void;
};

export function TokenActionButton({ x, y, label, onClick }: TokenActionButtonProps) {
  const handlePress = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    event.cancelBubble = true;
    onClick();
  };

  return (
    <Group x={x} y={y} onClick={handlePress} onTap={handlePress}>
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