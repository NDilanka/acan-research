// Concept registry. Each concept module default-exports:
//   { id, label, hint?, stage?, css, html, script }
// `script` must declare `function <id>Init(params)`, with any hyphen in the id written as an underscore (dir-a: dir_aInit).
// It runs after every built-in init. stage: "own" hides the ui-v1 plant in #stage and leaves the stage to the concept.
// A concept is active when the URL hash has c=<id>. Guard key handlers with conceptActive("<id>"),
// and scope CSS under body[data-concept="<id>"].
import orders from "./orders.mjs";
import clash from "./clash.mjs";
import gate from "./gate.mjs";
import bench from "./bench.mjs";
import world from "./world.mjs";

export const CONCEPTS = [orders, clash, gate, bench, world];
import quiet from "./quiet.mjs"; CONCEPTS.push(quiet);
import dirA from "./dir-a.mjs";
import dirB from "./dir-b.mjs";
import dirC from "./dir-c.mjs";
CONCEPTS.push(dirA, dirB, dirC);
