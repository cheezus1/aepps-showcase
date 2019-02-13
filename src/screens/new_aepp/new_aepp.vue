<template>
  <div class="fields">
    <notifications group="notify" position="bottom center" />
    <h1>Submit an æpp</h1>
    <ae-input label="Title" class="field" v-model="title"></ae-input>
    <ae-input
      label="Description"
      class="field"
      v-model="description"
    ></ae-input>
    <ae-input
      label="Contract address"
      placeholder="ct_"
      class="field"
      v-model="address"
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
      >submit</ae-button
    >
  </div>
</template>

<script>
import { AeInput, AeLabel, AeButton } from "@aeternity/aepp-components";
import PictureInput from "vue-picture-input";
import axios from "axios";

export default {
  data() {
    return {
      title: "",
      description: "",
      address: "",
      page: "",
      image: null
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
      let aepp = {
        title: this.title,
        description: this.description,
        address: this.address,
        page: this.page,
        image: this.image
      };
      let that = this;
      axios.post('http://localhost:8000/upload', JSON.stringify(aepp)).then(function () {
        that.$notify({
          group: 'notify',
          text: 'æpp successfully uploaded!'
        });
      })
      .catch(function (error) {
        that.$notify({
          group: 'notify',
          text: 'failed to upload æpp: ' + error
        });
      });

    }
  },
  components: {
    AeInput,
    AeLabel,
    AeButton,
    PictureInput
  }
};
</script>
<style src="./new_aepp.scss" lang="scss" />
