<template>
  <div class="grid" id="pending-aepps-container">
    <notifications group="notify" position="bottom center" />
    <div class="loader" v-if="loaderVisible"><ae-loader /></div>
    <div
      v-for="(pendingAepp, ipfsHash, index) in pendingAepps"
      :key="pendingAepp.title"
      class="pending-aepp"
    >
      <div class="pending-aepp-items">
        <div class="buttons">
          <ae-button
            face="icon"
            fill="secondary"
            @click="vote(ipfsHash, 'Approve')"
          >
            <ae-icon name="check"></ae-icon>
          </ae-button>
          <ae-button
            face="icon"
            fill="secondary"
            @click="vote(ipfsHash, 'Reject')"
          >
            <ae-icon name="close"></ae-icon>
          </ae-button>
        </div>
        <ae-app-icon :src="pendingAepp.image" />
        <div class="pending-aepp-description">
          <span class="pending-aepp-title">{{ pendingAepp.title }}</span>
          <span class="pending-aepp-short-description">{{
            pendingAepp.shortDescription
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
        placeholder="0"
        v-model="voteModalValue"
        :units="[{ symbol: 'ætto', name: 'æternity' }]"
      />
      <ae-button
        face="round"
        fill="primary"
        id="submit-vote-btn"
        @click="submitVote()"
        :disabled="voteSubmitBtnDisabled"
        >Submit</ae-button
      >
    </ae-modal>
  </div>
</template>

<script>
import {
  AeLoader,
  AeDivider,
  AeButton,
  AeIcon,
  AeModal,
  AeAmountInput,
  AeAppIcon
} from "@aeternity/aepp-components";
import { sha3_256 } from "js-sha3";
import axios from "axios";
const crypto = require("crypto");

export default {
  components: {
    AeLoader,
    AeDivider,
    AeButton,
    AeIcon,
    AeModal,
    AeAmountInput,
    AeAppIcon
  },
  data() {
    return {
      loaderVisible: true,
      pendingAepps: [],
      voteModalMessage: "",
      voteModalValue: { symbol: "AE", amount: undefined },
      voteModalVisible: false,
      voteSubmissionData: {},
      voteSubmitBtnDisabled: false
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
      this.voteSubmitBtnDisabled = true;
      let that = this;
      axios
        .post(
          "http://localhost:8000/vote",
          {
            aeppIpfsHash: this.voteSubmissionData.aeppIpfsHash,
            commitmentHash: this.voteSubmissionData.commitmentHash,
            voteAmount: parseInt(this.voteModalValue.amount)
          },
          {
            headers: { "Content-Type": "application/json" }
          }
        )
        .then(function() {
          that.resetModalData();
          that.$notify({
            group: "notify",
            text: "successfully voted for æpp"
          });
        })
        .catch(function(error) {
          that.resetModalData();
          that.$notify({
            group: "notify",
            text: "failed to submit vote for æpp: " + error
          });
        });
    },
    resetModalData: function() {
      this.voteSubmitBtnDisabled = false;
      this.voteModalVisible = false;
      this.voteModalValue.amount = undefined;
    }
  },
  created: function() {
    let that = this;
    axios
      .get("http://localhost:8000/pending-aepps")
      .then(function(pendingAepps) {
        that.pendingAepps = pendingAepps.data;
        that.loaderVisible = false;
      })
      .catch(function(error) {
        that.$notify({
          group: "notify",
          text: "failed to load pending` æpps: " + error
        });
        that.loaderVisible = false;
      });
  }
};
</script>
<style src="./pending.scss" lang="scss" />
