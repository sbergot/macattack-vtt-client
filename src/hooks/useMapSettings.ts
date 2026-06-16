type MapSettings = {
  mapWidth: number;
  mapHeight: number;
  zoomStep: number;
  zoomMin: number;
  zoomMax: number;
};

const MAP_SETTINGS: MapSettings = {
  mapWidth: 1600,
  mapHeight: 900,
  zoomStep: 1.15,
  zoomMin: 0.5,
  zoomMax: 2.5,
};

export function useMapSettings(): MapSettings {
  return MAP_SETTINGS;
}
