import { ZOOM_STEP } from "../App";
import { ZoomButton } from "./ZoomButton";

export function ZoomControls({ zoom, applyZoom }: { zoom: number; applyZoom: (nextZoom: number) => void; }) {
  return <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
  </div>;
}
