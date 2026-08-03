import { useState } from "react";
import type {
  CueWeaveAction,
  CueWeaveEvent,
  CueWeaveProject,
} from "./cueweave";

const createEmptyAction = (): CueWeaveAction => ({
  type: "play",
  clipId: "",
  volume: 1,
  pitch: 1,
});

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const createEmptyEvent = (): CueWeaveEvent => ({
  name: "",
  actions: [createEmptyAction()],
});

function App() {
  const [events, setEvents] = useState<CueWeaveEvent[]>([
    {
      name: "PlayerDamaged",
      actions: [
        {
          type: "play",
          clipId: "player_damage",
          volume: 1,
          pitch: 1,
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

  const addAction = (eventIndex: number): void => {
    setEvents((currentEvents) =>
      currentEvents.map((eventItem, index) =>
        index === eventIndex
          ? {
              ...eventItem,
              actions: [...eventItem.actions, createEmptyAction()],
            }
          : eventItem,
      ),
    );
  };

  const removeAction = (eventIndex: number, actionIndex: number): void => {
    setEvents((currentEvents) =>
      currentEvents.map((eventItem, index) =>
        index === eventIndex
          ? {
              ...eventItem,
              actions: eventItem.actions.filter(
                (_, index) => index !== actionIndex,
              ),
            }
          : eventItem,
      ),
    );
  };

  const updateActionClipId = (
    eventIndex: number,
    actionIndex: number,
    clipId: string,
  ): void => {
    setEvents((currentEvents) =>
      currentEvents.map((eventItem, index) =>
        index === eventIndex
          ? {
              ...eventItem,
              actions: eventItem.actions.map((action, index) =>
                index === actionIndex
                  ? {
                      ...action,
                      clipId,
                    }
                  : action,
              ),
            }
          : eventItem,
      ),
    );
  };

  const updateActionVolume = (
    eventIndex: number,
    actionIndex: number,
    volume: number,
  ): void => {
    if (!Number.isFinite(volume)) {
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.map((eventItem, index) =>
        index === eventIndex
          ? {
              ...eventItem,
              actions: eventItem.actions.map((action, index) =>
                index === actionIndex
                  ? {
                      ...action,
                      volume: clamp(volume, 0, 1),
                    }
                  : action,
              ),
            }
          : eventItem,
      ),
    );
  };

  const updateActionPitch = (
    eventIndex: number,
    actionIndex: number,
    pitch: number,
  ): void => {
    if (!Number.isFinite(pitch)) {
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.map((eventItem, index) =>
        index === eventIndex
          ? {
              ...eventItem,
              actions: eventItem.actions.map((action, index) =>
                index === actionIndex
                  ? {
                      ...action,
                      pitch: clamp(pitch, 0.1, 3),
                    }
                  : action,
              ),
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
        {events.map((eventItem, eventIndex) => {
          const eventNameId = `event-name-${eventIndex}`;

          return (
            <section className="event-card" key={eventIndex}>
              <h2>Event {eventIndex + 1}</h2>

              <div className="field">
                <label htmlFor={eventNameId}>Event name</label>

                <input
                  id={eventNameId}
                  type="text"
                  value={eventItem.name}
                  onChange={(event) => {
                    updateEventName(eventIndex, event.target.value);
                  }}
                />
              </div>

              <div className="event-actions">
                <h3>Actions</h3>

                <div className="action-list">
                  {eventItem.actions.map((action, actionIndex) => {
                    const clipIdInputId = `clip-id-${eventIndex}-${actionIndex}`;
                    const volumeInputId = `volume-${eventIndex}-${actionIndex}`;
                    const pitchInputId = `pitch-${eventIndex}-${actionIndex}`;

                    return (
                      <section className="action-card" key={actionIndex}>
                        <h4>Action {actionIndex + 1}</h4>

                        <div className="field">
                          <span className="field-label">Type</span>
                          <span className="action-type">Play</span>
                        </div>

                        <div className="field">
                          <label htmlFor={clipIdInputId}>Clip ID</label>

                          <input
                            id={clipIdInputId}
                            type="text"
                            value={action.clipId}
                            onChange={(event) => {
                              updateActionClipId(
                                eventIndex,
                                actionIndex,
                                event.target.value,
                              );
                            }}
                          />
                        </div>

                        <div className="parameter-fields">
                          <div className="field">
                            <label htmlFor={volumeInputId}>Volume</label>

                            <input
                              id={volumeInputId}
                              type="number"
                              min="0"
                              max="1"
                              step="0.1"
                              value={action.volume}
                              onChange={(event) => {
                                updateActionVolume(
                                  eventIndex,
                                  actionIndex,
                                  event.target.valueAsNumber,
                                );
                              }}
                            />
                          </div>

                          <div className="field">
                            <label htmlFor={pitchInputId}>Pitch</label>

                            <input
                              id={pitchInputId}
                              type="number"
                              min="0.1"
                              max="3"
                              step="0.1"
                              value={action.pitch}
                              onChange={(event) => {
                                updateActionPitch(
                                  eventIndex,
                                  actionIndex,
                                  event.target.valueAsNumber,
                                );
                              }}
                            />
                          </div>
                        </div>

                        <button
                          className="remove-action-button"
                          type="button"
                          onClick={() => {
                            removeAction(eventIndex, actionIndex);
                          }}
                        >
                          Remove action
                        </button>
                      </section>
                    );
                  })}
                </div>

                <button
                  className="add-action-button"
                  type="button"
                  onClick={() => {
                    addAction(eventIndex);
                  }}
                >
                  Add action
                </button>
              </div>

              <button
                className="remove-event-button"
                type="button"
                onClick={() => {
                  removeEvent(eventIndex);
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
