<template>
  <div class="index-screen screen">
    <header>
        <div class="grid">
          <div>
            <h1>æternity æpps showcase</h1>
            <p>discover popular and newly emerging æpps</p>
          </div>
          <div class="submit">
            <RouterLink
              to="/new_aepp"
            >
              <ae-button face="round" fill="primary">Submit an æpp</ae-button>
            </RouterLink>
          </div>
        </div>
    </header>
  </div>
</template>

<script>

import { AeButton } from "@aeternity/aepp-components";

export default {
  components: {AeButton}
}
</script>
<style src='./index.scss' lang='scss' />
