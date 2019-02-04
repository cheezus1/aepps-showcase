<template>
  <!-- <div class="index-screen screen"> -->
    <header>
        <div class="fields">
          <h1>Submit an æpp</h1>
          <ae-input label="Title" class="field" aeddress></ae-input>
          <ae-input label="Description" class="field"></ae-input>
          <ae-input label="Contract address" class="field" aeddress></ae-input>
          <ae-input label="Web page" class="field"></ae-input>
        </div>
    </header>
  <!-- </div> -->
</template>

<script>
import { AeInput, AeLabel } from "@aeternity/aepp-components";

export default {
  components: {AeInput, AeLabel}
}
</script>
<style src='./new_aepp.scss' lang='scss' />
