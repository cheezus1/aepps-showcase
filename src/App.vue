<template>
  <ae-main id="main">
    <b-container fluid >
      <b-row>
        <b-col cols="6" class="left-col">
          <pending-submissions></pending-submissions>
        </b-col>
        <b-col cols="6" class="right-col">
          <pending-submissions></pending-submissions></b-col>
      </b-row>
    </b-container>
  </ae-main>
</template>
<script>
import PendingSubmissions from "./components/PendingSubmissions";
import { AeButton, AeMain } from "@aeternity/aepp-components";

export default {
  name: "app",
  components: {
    AeButton,
    AeMain,
    PendingSubmissions
  },
  data () {
    return {}
  }
};
</script>
<style>
  body {
    overflow: hidden;
  }

  #main{
    display: flex;
    flex-direction: row;
    width: 100%
  }

  .left-col {
    /* background-color: #e0eaf9; */
    height: 100vh;
    overflow:auto;
    padding: 10px;
  }

  .right-col {
    /* background-color: #e0eaf9; */
    height: 100vh;
    overflow:auto;
  }
</style>
