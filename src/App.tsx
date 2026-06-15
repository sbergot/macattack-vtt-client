import { useMemo, useState } from 'react';
import type { KonvaEventObject } from 'konva/lib/Node';
import { Circle, Group, Image as KonvaImage, Layer, Line, Stage, Text } from 'react-konva';
import useImage from 'use-image';
import mapImageUrl from './assets/tactical-map.svg';

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 900;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 1.15;

type TokenData = {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  angle: number;
};

type TokenPosition = Pick<TokenData, 'x' | 'y'>;

type TokenProps = {
  token: TokenData;
  onMove: (tokenId: string, position: TokenPosition) => void;
};

const initialTokens: TokenData[] = [
  { id: 'alpha', label: 'A', color: '#f25f5c', x: 220, y: 180, angle: 0 },
  { id: 'bravo', label: 'B', color: '#247ba0', x: 480, y: 320, angle: 55 },
  { id: 'charlie', label: 'C', color: '#70c1b3', x: 760, y: 510, angle: 225 },
];

function clampZoom(nextZoom: number): number {
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
      <Circle radius={26} fill={token.color} shadowColor="rgba(10, 17, 40, 0.35)" shadowBlur={12} shadowOffsetY={6} />
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

export default function App() {
  const [tokens, setTokens] = useState<TokenData[]>(initialTokens);
  const [zoom, setZoom] = useState<number>(1);
  const [mapImage] = useImage(mapImageUrl);

  const orderedTokens = useMemo(
    () => tokens.slice().sort((left, right) => left.label.localeCompare(right.label)),
    [tokens],
  );

  const updateToken = (tokenId: string, position: TokenPosition) => {
    setTokens((currentTokens) =>
      currentTokens.map((token) => (token.id === tokenId ? { ...token, ...position } : token)),
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
    <main className="app-shell">
      <section className="hero-copy">
        <p className="eyebrow">MacAttack VTT</p>
        <h1>Drag tokens across the battlefield and track exact coordinates.</h1>
        <p className="lede">
          This demo keeps token positions in React state, renders the map with Konva, and supports zoom via the mouse wheel or explicit controls.
        </p>
      </section>

      <section className="board-layout">
        <div className="board-panel">
          <div className="board-toolbar">
            <div>
              <p className="toolbar-label">Zoom</p>
              <strong>{Math.round(zoom * 100)}%</strong>
            </div>
            <div className="zoom-actions">
              <button type="button" onClick={() => applyZoom(zoom / ZOOM_STEP)}>
                -
              </button>
              <button type="button" onClick={() => applyZoom(1)}>
                Reset
              </button>
              <button type="button" onClick={() => applyZoom(zoom * ZOOM_STEP)}>
                +
              </button>
            </div>
          </div>

          <div className="stage-frame">
            <Stage
              width={MAP_WIDTH * zoom}
              height={MAP_HEIGHT * zoom}
              scaleX={zoom}
              scaleY={zoom}
              onWheel={handleWheel}
            >
              <Layer>
                <KonvaImage image={mapImage} width={MAP_WIDTH} height={MAP_HEIGHT} cornerRadius={24} />
                {orderedTokens.map((token) => (
                  <Token key={token.id} token={token} onMove={updateToken} />
                ))}
              </Layer>
            </Stage>
          </div>
        </div>

        <aside className="sidebar">
          <div className="sidebar-card">
            <h2>Token Coordinates</h2>
            <p>Drag any token on the map to update its position in state. Orientation is stored as degrees clockwise from the top direction.</p>
            <ul className="token-list">
              {orderedTokens.map((token) => (
                <li key={token.id}>
                  <span className="token-chip" style={{ backgroundColor: token.color }}>
                    {token.label}
                  </span>
                  <div>
                    <strong>{token.id}</strong>
                    <p>
                      x: {token.x}, y: {token.y}, angle: {token.angle}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}