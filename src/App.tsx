import { useState } from "react";
import type { CueWeaveProject } from "./cueweave";

function App() {
  const [eventName, setEventName] = useState("PlayerDamaged");
  const [clipId, setClipId] = useState("player_damage");

  const exportProject = (): void => {
    const project: CueWeaveProject = {
      formatVersion: 1,
      events: [
        {
          name: eventName,
          actions: [
            {
              type: "play",
              clipId,
            },
          ],
        },
      ],
    };

    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "cueweave-project.json";
    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <h1>CueWeave Studio</h1>

      <div>
        <label htmlFor="event-name">Event name</label>

        <input
          id="event-name"
          type="text"
          value={eventName}
          onChange={(event) => {
            setEventName(event.target.value);
          }}
        />
      </div>

      <div>
        <label htmlFor="clip-id">Clip ID</label>

        <input
          id="clip-id"
          type="text"
          value={clipId}
          onChange={(event) => {
            setClipId(event.target.value);
          }}
        />
      </div>

      <button type="button" onClick={exportProject}>
        Export JSON
      </button>
    </main>
  );
}

export default App;