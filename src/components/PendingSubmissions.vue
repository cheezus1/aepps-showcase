<template>
  <div id="main">
  <ae-card fill="neutral">
    <template slot="header">
    <img id="img" height=200px width=200px src="../assets/logo.png">
    </template>
    <h2 class="txt">Title</h2>
    <h3 class="txt">Description</h3>
    <ae-toolbar fill="" align="right" slot="footer">
      owner address
    </ae-toolbar>
  </ae-card>
  </div>
</template>
<script>
import { AeMain, AeCard } from "@aeternity/aepp-components";

export default {
  name: "app",
  components: {
    AeMain,
    AeCard
  }
};
</script>
<style>
  #main{
    max-width: 800px;
    height: 40%;
  }
  .txt{
    color: #ffffff;
    display: block;
  }
  #img{
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
