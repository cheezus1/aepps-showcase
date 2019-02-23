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
        <div class="identity">
          <ae-identity v-bind="identity" active collapsed />
        </div>
      </div>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script>
import { AeIdentity } from "@aeternity/aepp-components";
import axios from "axios";

export default {
  name: "App",
  components: { AeIdentity },
  data() {
    return {
      identity: {
        address: undefined,
        balance: undefined
      }
    };
  },
  created: function() {
    let that = this;
    axios
      .get("http://localhost:8000/balance")
      .then(account => {
        let balance = parseFloat(account.data.balance.split(" ")[0]);
        that.identity = { balance: balance, address: account.data.pubkey };
      })
      .catch(function(error) {
        console.log(error);
      });
  }
};
</script>
<style src="./app.scss" lang="scss" />
