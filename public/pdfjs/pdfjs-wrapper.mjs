import * as pdfjsLib from "./pdf.mjs";

// Expose to window for app code.
window.pdfjsLib = pdfjsLib;

// Configure worker (no CDN)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "./pdf.worker.min.mjs",
  import.meta.url
).toString();
