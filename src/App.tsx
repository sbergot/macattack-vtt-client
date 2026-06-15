import { useMemo, useState } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";
import mapImageUrl from "./assets/tactical-map.svg";
import { GlassCard } from "./components/GlassCard";
import { Token } from "./components/Token";
import { TokenRow } from "./components/TokenRow";
import { ZoomButton } from "./components/ZoomButton";
import type { TokenData, TokenPosition } from "./types/token";

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 900;
const ZOOM_STEP = 1.15;

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
    <main
      className="min-h-screen min-w-80 px-4 py-5 text-slate-200 sm:px-6 sm:py-8"
      style={{
        backgroundImage:
          "radial-gradient(circle at top, rgba(240,165,0,0.18), transparent 28%), linear-gradient(160deg, #09111f 0%, #132238 45%, #1b3146 100%)",
        fontFamily: "Space Grotesk, sans-serif",
      }}
    >
      <section className="mx-auto mb-6 max-w-190">
        <p className="mb-3 text-xs uppercase tracking-widest text-amber-400">
          MacAttack VTT
        </p>
        <h1 className="text-4xl leading-none sm:text-5xl lg:text-7xl">
          Drag tokens across the battlefield and track exact coordinates.
        </h1>
        <p className="max-w-2xl text-slate-200/85">
          This demo keeps token positions in React state, renders the map with
          Konva, and supports zoom via the mouse wheel or explicit controls.
        </p>
      </section>

      <section className="mx-auto grid max-w-360 grid-cols-1 items-start gap-6 xl:grid-cols-4">
        <GlassCard className="p-4.5 xl:col-span-3">
          <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="m-0 text-xs uppercase tracking-wider text-slate-200/65">
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

          <div className="overflow-auto rounded-3xl border border-white/10 bg-slate-950/90">
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

        <aside className="top-8 xl:col-span-1 xl:sticky">
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
