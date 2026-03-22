<script>
  import { invoke } from "@tauri-apps/api/core";
  import { listen } from "@tauri-apps/api/event";
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import { onMount } from "svelte";
  import { marked } from "marked";

  let inputText = $state("");
  let response = $state("");
  let isStreaming = $state(false);
  let conversationId = $state(null);
  let messageId = $state(null);
  let inputEl;

  onMount(() => {
    if (inputEl) inputEl.focus();

    const unlisten = listen("stream-event", (event) => {
      const { event: eventType, content, message_id } = event.payload;
      if (eventType === "delta" && message_id === messageId) {
        response += content;
      } else if (eventType === "done") {
        isStreaming = false;
      } else if (eventType === "error") {
        isStreaming = false;
        response = "Error: " + content;
      }
    });

    return () => { unlisten.then((fn) => fn()); };
  });

  async function send() {
    const text = inputText.trim();
    if (!text || isStreaming) return;

    response = "";
    isStreaming = true;

    try {
      if (!conversationId) {
        conversationId = await invoke("create_conversation", {
          title: text.length > 40 ? text.substring(0, 40) + "..." : text,
        });
      }

      messageId = await invoke("send_message", {
        conversationId,
        content: text,
        attachments: null,
      });
    } catch (e) {
      isStreaming = false;
      response = "Error: " + e;
    }
  }

  function handleKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
    if (e.key === "Escape") {
      getCurrentWindow().hide();
    }
  }

  function newQuestion() {
    inputText = "";
    response = "";
    conversationId = null;
    messageId = null;
    if (inputEl) inputEl.focus();
  }

  let renderedHtml = $derived(marked.parse(response));
</script>

<div class="quickask">
  <div class="input-row">
    <textarea
      bind:this={inputEl}
      bind:value={inputText}
      onkeydown={handleKeydown}
      placeholder="Quick ask Claude... (Esc to dismiss)"
      rows="1"
      disabled={isStreaming}
    ></textarea>
    {#if isStreaming}
      <button class="qa-btn" onclick={() => invoke("stop_generation")}>Stop</button>
    {:else}
      <button class="qa-btn send" onclick={send} disabled={!inputText.trim()}>Ask</button>
    {/if}
  </div>

  {#if response}
    <div class="response">
      {@html renderedHtml}
    </div>
    {#if !isStreaming}
      <div class="actions">
        <button class="qa-btn" onclick={newQuestion}>New Question</button>
        <button class="qa-btn" onclick={() => getCurrentWindow().hide()}>Dismiss</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .quickask {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .input-row {
    display: flex;
    gap: 8px;
    align-items: flex-end;
  }

  textarea {
    flex: 1;
    resize: none;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 14px;
    font-family: inherit;
    outline: none;
  }

  textarea:focus {
    border-color: var(--accent);
  }

  .qa-btn {
    padding: 8px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
  }

  .qa-btn.send {
    background: var(--accent);
    color: white;
    border: none;
  }

  .qa-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .response {
    flex: 1;
    overflow-y: auto;
    padding: 10px 12px;
    background: var(--bg-secondary);
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.5;
  }

  .response :global(pre) {
    background: var(--bg-tertiary, var(--bg-primary));
    padding: 8px;
    border-radius: 6px;
    overflow-x: auto;
  }

  .response :global(code) {
    font-size: 12px;
  }

  .response :global(p) {
    margin: 0 0 8px 0;
  }

  .actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
</style>
