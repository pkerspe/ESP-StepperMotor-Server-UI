<template>
  <div class="control">
    <stepper-motor-control-panel
      v-for="stepperConfiguration in configuredSteppers"
      v-bind:key="'stepper-'+stepperConfiguration.id"
      v-bind:stepperConfiguration="stepperConfiguration"
    ></stepper-motor-control-panel>
  </div>
</template>

<script>
import { ApiService } from "../services/ApiService";
import StepperMotorControlPanel from "../components/StepperMotorControlPanel";

const apiService = new ApiService();

export default {
  name: "setup",
  data: function() {
    return {
      configuredSteppers: []
    };
  },
  components: {
    StepperMotorControlPanel
  },
  methods: {
    getConfiguredSteppers() {
      apiService.getConfiguredStepperMotors().then(data => {
        this.configuredSteppers = data.filter(function(stepper) {
          return stepper.configured == "true";
        });
      });
    }
  },
  mounted() {
    this.getConfiguredSteppers();
  }
};
</script>
