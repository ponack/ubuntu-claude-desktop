<script>
  import { invoke } from "@tauri-apps/api/core";
  import { onMount } from "svelte";

  let { onClose } = $props();

  let apiKey = $state("");
  let model = $state("claude-sonnet-4-6");
  let saved = $state(false);
  let error = $state("");

  const models = [
    { id: "claude-opus-4-6", name: "Claude Opus 4.6 (Most capable)" },
    { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6 (Balanced)" },
    { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5 (Fast)" },
  ];

  onMount(async () => {
    try {
      const key = await invoke("get_api_key");
      if (key) apiKey = key;
      model = await invoke("get_model");
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  });

  async function save() {
    error = "";
    saved = false;
    try {
      await invoke("set_api_key", { key: apiKey });
      await invoke("set_model", { model });
      saved = true;
      setTimeout(() => (saved = false), 2000);
    } catch (e) {
      error = String(e);
    }
  }
</script>

<div class="settings">
  <div class="settings-header">
    <h2>Settings</h2>
    <button class="close-btn" onclick={onClose}>Back to Chat</button>
  </div>

  <div class="settings-body">
    <div class="setting-group">
      <label for="api-key">Anthropic API Key</label>
      <input
        id="api-key"
        type="password"
        bind:value={apiKey}
        placeholder="sk-ant-..."
      />
      <p class="hint">
        Get your API key from
        <span class="link">console.anthropic.com</span>
      </p>
    </div>

    <div class="setting-group">
      <label for="model">Model</label>
      <select id="model" bind:value={model}>
        {#each models as m}
          <option value={m.id}>{m.name}</option>
        {/each}
      </select>
    </div>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <button class="save-btn" onclick={save}>
      {saved ? "Saved!" : "Save Settings"}
    </button>
  </div>
</div>

<style>
  .settings {
    padding: 24px;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
  }

  h2 {
    font-size: 20px;
    font-weight: 600;
  }

  .close-btn {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 13px;
    color: var(--text-secondary);
    border: 1px solid var(--border);
    transition: background 0.15s;
  }

  .close-btn:hover {
    background: var(--bg-tertiary);
  }

  .settings-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .setting-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  input, select {
    padding: 10px 12px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s;
  }

  input:focus, select:focus {
    border-color: var(--accent);
  }

  select {
    cursor: pointer;
  }

  option {
    background: var(--bg-secondary);
  }

  .hint {
    font-size: 12px;
    color: var(--text-muted);
  }

  .link {
    color: var(--accent);
  }

  .error {
    color: var(--danger);
    font-size: 13px;
  }

  .save-btn {
    padding: 10px 20px;
    background: var(--accent);
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.15s;
    align-self: flex-start;
  }

  .save-btn:hover {
    background: var(--accent-hover);
  }
</style>
