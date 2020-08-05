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
const API_URL = process.env.VUE_APP_REST_API_BASE_URL;

export default {
  name: "setup",
  data: function () {
    return {
      configuredSteppers: [],
      positions: {},
    };
  },
  components: {
    StepperMotorControlPanel,
  },
  methods: {
    getConfiguredSteppers() {
      apiService.getConfiguredStepperMotors().then((data) => {
        this.configuredSteppers = data.filter(function (stepper) {
          return stepper.configured == "true";
        });
      });
    },
    handleSocketMessage(event) {
      if (event.data.startsWith("{")) {
        this.positions = JSON.parse(event.data);
        for (var i = 0; i < this.configuredSteppers.length; i++) {
          this.configuredSteppers[i].position.steps = this.positions[
            "s" + i + "pos"
          ];
          this.configuredSteppers[i].position.revs = parseFloat(
            this.configuredSteppers[i].position.steps /
              this.configuredSteppers[i].stepsPerRev
          ).toFixed(2);
          this.configuredSteppers[i].position.mm = parseFloat(
            this.configuredSteppers[i].position.steps /
              this.configuredSteppers[i].stepsPerMM
          ).toFixed(2);

          this.configuredSteppers[i].velocity.steps_s = parseFloat(this.positions[
            "s" + i + "vel"
          ]).toFixed(2);
          this.configuredSteppers[i].velocity.rev_s = parseFloat(
            this.configuredSteppers[i].velocity.steps_s /
              this.configuredSteppers[i].stepsPerRev
          ).toFixed(2);
          this.configuredSteppers[i].velocity.mm_s = parseFloat(
            this.configuredSteppers[i].velocity.steps_s /
              this.configuredSteppers[i].stepsPerMM
          ).toFixed(2);
        }
      }
    },
  },
  mounted() {
    this.getConfiguredSteppers();
    var wsUrl = wsUrl = "ws://" + window.location.host + "/ws";
    if(API_URL != ""){
      wsUrl = API_URL.replace("http://", "ws://") + "/ws";
    }
    const socket = new WebSocket(wsUrl);

    // Connection opened
    socket.addEventListener("open", function (event) {
      console.log(event);
    });

    // Listen for messages
    socket.addEventListener("message", this.handleSocketMessage);
  },
};
</script>
