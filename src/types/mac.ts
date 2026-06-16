type MacClass = 1 | 2 | 3;

type Score = 1 | 2 | 3 | 4 | 5 | 6;

type Score0 = 0 | Score;

type ModuleState = "normal" | "damaged" | "destroyed";

interface Hardware {
  type: "hardware";
  name: string;
}

interface Weapon {
  type: "weapon";
  name: string;
}

interface Brawl {
  type: "brawl";
  name: string;
}

type Module = Hardware | Weapon | Brawl;

interface Slot {
  module: Module;
  state: ModuleState;
}

export interface Mac {
  name: string;
  class: MacClass;
  slots: Record<Score, Slot>;
  heat: Score0;
  motion: Score;
  jolt: Score0;
  rad: Score0;
  internalDamage: number;
  crashed: boolean;
}

export interface MacDesign {
  name: string;
  class: MacClass;
  slots: Record<Score, Module>;
}