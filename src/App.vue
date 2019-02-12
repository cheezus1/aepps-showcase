<template>
  <div id="app">
    <nav class="app-nav">
      <div class="inner">
        <RouterLink class="logo" to="/">
          <img src="./assets/header-logo.svg" />
          <span class="app-name">
            showcase
          </span>
        </RouterLink>
        <div class="links">
          <RouterLink class="link" to="/">
            Approved
          </RouterLink>
          <RouterLink class="link" to="/pending">
            Pending
          </RouterLink>
          <RouterLink class="link" to="/governance">
            Governance
          </RouterLink>
        </div>
        <div />
      </div>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {};
  }
};
</script>
<style src="./app.scss" lang="scss" />
