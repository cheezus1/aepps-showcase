<template>
  <ae-card>
  <template slot="avatar">
    <ae-identicon address="ak_QY8VNEkhj7omMUjAvfVBq2NjTDy895LBYbk7qVxQo1qT8VqfE" />
    <ae-input-plain placeholder="Account name" value="My account" />
  </template>
  <ae-icon name="more" size="20px" slot="header" />
  <ae-text face="uppercase-xs" weight=600 style="margin: 0">Normal Secured</ae-text>
  <ae-address value="ak_QY8VNEkhj7omMUjAvfVBq2NjTDy895LBYbk7qVxQo1qT8VqfE" length="medium" gap=0 />
  <ae-toolbar align="right" slot="footer">
    <ae-button face="toolbar">
      <ae-icon name="eye" />
      Details
    </ae-button>
    <ae-button face="toolbar">
      <ae-icon name="copy" />
      Copy
    </ae-button>
    <ae-button face="toolbar">
      <ae-icon name="share" />
      Share
    </ae-button>
  </ae-toolbar>
</ae-card>
</template>
<script>
import { AeMain } from "@aeternity/aepp-components";

export default {
  name: "app",
  components: {
    AeMain
  }
};
</script>
<style>
</style>
