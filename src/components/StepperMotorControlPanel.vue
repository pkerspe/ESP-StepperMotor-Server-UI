/* eslint-disable no-console */
<template>
  <div class="stepperControlPanel card card-small mt-3">
    <div class="card-body p-3">
      <div class="d-flex flex-row">
        <div class="d-none d-sm-inline-block align-self-center p-1">
          <img src="../assets/stepper.svg" style="width:70px;height:90px;" />
        </div>
        <div class="p-1 pl-3">
          Name:
          <br />ID:
          <br />Position:
          <br />Motion completed:
          <br />Velocity:
          <br />
        </div>
        <div class="p-1">
          <strong>{{stepperConfiguration.name}}</strong>
          <br />
          {{stepperConfiguration.id}}
          <br />
          {{stepperConfiguration.position.mm}} mm / {{stepperConfiguration.position.revs}} revs /
          {{stepperConfiguration.position.steps}} steps
          <br />
          {{stepperConfiguration.stopped}}
          <br />
          {{stepperConfiguration.velocity.rev_s}} revs/sec / {{stepperConfiguration.velocity.mm_s}} mm_s /
          {{stepperConfiguration.velocity.steps_s}} steps/sec
          <br />
        </div>
      </div>
      <div class="row p-3">
        <b-button class="m-3" v-on:click="moveToHomeBegin()" disabled>
          <font-awesome-icon icon="fast-backward"></font-awesome-icon>
        </b-button>
        <b-button variant="success" class="m-3" v-on:click="moveBack">
          <font-awesome-icon icon="backward"></font-awesome-icon>
        </b-button>
        <b-button class="m-3" v-on:click="stop">
          <font-awesome-icon icon="stop"></font-awesome-icon>
        </b-button>
        <b-button variant="success" class="m-3" v-on:click="moveForward">
          <font-awesome-icon icon="forward"></font-awesome-icon>
        </b-button>
        <b-button class="m-3" v-on:click="moveToHomeEnd()" disabled>
          <font-awesome-icon icon="fast-forward"></font-awesome-icon>
        </b-button>
      </div>
      <div class="form-group">
        <input class="form-control" v-model="stepperSpeed" type="number" id="speed" />
        <label for="speed">Speed in steps per second</label>
      </div>
      <div class="form-group">
        <input class="form-control" v-model="acceleration" type="number" id="acceleration" />
        <label for="acceleration">Accelleration in steps/second</label>
      </div>
      <div class="form-group">
        <input class="form-control" v-model="distance" type="number" id="distance" />
        <label for="distance">Distance in steps</label>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import { ApiService } from "../services/ApiService";
import { BButton } from "bootstrap-vue";

const apiService = new ApiService();

export default {
  name: "StepperMotorControlPanel",
  data: function() {
    return {
      stepperSpeed: 800,
      distance: 500,
      acceleration: 500
    };
  },
  props: {
    stepperConfiguration: Object
  },
  components: {
    BButton
  },
  methods: {
    stop() {
      apiService.stopStepper(this.stepperConfiguration.id).then(data => {
        //do something
        console.log(data);
      });
    },
    moveForward() {
      apiService
        .moveStepperBySteps(
          this.stepperConfiguration.id,
          this.distance,
          this.stepperSpeed,
          this.acceleration
        )
        .then(data => {
          //do something
          console.log(data);
        });
    },
    moveBack() {
      apiService
        .moveStepperBySteps(
          this.stepperConfiguration.id,
          0 - this.distance,
          this.stepperSpeed,
          this.acceleration
        )
        .then(data => {
          //do something
          console.log(data);
        });
    },
    moveToHomeEnd() {},
    moveToHomeBegin() {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
