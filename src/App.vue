<template>
  <div>
    <pending-submissions></pending-submissions>
  </div>
</template>
<script>
import PendingSubmissions from "./components/PendingSubmissions";
import { AeButton } from "@aeternity/aepp-components";
import ContractState from "./util/contract_state";

export default {
  name: "app",
  components: {
    AeButton,
    PendingSubmissions
  },
  data () {
    return { data: ContractState.get() }
  }
};
</script>
<style>
</style>
