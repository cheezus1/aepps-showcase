<template>
  <div>
    <pending-submissions></pending-submissions>
    <ae-button face="round">button content</ae-button>
  </div>
</template>
<script>
import PendingSubmissions from "./components/PendingSubmissions";
import { AeButton } from "@aeternity/aepp-components";

export default {
  name: "app",
  components: {
    AeButton,
    PendingSubmissions
  }
};
</script>
<style>
</style>
