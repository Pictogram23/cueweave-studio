export type CueWeaveProject = {
  formatVersion: number;
  events: CueWeaveEvent[];
};

export type CueWeaveEvent = {
  name: string;
  actions: CueWeaveAction[];
};

export type CueWeaveAction = {
  type: "play";
  clipId: string;
  volume: number;
  pitch: number;
};
