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
          <div
            v-if="
              pendingAepp.endTime.currentPeriod == 0 &&
                !hasVotedForPendingAepp(ipfsHash)
            "
          >
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
        </div>
        <ae-app-icon :src="pendingAepp.image" />
        <div class="pending-aepp-description">
          <span class="pending-aepp-title">{{ pendingAepp.title }}</span>
          <span class="pending-aepp-short-description">{{
            pendingAepp.shortDescription
          }}</span>
        </div>
        <div class="finalize-btns">
          <div
            v-if="
              hasVotedForPendingAepp(ipfsHash) &&
                pendingAepp.endTime.currentPeriod == 0
            "
          >
            <Countdown
              v-if="currentTimestamp < pendingAepp.endTime.timestamp"
              :end="formatTimestamp(pendingAepp.endTime.timestamp)"
            ></Countdown>
            <span v-else class="timer-status-text">A few moments</span>
            <span class="timer-status-text">until vote confirmation</span>
          </div>
          <div v-else-if="pendingAepp.endTime.currentPeriod == 1">
            <ae-button
              v-if="!hasConfirmedVote(ipfsHash)"
              fill="primary"
              face="round"
              class="confirm-vote-btn"
              @click="confirmVote(ipfsHash)"
              >Confirm vote</ae-button
            >
            <div v-else>
              <Countdown
                v-if="currentTimestamp < pendingAepp.endTime.timestamp"
                :end="formatTimestamp(pendingAepp.endTime.timestamp)"
              ></Countdown>
              <span v-else class="timer-status-text">A few moments</span>
              <span class="timer-status-text">until vote finalization</span>
            </div>
          </div>
          <ae-button
            v-else-if="pendingAepp.endTime.currentPeriod == 2"
            @click="finalizeVoting()"
            fill="primary"
            face="round"
            >Finalize voting</ae-button
          >
        </div>
      </div>
      <div class="vote-data">
        <span v-if="hasVotedForPendingAepp(ipfsHash)" style="font-weight: bold"
          >You voted with: {{ getVoteAmountForPendingAepp(ipfsHash) }}
          <span style="text-transform: lowercase">ættos</span></span
        >
        <span v-if="hasVotedForPendingAepp(ipfsHash)"> | </span>
        Total votes: {{ pendingAepp.voteRewardPool }}
        <span style="text-transform: lowercase">ættos</span>
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
import Countdown from "vuejs-countdown";
import axios from "axios";
import * as Crypto from "@aeternity/aepp-sdk/es/utils/crypto";
import { Keccak } from "sha3";

export default {
  components: {
    AeLoader,
    AeDivider,
    AeButton,
    AeIcon,
    AeModal,
    AeAmountInput,
    AeAppIcon,
    Countdown
  },
  data() {
    return {
      loaderVisible: true,
      pendingAepps: [],
      voteModalMessage: "",
      voteModalValue: { symbol: "AE", amount: undefined },
      voteModalVisible: false,
      voteSubmissionData: {},
      voteSubmitBtnDisabled: false,
      voteOption: "",
      voteIpfsHash: "",
      currentTimestamp: +new Date()
    };
  },
  methods: {
    vote: function(aeppIpfsHash, vote) {
      this.voteModalMessage =
        vote + " æpp " + this.pendingAepps[aeppIpfsHash].title + " ?";
      this.voteModalVisible = true;
      this.voteOption = vote.toLowerCase();
      this.voteIpfsHash = aeppIpfsHash;
    },
    submitVote: function() {
      let salt = Crypto.salt();
      let hash = new Keccak(256);
      hash.update(this.voteOption + salt);
      let commitmentHash = hash.digest("hex");
      this.voteSubmissionData = {
        aeppIpfsHash: this.voteIpfsHash,
        commitmentHash: commitmentHash,
        vote: this.voteOption,
        salt: salt
      };
      localStorage.setItem(
        this.voteIpfsHash,
        JSON.stringify(this.voteSubmissionData)
      );
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
    },
    hasVotedForPendingAepp: function(ipfsHash) {
      const address = this.$parent._data.identity.address;
      let i = 0;
      for (i = 0; i < this.pendingAepps[ipfsHash].voters.length; i++) {
        if (this.pendingAepps[ipfsHash].voters[i].voter_address == address)
          return true;
      }

      return false;
    },
    getVoteAmountForPendingAepp: function(ipfsHash) {
      const address = this.$parent._data.identity.address;
      let i = 0;
      for (i = 0; i < this.pendingAepps[ipfsHash].voters.length; i++) {
        if (this.pendingAepps[ipfsHash].voters[i].voter_address == address)
          return this.pendingAepps[ipfsHash].voters[i].amount;
      }

      return 0;
    },
    hasConfirmedVote: function(ipfsHash) {
      const address = this.$parent._data.identity.address;
      const hasApproved = this.pendingAepps[ipfsHash].submittedVotes[
        "approve"
      ].voter_addresses.includes(address);
      const hasRejected = this.pendingAepps[ipfsHash].submittedVotes[
        "reject"
      ].voter_addresses.includes(address);

      return hasApproved || hasRejected;
    },
    confirmVote: function(ipfsHash) {
      const commitmentData = JSON.parse(localStorage.getItem(ipfsHash));
      let that = this;
      axios
        .post(
          "http://localhost:8000/submit-commitment",
          {
            aeppIpfsHash: ipfsHash,
            vote: commitmentData.vote,
            salt: commitmentData.salt
          },
          {
            headers: { "Content-Type": "application/json" }
          }
        )
        .then(function() {
          that.resetModalData();
          that.$notify({
            group: "notify",
            text: "successfully confirmed vote"
          });
        })
        .catch(function(error) {
          that.resetModalData();
          that.$notify({
            group: "notify",
            text: "failed to confirm vote: " + error
          });
        });
    },
    formatTimestamp(timestamp) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      let date = new Date(timestamp);

      console.log(
        monthNames[date.getMonth()] +
          " " +
          date.getDate() +
          ", " +
          date.getFullYear() +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds()
      );

      return (
        monthNames[date.getMonth()] +
        " " +
        date.getDate() +
        ", " +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds()
      );
    },
    finalizeVoting(ipfsHash) {
      let that = this;
      axios
        .post(
          "http://localhost:8000/finalize-voting",
          {
            aeppIpfsHash: ipfsHash
          },
          {
            headers: { "Content-Type": "application/json" }
          }
        )
        .then(function() {
          that.$notify({
            group: "notify",
            text: "successfully finalized voting"
          });
        })
        .catch(function(error) {
          that.$notify({
            group: "notify",
            text: "failed to finalize voting: " + error
          });
        });
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
