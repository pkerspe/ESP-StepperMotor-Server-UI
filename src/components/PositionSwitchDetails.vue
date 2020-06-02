<template>
  <div class="switchDetails card card-small mt-3">
    <div class="card-body p-3">
      <div class="d-flex flex-row">
        <div class="d-none d-sm-inline-block align-self-center p-1">
          <img
            v-if="(this.switchConfiguration.type > 32)"
            src="../assets/emergencyStopSwitch.svg"
            style="width:70px;"
          />
          <img
            v-if="(this.switchConfiguration.type < 32)"
            src="../assets/switch.svg"
            style="width:70px;"
          />
        </div>
        <div class="p-1 pl-3">
          Name:
          <br />IO-Pin:
          <span v-if="(this.switchConfiguration.type < 32)">
            <br />Stepper ID:
          </span>
          <br />Switch type:
          <br />
        </div>
        <div class="p-1">
          <strong>{{switchConfiguration.name}}</strong>
          <br />
          <strong>{{switchConfiguration.ioPin}}</strong>
          <br />
          <span v-if="(this.switchConfiguration.type < 32)">
            <strong>{{switchConfiguration.stepperId}}</strong>
            <br />
          </span>
          <strong>{{this.getDisplayNameForSwitchType()}}</strong>
          <br />
        </div>
        <div class="p-1 pl-3">
          ID:
          <br />Signal:
          <span v-if="(this.switchConfiguration.type < 32)">
            <br />Stepper Name:
            <br />Switch position:
          </span>
        </div>
        <div class="p-1">
          <strong>{{switchConfiguration.id}}</strong>
          <br />
          <strong>{{(switchConfiguration.isActiveHighType) ? 'active high': 'active low'}}</strong>
          <br />
          <span v-if="(this.switchConfiguration.type < 32)">
            <strong>{{this.getStepperNameForId(switchConfiguration.stepperId)}}</strong>
            <br />
            <strong>{{(switchConfiguration.switchPosition == -1) ? 'none': switchConfiguration.switchPosition}}</strong>
            <br />
          </span>
        </div>
        <div class="hover-btn">
          <b-button variant="danger" v-on:click="$emit('delete',switchConfiguration.id)">
            <font-awesome-icon icon="trash" />
          </b-button>
          <br />
          <b-button
            class="mt-3"
            variant="success"
            v-on:click="$emit('edit',switchConfiguration.id)"
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
  name: "PositionSwitchDetails",
  props: {
    switchConfiguration: Object,
    configuredSteppers: Array,
    switchTypes: Array
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
    },
    getDisplayNameForSwitchType() {
      var type = this.switchConfiguration.type;
      var isActiveHigh = this.switchConfiguration.isActiveHighType;
      type &= ~(isActiveHigh ? 1 : 2);
      var switchTypeMatchArray = this.switchTypes.filter(function(switchType) {
        return switchType.bitMask == type;
      });
      if (switchTypeMatchArray.length > 0) {
        return switchTypeMatchArray[0].displayName;
      }
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

.switchDetails:hover .hover-btn {
  display: block;
}
</style>
