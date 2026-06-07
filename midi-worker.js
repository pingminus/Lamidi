let startTime = null;
let events = [];
let isPlaying = false;
let timeoutIds = [];

self.onmessage = (e) => {
  const { type, data } = e.data;

  if (type === "start") {
    events = data;
    startTime = performance.now();
    isPlaying = true;
    scheduleEvents();
  }

  if (type === "stop") {
    isPlaying = false;
    timeoutIds.forEach((id) => clearTimeout(id));
    timeoutIds = [];
  }
};

function scheduleEvents() {
  events.forEach((event) => {
    const delayMs = event.time * 1000;
    const timeoutId = setTimeout(() => {
      if (isPlaying) {
        self.postMessage({
          type: "sendNote",
          payload: {
            type: "note",
            note: event.midi,
            velocity: Math.floor(event.velocity * 127),
            duration: event.duration,
          },
        });
      }
    }, delayMs);
    timeoutIds.push(timeoutId);
  });
}
