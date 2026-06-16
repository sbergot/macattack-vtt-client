import { useState } from "react";
import type { KonvaEventObject } from "konva/lib/Node";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";
import mapImageUrl from "./assets/tactical-map.svg";
import { GlassCard } from "./components/GlassCard";
import { Token } from "./components/Token";
import { TokenRow } from "./components/TokenRow";
import type { TokenData } from "./types/token";
import { ZoomControls } from "./components/ZoomControls";
import { useTokenManager } from "./hooks/useTokenManager";
import { useMapSettings } from "./hooks/useMapSettings";

const initialTokens: TokenData[] = [
  { id: "alpha", label: "A", color: "#f25f5c", x: 220, y: 180, angle: 0 },
  { id: "bravo", label: "B", color: "#247ba0", x: 480, y: 320, angle: 55 },
  { id: "charlie", label: "C", color: "#70c1b3", x: 760, y: 510, angle: 225 },
];

export default function App() {
  const { mapWidth, mapHeight, zoomStep, zoomMin, zoomMax } =
    useMapSettings();
  const [zoom, setZoom] = useState<number>(1);
  const [mapImage] = useImage(mapImageUrl);

  const {
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
  } = useTokenManager(initialTokens);

  const applyZoom = (nextZoom: number) => {
    setZoom(Math.min(zoomMax, Math.max(zoomMin, nextZoom)));
  };

  const handleWheel = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();
    const direction = event.evt.deltaY > 0 ? 1 / zoomStep : zoomStep;
    applyZoom(zoom * direction);
  };

  return (
    <main className="min-h-screen min-w-80 bg-slate-950 px-4 py-5 font-sans text-slate-200 sm:px-6 sm:py-8">
      <Intro />

      <section className="mx-auto grid max-w-360 grid-cols-1 items-start gap-6 xl:grid-cols-4">
        <GlassCard className="p-4.5 xl:col-span-3">
          <ZoomControls zoom={zoom} applyZoom={applyZoom} />

          <div className="overflow-auto rounded-3xl border border-white/10 bg-slate-950/90">
            <Stage
              width={mapWidth * zoom}
              height={mapHeight * zoom}
              scaleX={zoom}
              scaleY={zoom}
              onWheel={handleWheel}
              onMouseDown={clearSelection}
              onTouchStart={clearSelection}
            >
              <Layer listening={false}>
                <KonvaImage
                  image={mapImage}
                  width={mapWidth}
                  height={mapHeight}
                  cornerRadius={24}
                />
              </Layer>
              <Layer>
                {orderedTokens.map((token) => (
                  <Token
                    key={token.id}
                    token={token}
                    tokenSelection={tokenSelection}
                    onMove={updateToken}
                    onRotate={updateTokenAngle}
                    onSelect={selectToken}
                    onMoveAction={activateMoveGuide}
                    onRotateAction={activateRotateGuide}
                    onMoveGuideEnd={completeMoveGuide}
                    onRotateGuideEnd={completeRotateGuide}
                  />
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
            <div className="mt-4 rounded-lg border border-emerald-400/30 bg-slate-900/80 p-3">
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                tokenSelection (debug)
              </p>
              <pre className="m-0 mt-2 overflow-x-auto text-xs text-emerald-100">
                {JSON.stringify(tokenSelection, null, 2)}
              </pre>
            </div>
            <ul className="mt-6 grid list-none gap-3.5 p-0">
              {orderedTokens.map((token) => (
                <TokenRow
                  key={token.id}
                  token={token}
                  isSelected={tokenSelection.tokenId === token.id}
                  onSelect={selectToken}
                />
              ))}
            </ul>
          </GlassCard>
        </aside>
      </section>
    </main>
  );
}

function Intro() {
  return <section className="mx-auto mb-6 max-w-190">
    <h1 className="text-2xl uppercase tracking-widest text-amber-400">
      MacAttack VTT
    </h1>
  </section>;
}

