<template>
  <div class="rotaryEncoderDetails card card-small mt-3">
    <div class="card-body p-3">
      <div class="d-flex flex-row">
        <div class="d-none d-sm-inline-block align-self-center p-1">
          <img src="../assets/rotaryEncoderWheel.svg" style="width:70px;" />
        </div>
        <div class="p-1 pl-3">
          Name:
          <br />IO-Pin A:
          <br />Stepper ID:
          <br />Step multiplier:
          <br />
        </div>
        <div class="p-1">
          <strong>{{encoderConfiguration.name}}</strong>
          <br />
          <strong>{{encoderConfiguration.ioPinA}}</strong>
          <br />
          <strong>{{encoderConfiguration.stepperId}}</strong>
          <br />
          <strong>{{encoderConfiguration.stepMultiplier}}</strong>
        </div>
        <div class="p-1 pl-3">
          ID:
          <br />IO-Pin B:
          <br />Stepper name:
          <br />
        </div>
        <div class="p-1">
          <strong>{{encoderConfiguration.id}}</strong>
          <br />
          <strong>{{encoderConfiguration.ioPinB}}</strong>
          <br />
          <strong>{{this.getStepperNameForId(encoderConfiguration.stepperId)}}</strong>
        </div>
        <div class="hover-btn">
          <b-button variant="danger" v-on:click="$emit('delete',encoderConfiguration.id)">
            <font-awesome-icon icon="trash" />
          </b-button>
          <br />
          <b-button
            class="mt-3"
            variant="success"
            v-on:click="$emit('edit',encoderConfiguration.id)"
          >
            <font-awesome-icon icon="pen" />
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BButton } from "bootstrap-vue";

export default {
  name: "RotaryEncoderDetails",
  props: {
    encoderConfiguration: Object,
    configuredSteppers: Array
  },
  components: {
    BButton
  },
  methods: {
    getStepperNameForId(stepperId) {
      var matchingSteppers = this.configuredSteppers.filter(function(stepper) {
        return stepper.id == stepperId;
      });
      if (matchingSteppers.length > 0) {
        return matchingSteppers[0].name;
      }
      return "unknown";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hover-btn {
  position: absolute;
  right: 15px;
  display: none;
}

.rotaryEncoderDetails:hover .hover-btn {
  display: block;
}
</style>
