<script>
  import Sidebar from "./lib/Sidebar.svelte";
  import Chat from "./lib/Chat.svelte";
  import Settings from "./lib/Settings.svelte";

  let currentView = $state("chat");
  let activeConversationId = $state(null);
  let sidebarRefresh = $state(0);

  function onSelectConversation(id) {
    activeConversationId = id;
    currentView = "chat";
  }

  function onNewChat() {
    activeConversationId = null;
    currentView = "chat";
  }

  function onConversationCreated(id) {
    activeConversationId = id;
    sidebarRefresh++;
  }

  function openSettings() {
    currentView = "settings";
  }

  function closeSettings() {
    currentView = "chat";
  }
</script>

<div class="app-layout">
  <Sidebar
    {activeConversationId}
    onSelect={onSelectConversation}
    {onNewChat}
    {openSettings}
    refreshKey={sidebarRefresh}
  />
  <main class="main-content">
    {#if currentView === "settings"}
      <Settings onClose={closeSettings} />
    {:else}
      <Chat
        conversationId={activeConversationId}
        {onConversationCreated}
      />
    {/if}
  </main>
</div>

<style>
  .app-layout {
    display: flex;
    height: 100vh;
    width: 100vw;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>
