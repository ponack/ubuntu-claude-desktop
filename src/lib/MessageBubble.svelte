<script>
  import { marked } from "marked";

  let { role, content, isStreaming } = $props();

  let renderedHtml = $derived(
    role === "error" ? content : marked.parse(content || "")
  );
</script>

<div class="message" class:user={role === "user"} class:assistant={role === "assistant"} class:error={role === "error"}>
  <div class="message-header">
    {#if role === "user"}
      <span class="role-label">You</span>
    {:else if role === "assistant"}
      <span class="role-label">Claude</span>
      {#if isStreaming}
        <span class="streaming-indicator"></span>
      {/if}
    {:else if role === "error"}
      <span class="role-label error-label">Error</span>
    {/if}
  </div>
  <div class="message-content">
    {#if role === "error"}
      <p class="error-text">{content}</p>
    {:else}
      {@html renderedHtml}
    {/if}
  </div>
</div>

<style>
  .message {
    max-width: 85%;
    padding: 12px 16px;
    border-radius: 12px;
    line-height: 1.6;
  }

  .message.user {
    align-self: flex-end;
    background: var(--user-bubble);
  }

  .message.assistant {
    align-self: flex-start;
    background: var(--assistant-bubble);
    border: 1px solid var(--border);
  }

  .message.error {
    align-self: center;
    background: rgba(233, 69, 96, 0.1);
    border: 1px solid var(--danger);
    max-width: 90%;
  }

  .message-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .role-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .error-label {
    color: var(--danger);
  }

  .error-text {
    color: var(--danger);
    font-size: 13px;
  }

  .streaming-indicator {
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .message-content :global(pre) {
    background: rgba(0, 0, 0, 0.3);
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 8px 0;
  }

  .message-content :global(code) {
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 13px;
  }

  .message-content :global(p) {
    margin-bottom: 8px;
  }

  .message-content :global(p:last-child) {
    margin-bottom: 0;
  }

  .message-content :global(ul), .message-content :global(ol) {
    padding-left: 20px;
    margin: 8px 0;
  }

  .message-content :global(a) {
    color: var(--accent);
    text-decoration: none;
  }

  .message-content :global(a:hover) {
    text-decoration: underline;
  }
</style>
