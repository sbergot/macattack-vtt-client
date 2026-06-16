type MacClass = 1 | 2 | 3;

type Score = 1 | 2 | 3 | 4 | 5 | 6;
type Score0 = 0 | Score;

type ModuleState = "normal" | "damaged" | "destroyed";

interface MacSlot {
  module: string;
  state: ModuleState;
}

export interface Mac {
  name: string;
  class: MacClass;
  slots: Record<Score, MacSlot>;
  heat: Score0;
  motion: Score;
  jolt: Score0;
  rad: Score0;
  internalDamage: Score0;
  crashed: boolean;
}

