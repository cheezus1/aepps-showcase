<template>
  <!-- <b-container fluid>
    <b-row v-for="p in pending" class="pending">
      <b-col cols="3">
        <img src="../assets/logo.png" width="100%" height="auto">
      </b-col>
      <b-col cols="9">
        <h4>{{ p.title }}</h4>
        <ae-link :to="p.page_url" class="page-url">{{ p.page_url }}</ae-link>
        <ae-text class="description">{{ p.description }}</ae-text>
        <ae-button-group shadow="true">
          <ae-button face="round" fill="primary">Button</ae-button>
          <ae-button face="round" fill="neutral">Group</ae-button>
        </ae-button-group>
      </b-col>
    </b-row>
  </b-container> -->
</template>
<script>
import { AeMain, AeText, AeDivider, AeLink, AeButton, AeButtonGroup } from "@aeternity/aepp-components";
import ContractState from "../util/contract_state";

export default {
  name: "app",
  components: {
    AeMain,
    AeText,
    AeDivider,
    AeLink,
    AeButton,
    AeButtonGroup
  },
  data() {
    return {
      pending: []
    }
  },
  methods: {
    getPending() {
      ContractState.getPending().then((data) => {
        this.pending = ContractState.pendingToObjects(data)
      })
    }
  },
  created: function() {
    this.getPending()
  }
};
</script>
<style>
  .pending {
    width: 100%;
    font-size: 1.0625rem;
    line-height: 1.5rem;
    padding: 15px 10px;
    border-bottom: 2px solid rgba(240, 60, 110, 0.35);
  }

  h4 {
    color: #f03c6e !important;
    font-family: "Inter UI", sans-serif;
  }

  .description {
    color: rgba(0,0,0,0.65);
  }

  .page-url {
    text-decoration: underline;
    color: #f688a7;
    margin-bottom: 0.5rem;
    display: block;
  }
</style>
