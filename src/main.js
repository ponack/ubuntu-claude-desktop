import { mount } from "svelte";
import App from "./App.svelte";
import QuickAsk from "./lib/QuickAsk.svelte";

const isQuickAsk = new URLSearchParams(window.location.search).has("quickask");

const app = mount(isQuickAsk ? QuickAsk : App, {
  target: document.getElementById("app"),
});

export default app;
