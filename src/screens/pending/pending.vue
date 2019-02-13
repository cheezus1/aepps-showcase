<template>
  <div class="grid" id="pending-aepps-container">
    <div
      v-for="(pendingAepp, aeppIpfsHash, index) in pendingAepps"
      :key="pendingAepp.title"
      class="pending-aepp"
    >
      <div class="pending-aepp-items">
        <div class="buttons">
          <ae-button
            face="icon"
            fill="secondary"
            @click="vote(aeppIpfsHash, 'Approve')"
          >
            <ae-icon name="check"></ae-icon>
          </ae-button>
          <ae-button
            face="icon"
            fill="secondary"
            @click="vote(aeppIpfsHash, 'Reject')"
          >
            <ae-icon name="close"></ae-icon>
          </ae-button>
        </div>
        <ae-app-icon :src="pendingAepp.image" />
        <div class="pending-aepp-description">
          <span class="pending-aepp-title">{{ pendingAepp.title }}</span>
          <span class="pending-aepp-short-description">{{
            pendingAepp.short_description
          }}</span>
        </div>
        <div class="finalize-btns">
          <ae-button fill="primary" face="round" class="confirm-vote-btn"
            >Confirm vote</ae-button
          >
          <!-- <ae-button fill="primary" face="round">Finalize voting</ae-button> -->
        </div>
      </div>
      <ae-divider
        v-if="index < Object.keys(pendingAepps).length - 1"
        type="exciting"
      />
    </div>
    <ae-modal
      v-if="voteModalVisible"
      @close="voteModalVisible = false"
      :title="voteModalMessage"
    >
      <ae-amount-input
        placeholder="0.00"
        v-model="voteModalValue"
        :units="[{ symbol: 'AE', name: 'æternity' }]"
      />
      <ae-button
        face="round"
        fill="primary"
        id="submit-vote-btn"
        @click="submitVote()"
        >Submit</ae-button
      >
    </ae-modal>
  </div>
</template>

<script>
import {
  AeDivider,
  AeButton,
  AeIcon,
  AeModal,
  AeAmountInput,
  AeAppIcon
} from "@aeternity/aepp-components";
import { sha3_256 } from "js-sha3";
import PendingAepps from "../../util/pending_aepps";
const crypto = require("crypto");

export default {
  components: {
    AeDivider,
    AeButton,
    AeIcon,
    AeModal,
    AeAmountInput,
    AeAppIcon
  },
  data() {
    return {
      pendingAepps: PendingAepps.pendingAepps(),
      voteModalMessage: "",
      voteModalValue: { symbol: "AE", amount: undefined },
      voteModalVisible: false,
      voteSubmissionData: {}
    };
  },
  methods: {
    vote: function(aeppIpfsHash, vote) {
      this.voteModalMessage =
        vote + " æpp " + this.pendingAepps[aeppIpfsHash].title + " ?";
      this.voteModalVisible = true;

      let salt = crypto.randomBytes(32).toString("hex");
      let commitmentHash = sha3_256(vote + salt);
      this.voteSubmissionData = {
        aeppIpfsHash: aeppIpfsHash,
        commitmentHash: commitmentHash,
        vote: vote,
        salt: salt
      };
      localStorage.setItem(
        aeppIpfsHash,
        JSON.stringify(this.voteSubmissionData)
      );
    },
    submitVote: function() {
      // console.log(localStorage.getItem(this.voteSubmissionData.aeppIpfsHash));
      // call contract
    }
  }
};
</script>
<style src="./pending.scss" lang="scss" />
