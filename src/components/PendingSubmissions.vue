<template>
  <ae-card>
    <!-- <template slot="default"> -->
    <img id="img" src="../assets/logo.png">
    <ae-label>Title</ae-label>
    <ae-text>DescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescription</ae-text>
    <!-- </template> -->
  </ae-card>
</template>
<script>
import { AeMain, AeCard, AeLabel, AeText } from "@aeternity/aepp-components";
import ContractState from "../util/contract_state";

export default {
  name: "app",
  components: {
    AeMain,
    AeCard,
    AeLabel,
    AeText
  },
  data() {
    return {
      pending: ContractState.getPending().then(ContractState.pendingToObjects)
    }
  }
};
</script>
<style>
  img {
    float: left
  }

  ae-label, ae-text {
    display: block
  }
</style>
