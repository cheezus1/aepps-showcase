<template>
  <ae-main id="main">
    <pending-submissions></pending-submissions>
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
    return { data: ContractState.get() }
  }
};
</script>
<style>
  #main{
    display: flex;
    flex-direction: row;
    width: 100%
  }
</style>
