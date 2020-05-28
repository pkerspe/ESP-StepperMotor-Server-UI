<template>
  <div class="switchDetails card card-small mt-3">
    <div class="card-body p-3">
      <div class="d-flex flex-row">
        <div class="d-none d-sm-inline-block align-self-center p-1">
          <img src="../assets/switch.svg" style="width:70px;" />
        </div>
        <div class="p-1 pl-3">
          Name:
          <br />IO-Pin:
          <br />Stepper ID:
          <br />Switch type:
          <br />Switch position:
          <br />
        </div>
        <div class="p-1">
          <strong>{{switchConfiguration.name}}</strong>
          <br />
          <strong>{{switchConfiguration.ioPin}}</strong>
          <br />
          <strong>{{switchConfiguration.stepperId}}</strong>
          <br />
          <strong>{{this.getDisplayNameForSwitchType()}}</strong>
          <br />
          <strong>{{(switchConfiguration.switchPosition == -1) ? 'none': switchConfiguration.switchPosition}}</strong>
          <br />
        </div>
        <div class="p-1 pl-3">
          ID:
          <br />
          <br />Stepper Name:
          <br />Signal:
          <br />
        </div>
        <div class="p-1">
          <strong>{{switchConfiguration.id}}</strong>
          <br />
          <br />
          <strong>{{this.getStepperNameForId(switchConfiguration.stepperId)}}</strong>
          <br />
          <strong>{{(switchConfiguration.isActiveHighType) ? 'active high': 'active low'}}</strong>
          <br />
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
      type &= ~((isActiveHigh)?1:2);
      var switchTypeMatchArray = this.switchTypes.filter(function(switchType) {
        return switchType.bitMask == type;
      });
      if(switchTypeMatchArray.length > 0){
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
