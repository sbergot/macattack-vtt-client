import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useMemo, useState } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import {
  Circle,
  Group,
  Image as KonvaImage,
  Layer,
  Line,
  Stage,
  Text,
} from "react-konva";
import useImage from "use-image";
import mapImageUrl from "./assets/tactical-map.svg";

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 900;
const ZOOM_STEP = 1.15;

type TokenData = {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  angle: number;
};

type TokenPosition = Pick<TokenData, "x" | "y">;

type TokenProps = {
  token: TokenData;
  onMove: (tokenId: string, position: TokenPosition) => void;
};

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

type ZoomButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type TokenRowProps = {
  token: TokenData;
};

const initialTokens: TokenData[] = [
  { id: "alpha", label: "A", color: "#f25f5c", x: 220, y: 180, angle: 0 },
  { id: "bravo", label: "B", color: "#247ba0", x: 480, y: 320, angle: 55 },
  { id: "charlie", label: "C", color: "#70c1b3", x: 760, y: 510, angle: 225 },
];

function clampZoom(nextZoom: number): number {
  const ZOOM_MIN = 0.5;
  const ZOOM_MAX = 2.5;

  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nextZoom));
}

function Token({ token, onMove }: TokenProps) {
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

function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_24px_60px_rgba(3,7,18,0.35)] backdrop-blur-[18px] ${className}`.trim()}
    >
      {children}
    </div>
  );
}

function ZoomButton({ className = "", ...buttonProps }: ZoomButtonProps) {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-full bg-linear-to-br from-amber-400 to-orange-500 px-4.5 py-2.5 font-bold text-slate-900 transition-transform hover:scale-105 ${className}`.trim()}
      {...buttonProps}
    />
  );
}

function TokenRow({ token }: TokenRowProps) {
  return (
    <li className="flex items-center gap-3.5 rounded-[18px] bg-white/5 px-3.5 py-3">
      <span
        className="grid h-10.5 w-10.5 place-items-center rounded-full font-bold text-slate-50"
        style={{ backgroundColor: token.color }}
      >
        {token.label}
      </span>
      <div>
        <strong className="block">{token.id}</strong>
        <p className="m-0">
          x: {token.x}, y: {token.y}, angle: {token.angle}
        </p>
      </div>
    </li>
  );
}

export default function App() {
  const [tokens, setTokens] = useState<TokenData[]>(initialTokens);
  const [zoom, setZoom] = useState<number>(1);
  const [mapImage] = useImage(mapImageUrl);

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

  const applyZoom = (nextZoom: number) => {
    setZoom(clampZoom(nextZoom));
  };

  const handleWheel = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();
    const direction = event.evt.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP;
    applyZoom(zoom * direction);
  };

  return (
    <main className="min-h-screen min-w-80 bg-[radial-gradient(circle_at_top,rgba(240,165,0,0.18),transparent_28%),linear-gradient(160deg,#09111f_0%,#132238_45%,#1b3146_100%)] px-4 py-5 font-['Space_Grotesk',sans-serif] text-slate-200 sm:px-6 sm:py-8">
      <section className="mx-auto mb-6 max-w-190">
        <p className="mb-3 text-[0.8rem] uppercase tracking-[0.24em] text-amber-400">
          MacAttack VTT
        </p>
        <h1 className="text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.95]">
          Drag tokens across the battlefield and track exact coordinates.
        </h1>
        <p className="max-w-[56ch] text-slate-200/85">
          This demo keeps token positions in React state, renders the map with
          Konva, and supports zoom via the mouse wheel or explicit controls.
        </p>
      </section>

      <section className="mx-auto grid max-w-360 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <GlassCard className="p-4.5">
          <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="m-0 text-[0.8rem] uppercase tracking-[0.12em] text-slate-200/65">
                Zoom
              </p>
              <strong>{Math.round(zoom * 100)}%</strong>
            </div>
            <div className="flex gap-3">
              <ZoomButton onClick={() => applyZoom(zoom / ZOOM_STEP)}>
                -
              </ZoomButton>
              <ZoomButton onClick={() => applyZoom(1)}>Reset</ZoomButton>
              <ZoomButton onClick={() => applyZoom(zoom * ZOOM_STEP)}>
                +
              </ZoomButton>
            </div>
          </div>

          <div className="overflow-auto rounded-[22px] border border-white/10 bg-slate-950/90">
            <Stage
              width={MAP_WIDTH * zoom}
              height={MAP_HEIGHT * zoom}
              scaleX={zoom}
              scaleY={zoom}
              onWheel={handleWheel}
            >
              <Layer>
                <KonvaImage
                  image={mapImage}
                  width={MAP_WIDTH}
                  height={MAP_HEIGHT}
                  cornerRadius={24}
                />
                {orderedTokens.map((token) => (
                  <Token key={token.id} token={token} onMove={updateToken} />
                ))}
              </Layer>
            </Stage>
          </div>
        </GlassCard>

        <aside className="top-8 xl:sticky">
          <GlassCard className="p-6">
            <h2 className="mt-0">Token Coordinates</h2>
            <p className="text-slate-200/80">
              Drag any token on the map to update its position in state.
              Orientation is stored as degrees clockwise from the top direction.
            </p>
            <ul className="mt-6 grid list-none gap-3.5 p-0">
              {orderedTokens.map((token) => (
                <TokenRow key={token.id} token={token} />
              ))}
            </ul>
          </GlassCard>
        </aside>
      </section>
    </main>
  );
}
