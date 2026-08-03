import { useState } from "react";
import type { CueWeaveEvent, CueWeaveProject } from "./cueweave";

const createEmptyEvent = (): CueWeaveEvent => ({
  name: "",
  actions: [
    {
      type: "play",
      clipId: "",
    },
  ],
});

function App() {
  const [events, setEvents] = useState<CueWeaveEvent[]>([
    {
      name: "PlayerDamaged",
      actions: [
        {
          type: "play",
          clipId: "player_damage",
        },
      ],
    },
  ]);

  const addEvent = (): void => {
    setEvents((currentEvents) => [...currentEvents, createEmptyEvent()]);
  };

  const removeEvent = (eventIndex: number): void => {
    setEvents((currentEvents) =>
      currentEvents.filter((_, index) => index !== eventIndex),
    );
  };

  const updateEventName = (eventIndex: number, name: string): void => {
    setEvents((currentEvents) =>
      currentEvents.map((eventItem, index) =>
        index === eventIndex
          ? {
              ...eventItem,
              name,
            }
          : eventItem,
      ),
    );
  };

  const updateClipId = (eventIndex: number, clipId: string): void => {
    setEvents((currentEvents) =>
      currentEvents.map((eventItem, index) =>
        index === eventIndex
          ? {
              ...eventItem,
              actions: [
                {
                  type: "play",
                  clipId,
                },
              ],
            }
          : eventItem,
      ),
    );
  };

  const exportProject = (): void => {
    const project: CueWeaveProject = {
      formatVersion: 1,
      events,
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

      <div className="events-list">
        {events.map((eventItem, index) => {
          const eventNameId = `event-name-${index}`;
          const clipIdInputId = `clip-id-${index}`;
          const clipId = eventItem.actions[0]?.clipId ?? "";

          return (
            <section className="event-card" key={index}>
              <h2>Event {index + 1}</h2>

              <div className="field">
                <label htmlFor={eventNameId}>Event name</label>

                <input
                  id={eventNameId}
                  type="text"
                  value={eventItem.name}
                  onChange={(event) => {
                    updateEventName(index, event.target.value);
                  }}
                />
              </div>

              <div className="field">
                <label htmlFor={clipIdInputId}>Clip ID</label>

                <input
                  id={clipIdInputId}
                  type="text"
                  value={clipId}
                  onChange={(event) => {
                    updateClipId(index, event.target.value);
                  }}
                />
              </div>

              <button
                className="remove-button"
                type="button"
                onClick={() => {
                  removeEvent(index);
                }}
              >
                Remove event
              </button>
            </section>
          );
        })}
      </div>

      <div className="actions">
        <button type="button" onClick={addEvent}>
          Add event
        </button>

        <button className="export-button" type="button" onClick={exportProject}>
          Export JSON
        </button>
      </div>
    </main>
  );
}

export default App;
