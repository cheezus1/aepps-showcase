<template>
  <div class="fields">
    <notifications group="notify" position="bottom center" />
    <h1>Submit an æpp</h1>
    <ae-input label="Title" class="field" v-model="title"></ae-input>
    <ae-input
      label="Short description"
      class="field"
      v-model="shortDescription"
    ></ae-input>
    <ae-textarea
      label="Full description"
      :monospace="false"
      v-model="fullDescription"
      placeholder="Full description"
    ></ae-textarea>
    <ae-input
      label="Contract contractAddress"
      placeholder="ct_"
      class="field"
      v-model="contractAddress"
      aeddress
    ></ae-input>
    <ae-input label="Web page URL" class="field" v-model="page"></ae-input>
    <ae-label>æpp logo (200 x 200 px)</ae-label>
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
  AeLabel,
  AeButton
} from "@aeternity/aepp-components";
import PictureInput from "vue-picture-input";
import axios from "axios";

export default {
  data() {
    return {
      title: "",
      shortDescription: "",
      fullDescription: "",
      contractAddress: "",
      page: "",
      image: null,
      submitButtonDisabled: false
    };
  },
  methods: {
    onChange(image) {
      if (image) {
        this.image = image;
      } else {
        console.log("FileReader API not supported");
      }
    },
    submit() {
      // this.submitButtonDisabled = true;
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
              // window.location = "/#/pending";
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
    }
  },
  components: {
    AeInput,
    AeTextarea,
    AeLabel,
    AeButton,
    PictureInput
  }
};
</script>
<style src="./new_aepp.scss" lang="scss" />
