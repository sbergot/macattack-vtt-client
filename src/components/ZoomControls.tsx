import { useMapSettings } from "../hooks/useMapSettings";
import { ZoomButton } from "./ZoomButton";

export function ZoomControls({ zoom, applyZoom }: { zoom: number; applyZoom: (nextZoom: number) => void; }) {
  const { zoomStep } = useMapSettings();

  return <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <p className="m-0 text-xs uppercase tracking-wider text-slate-200/65">
        Zoom
      </p>
      <strong>{Math.round(zoom * 100)}%</strong>
    </div>
    <div className="flex gap-3">
      <ZoomButton onClick={() => applyZoom(zoom / zoomStep)}>
        -
      </ZoomButton>
      <ZoomButton onClick={() => applyZoom(1)}>Reset</ZoomButton>
      <ZoomButton onClick={() => applyZoom(zoom * zoomStep)}>
        +
      </ZoomButton>
    </div>
  </div>;
}
