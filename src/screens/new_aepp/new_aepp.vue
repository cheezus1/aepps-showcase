<template>
  <div class="fields">
    <notifications group="notify" position="bottom center" />
    <h1>Submit an æpp</h1>
    <ae-input
      label="Title"
      class="field"
      v-model="title"
      @input="validateInputLength('title', 2, 30, $event)"
      :error="!titleValid"
    >
      <ae-toolbar slot="footer">
        Character limit: {{ titleCounter }}
      </ae-toolbar>
    </ae-input>
    <ae-input
      label="Short description"
      class="field"
      v-model="shortDescription"
      @input="validateInputLength('shortDescription', 5, 50, $event)"
      :error="!shortDescriptionValid"
    >
      <ae-toolbar slot="footer">
        Character limit: {{ shortDescriptionCounter }}
      </ae-toolbar>
    </ae-input>
    <ae-input
      label="Contract address"
      placeholder="ct_"
      class="field"
      v-model="contractAddress"
      aeddress
      @input="validateContractAddress($event)"
      :error="!contractAddressValid"
    >
    </ae-input>
    <ae-input
      label="Webpage URL"
      class="field"
      v-model="page"
      placeholder="e.g. http://aepp.com/"
      @input="validateURL($event)"
      :error="!urlValid"
    >
      <ae-toolbar slot="footer">
        æepp URL (dedicated webpage / Github)
      </ae-toolbar>
    </ae-input>
    <ae-textarea
      :monospace="false"
      v-model="fullDescription"
      placeholder="Full description (optional)"
    >
    </ae-textarea>
    <span
      id="missing-image-label"
      class="image-label"
      v-if="image === undefined"
      >æpp logo (200 x 200 px) *</span
    >
    <span id="selected-image-label" class="image-label" v-else
      >æpp logo (200 x 200 px)</span
    >
    <picture-input
      ref="pictureInput"
      width="200"
      height="200"
      margin="16"
      accept="image/jpeg,image/png"
      size="10"
      button-class="btn"
      :custom-strings="{
        upload: '',
        drag: 'Drag or click here to upload image'
      }"
      @change="onChange"
    >
    </picture-input>
    <ae-button
      fill="secondary"
      face="round"
      class="submit-button"
      v-on:click="submit"
      :disabled="submitButtonDisabled"
      >submit</ae-button
    >
  </div>
</template>

<script>
import {
  AeInput,
  AeTextarea,
  AeButton,
  AeToolbar
} from "@aeternity/aepp-components";
import PictureInput from "vue-picture-input";
import axios from "axios";

export default {
  data() {
    return {
      title: "",
      titleCounter: 30,
      titleValid: false,
      shortDescription: "",
      shortDescriptionCounter: 50,
      shortDescriptionValid: false,
      fullDescription: "",
      contractAddress: "",
      contractAddressValid: false,
      page: "",
      urlValid: false,
      image: undefined,
      submitButtonDisabled: false
    };
  },
  methods: {
    validateInputLength(input, minSize, maxSize, data) {
      this[input] = data.substr(0, maxSize);

      const counterDataKey = input + "Counter";
      if (this[input].length > maxSize) {
        this[counterDataKey] = 0;
      } else {
        this[counterDataKey] = maxSize - this[input].length;
      }

      const validDataKey = input + "Valid";
      if (this[input].length < minSize || this[input].length > maxSize) {
        this[validDataKey] = false;
      } else {
        this[validDataKey] = true;
      }
    },
    validateContractAddress(data) {
      const regex = /^ct_[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}$/g;
      this.contractAddressValid = regex.test(data);
    },
    validateURL(data) {
      const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
      this.urlValid = regex.test(data);
    },
    onChange(image) {
      if (image) {
        this.image = image;
      } else {
        console.log("FileReader API not supported");
      }
    },
    submit() {
      if (
        this.titleValid &&
        this.shortDescriptionValid &&
        this.contractAddressValid &&
        this.urlValid &&
        this.image !== undefined
      ) {
        this.submitButtonDisabled = true;
        let aepp = {
          title: this.title,
          shortDescription: this.shortDescription,
          fullDescription: this.fullDescription,
          contractAddress: this.contractAddress,
          page: this.page,
          image: this.image
        };
        let that = this;
        axios
          .post("http://localhost:8000/upload-aepp-to-ipfs", aepp, {
            headers: { "Content-Type": "application/json" }
          })
          .then(function(hash) {
            axios
              .post("http://localhost:8000/submit-ipfs-hash-to-contract", hash)
              .then(function() {
                that.$notify({
                  group: "notify",
                  text: "æpp successfully uploaded!"
                });
                window.location = "/#/pending";
              })
              .catch(function(error) {
                that.$notify({
                  group: "notify",
                  text: "failed to upload æpp: " + error
                });
              });
          })
          .catch(function(error) {
            that.$notify({
              group: "notify",
              text: "failed to upload æpp: " + error
            });
          });
      } else {
        this.$notify({
          group: "notify",
          text: "Please fill the required fields"
        });
      }
    }
  },
  components: {
    AeInput,
    AeTextarea,
    AeButton,
    AeToolbar,
    PictureInput
  }
};
</script>
<style src="./new_aepp.scss" lang="scss" />
