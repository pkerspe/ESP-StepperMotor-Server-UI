<template>
  <div class="setup pb-5">
    <span class="saveConfigBanner">
      <b-button variant="warning" class="mr-4" v-on:click="saveConfig(true)">
        <font-awesome-icon icon="file-download" />&nbsp;save and download current configuration
      </b-button>

      <b-button variant="warning" v-on:click="saveConfig(false)">
        <font-awesome-icon icon="save" />&nbsp;save current configuration to device
      </b-button>
    </span>

    <!------------------------>
    <!------ STEPPERS -------->
    <!------------------------>
    <stepper-motor-details
      v-for="stepperConfiguration in configuredSteppers"
      v-bind:key="'stepper-'+stepperConfiguration.id"
      v-bind:stepperConfiguration="stepperConfiguration"
      v-on:delete="deleteStepperConfiguration"
      v-on:edit="editStepperConfiguration"
    ></stepper-motor-details>

    <div class="row pt-3">
      <div class="col-12">
        <b-button variant="success" v-b-modal.add-stepper>
          <font-awesome-icon icon="plus-circle" />&nbsp;add stepper motor
        </b-button>

        <!-- Modal to add new stepper -->
        <b-modal
          id="add-stepper"
          title="Add a new stepper motor configuration"
          @ok="addStepperConfiguration"
          @cancel="closeAndResetStepperModalForm"
          ref="addStepperModal"
        >
          <form>
            <span
              v-if="this.stepperToAdd.mode == 'edit'"
            >Editing existing stepper configuration with id {{this.stepperToAdd.id}}</span>
            <div class="form-group">
              <label for="displayName">Display name for the stepper motor</label>
              <input
                type="text"
                class="form-control"
                id="displayName"
                v-model="stepperToAdd.name"
                placeholder="display name or axis name (max 20 characters)"
                maxlength="20"
              />
            </div>
            <!-------- HARDWARE IO PINS ----------->
            <div class="form-group">
              <label for="stepPin">ESP IO pin for step signal</label>
              <select
                id="stepPin"
                name="stepPin"
                class="form-control"
                v-model="stepperToAdd.stepPin"
              >
                <option value="-1" selected>please select an IO pin</option>
                <option
                  v-for="ioPin in allowedIoOutputPins"
                  :value="ioPin.pin"
                  :disabled="ioPin.disabled"
                  v-bind:key="'stepPin'+(ioPin.pin)"
                >
                  {{ioPin.label}}
                  {{ioPin.connectedDeviceNames}}
                </option>
              </select>
              <small id="stepPinHelp" class="form-text text-muted">
                select the IO pin of the ESP that is
                connected to the step-pin on the stepper driver board
              </small>
            </div>
            <div class="form-group">
              <label for="dirPin">ESP IO pin for direction signal</label>
              <select id="dirPin" name="dirPin" class="form-control" v-model="stepperToAdd.dirPin">
                <option value="-1" selected>please select an IO pin</option>
                <option value="-2" selected>not connected / direction pin is not used</option>
                <option
                  v-for="ioPin in allowedIoOutputPins"
                  :value="ioPin.pin"
                  :disabled="ioPin.disabled"
                  v-bind:key="'dirPin'+(ioPin.pin)"
                >{{ioPin.label}} {{ioPin.connectedDeviceNames}}</option>
              </select>
              <small id="dirPinHelp" class="form-text text-muted">
                select the IO pin of the ESP that is
                connected to the direction-pin on the stepper driver board
              </small>
            </div>
            <div class="form-group">
              <label for="brakePin">ESP IO pin for motor brake (optional)</label>
              <select
                id="brakePin"
                name="brakePin"
                class="form-control"
                v-model="stepperToAdd.brakePin"
              >
                <option value="255" selected>no motor brake used</option>
                <option
                  v-for="ioPin in allowedIoOutputPins"
                  :value="ioPin.pin"
                  :disabled="ioPin.disabled"
                  v-bind:key="'brakePin'+(ioPin.pin)"
                >
                  {{ioPin.label}}
                  {{ioPin.connectedDeviceNames}}
                </option>
              </select>
              <small id="brakePinHelp" class="form-text text-muted">
                select the IO pin of the ESP that is
                connected to a motor brake. Select "no motor brake used" if your stepper does not have a physical brake
              </small>
            </div>
            <div class="form-group" v-if="this.stepperToAdd.brakePin != 255">
              brake settings: <br/>
              Pin active state:
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="brakeActiveState"
                  id="brakeActiveHigh"
                  v-model="stepperToAdd.brakePinActiveState"
                  v-bind:value="1"
                />
                <label class="form-check-label" for="brakeActiveHigh">Active-High</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="brakeActiveState"
                  id="brakeActiveLow"
                  v-model="stepperToAdd.brakePinActiveState"
                  v-bind:value="2"
                />
                <label class="form-check-label" for="brakeActiveLow">Active-Low</label>
              </div>
              <small
                id="brakeActiveStateHelp"
                class="form-text text-muted"
              >set the active state of the IO pin for the motor brake: active high means, the pin goes high to active the brake, active low mean, that the pin goes low to activate the brake.</small>
            </div>
            <div class="form-group" v-if="this.stepperToAdd.brakePin != 255">
              <label for="brakeEngageDelayMs">Delay to engage motor brake</label>
              <input
                type="number"
                class="form-control"
                id="brakeEngageDelayMs"
                v-model="stepperToAdd.brakeEngageDelayMs"
                min="0"
                max="1000000"
              />
              <small
                id="brakeEngageDelayMsHelp"
                class="form-text text-muted"
              >enter the delay in milliseconds between the time when the motor reached its destination and the time the brake should be engaged. Default is 0ms to directly engage the brake when the motor reached the position.</small>
            </div>
            <div class="form-group" v-if="this.stepperToAdd.brakePin != 255">
              <label for="brakeReleaseDelayMs">brake release timeout</label>
              <input
                type="number"
                class="form-control"
                id="brakeReleaseDelayMs"
                v-model="stepperToAdd.brakeReleaseDelayMs"
                min="1"
                max="1000000"
              />
              <small
                id="brakeReleaseDelayMsHelp"
                class="form-text text-muted"
              >enter the delay in milliseconds between the time when the motor brake has been engaged and the time the brake should be released again. Default is -1 to indicate, that the brake will not be released after a timeout, but only when the motor is supposed to move again.</small>
              <hr>
            </div>
            <!------ MOTION SETTINGS: STEPS/MM and STEPS/REV ----------->
            <div class="form-group">
              <label for="stepsPerRev">Steps per revolution</label>
              <input
                type="number"
                class="form-control"
                id="stepsPerRev"
                v-model="stepperToAdd.stepsPerRev"
                min="1"
                max="1000000"
              />
              <small
                id="stepsPerRevHelp"
                class="form-text text-muted"
              >set the number of steps of the stepper motor (full steps, not microsteps!) needed to perform one revolution of the motor axis. For regular 1.8degree stepper motors this value should be 200 (360 degree / 1.8 degree = 200)</small>
            </div>
            <div class="form-group">
              <label for="stepsPerRev">Steps per mm</label>
              <input
                type="number"
                class="form-control"
                id="stepsPerMM"
                v-model="stepperToAdd.stepsPerMM"
                min="1"
                max="1000000"
              />
              <small
                id="stepsPerMMHelp"
                class="form-text text-muted"
              >set the number of steps of the stepper motor (full steps, not microsteps!) needed to perform a linear movement of mm on the axis this stepper moto is connected to. If you are not using lienar motion, just leave this value to the default value. Just be prepared that calls to the move functions that use mm as unit, will not work properly. The other move functions (for steps and rev) will not be affected by this value.</small>
            </div>
            <div class="form-group">
              <label for="stepsPerRev">Microsteps per step</label>
              <select
                id="stepsPerRev"
                name="stepsPerRev"
                class="form-control"
                v-model="stepperToAdd.microsteppingDivisor"
              >
                <option value="1" selected>Microstepping OFF</option>
                <option value="2" selected>2</option>
                <option value="4" selected>4</option>
                <option value="8" selected>8</option>
                <option value="16" selected>16</option>
                <option value="32" selected>32</option>
                <option value="64" selected>64</option>
                <option value="128" selected>128</option>
                <option value="256" selected>256</option>
              </select>
              <small
                id="microsteppingDivisorMHelp"
                class="form-text text-muted"
              >The number of microsteps per step that are configured in you stepper driver. Set to 1 if microstepping is not enabled</small>
            </div>
          </form>
        </b-modal>
      </div>
    </div>

    <!------------------------>
    <!------ SWITCHES -------->
    <!------------------------>
    <position-switch-details
      v-for="switchConfiguration in configuredSwitches"
      v-bind:key="'switch-'+switchConfiguration.id"
      v-bind:switchConfiguration="switchConfiguration"
      v-bind:configuredSteppers="configuredSteppers"
      v-bind:switchTypes="switchTypes"
      v-on:delete="deleteSwitchConfiguration"
      v-on:edit="editSwitchConfiguration"
    ></position-switch-details>

    <div class="row pt-3">
      <div class="col-12">
        <b-button variant="success" v-b-modal.add-switch>
          <font-awesome-icon icon="plus-circle" />&nbsp;add limit switch
        </b-button>

        <!-- Modal to add new switch -->
        <b-modal
          id="add-switch"
          title="Add a new limit switch configuration"
          @ok="addSwitch"
          @cancel="closeAndResetSwitchModalForm"
          ref="addSwitchModal"
        >
          <form>
            <div class="form-group">
              <label for="positionName">Display name for the switch</label>
              <input
                type="text"
                class="form-control"
                id="positionName"
                v-model="switchToAdd.positionName"
                placeholder="display name for this switch (max 20 characters)"
                maxlength="20"
              />
            </div>
            <div class="form-group">
              <label for="switchIoPin">ESP IO pin the switch is connected to</label>
              <select id="switchIoPin" class="form-control" v-model="switchToAdd.ioPinNumber">
                <option value="-1" selected>please select an IO pin</option>
                <option
                  v-for="ioPin in allowedIoOutputPins"
                  :value="ioPin.pin"
                  :disabled="ioPin.disabled"
                  v-bind:key="'switchPin'+ioPin.pin"
                >
                  {{ioPin.label}}
                  {{ioPin.connectedDeviceNames}}
                </option>
              </select>
              <small id="switchIoPinHelp" class="form-text text-muted">
                select the IO pin of the ESP that
                is connected to this switch
              </small>
            </div>
            <div class="form-group">
              <label for="switchType">Switch type</label>
              <select id="switchType" class="form-control" v-model="switchToAdd.switchType">
                <option value="-1" selected>please select the type of this switch</option>
                <option
                  v-for="switchType in switchTypes"
                  :key="switchType.bitMask"
                  :value="switchType.bitMask"
                >{{switchType.displayName}}</option>
              </select>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="activeHigh"
                v-model="switchToAdd.switchTypeActiveState"
                v-bind:value="1"
              />
              <label class="form-check-label" for="activeHigh">Active-High</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="activeLow"
                v-model="switchToAdd.switchTypeActiveState"
                v-bind:value="2"
              />
              <label class="form-check-label" for="activeLow">Active-Low</label>
            </div>
            <div>
              <small id="switchTypeHelp" class="form-text text-muted">
                Define the type of the limit switch
                and its active state
              </small>
            </div>
            <div v-if="switchToAdd.switchType != this.switchTypes[4].bitMask" class="form-group">
              <label for="stepperId">Stepper motor the switch belongs to</label>
              <select id="stepperId" class="form-control" v-model="switchToAdd.stepperId">
                <option value="-1" selected>please select a stepper motor</option>
                <option
                  v-for="stepperConfig in configuredSteppers"
                  :value="stepperConfig.id"
                  v-bind:key="'stepper'+stepperConfig.id"
                >{{stepperConfig.name}} ({{stepperConfig.id}})</option>
              </select>
              <small id="stepperIdHelp" class="form-text text-muted">
                select the stepper motor to which
                this switch should be associated with
              </small>
            </div>
            <div v-if="switchToAdd.switchType != this.switchTypes[4].bitMask" class="form-group">
              <label for="switchPosition">
                Position (in steps) of the switch or -1 for no specific
                position
              </label>
              <input
                type="number"
                class="form-control"
                id="switchPosition"
                v-model="switchToAdd.switchPosition"
                placeholder="position in steps or -1"
              />
            </div>
          </form>
        </b-modal>
      </div>
    </div>

    <!------------------------>
    <!------ ENCODERS -------->
    <!------------------------>
    <rotary-encoder-details
      v-for="encoderConfiguration in configuredEncoders"
      v-bind:key="'encoder-'+encoderConfiguration.id"
      v-bind:encoderConfiguration="encoderConfiguration"
      v-bind:configuredSteppers="configuredSteppers"
      v-on:delete="deleteRotaryEncoderConfiguration"
      v-on:edit="editRotaryEncoderConfiguration"
    ></rotary-encoder-details>

    <div class="row pt-3">
      <div class="col-12">
        <b-button variant="success" v-b-modal.add-encoder>
          <font-awesome-icon icon="plus-circle" />&nbsp;add rotary encoder
        </b-button>

        <!-- Modal to add new rotary encoder -->
        <b-modal
          id="add-encoder"
          title="Add a new rotary encoder configuration"
          @ok="addEncoderConfiguration"
          ref="addEncoderModal"
        >
          <form>
            <div class="form-group">
              <label for="displayName">Display name for the rotary encoder</label>
              <input
                type="text"
                class="form-control"
                id="encoderDisplayName"
                v-model="encoderToAdd.name"
                placeholder="display name (max 20 characters)"
                maxlength="20"
              />
            </div>
            <div class="form-group">
              <label for="stepPin">ESP IO pin that is connected to pin A of the rotary encoder</label>
              <select id="ioPinA" name="ioPinA" class="form-control" v-model="encoderToAdd.ioPinA">
                <option value="-1" selected>please select an IO pin</option>
                <option
                  v-for="ioPin in allowedIoOutputPins"
                  :value="ioPin.pin"
                  :disabled="ioPin.disabled"
                  v-bind:key="'pinA'+(ioPin.pin)"
                >
                  {{ioPin.label}}
                  {{ioPin.connectedDeviceNames}}
                </option>
              </select>
              <small id="ioPinAHelp" class="form-text text-muted">
                select the IO pin of the ESP that is
                connected to
                <strong>pin A</strong> of the rotary encoder
              </small>
            </div>
            <div class="form-group">
              <label for="ioPinB">ESP IO pin that is connected to pin B of the rotary encoder</label>
              <select id="ioPinB" name="ioPinB" class="form-control" v-model="encoderToAdd.ioPinB">
                <option value="-1" selected>please select an IO pin</option>
                <option
                  v-for="ioPin in allowedIoOutputPins"
                  :value="ioPin.pin"
                  :disabled="ioPin.disabled"
                  v-bind:key="'pinB'+(ioPin.pin)"
                >
                  {{ioPin.label}}
                  {{ioPin.connectedDeviceNames}}
                </option>
              </select>
              <small id="ioPinBHelp" class="form-text text-muted">
                select the IO pin of the ESP that is
                connected to
                <strong>pin B</strong> of the rotary encoder
              </small>
            </div>
            <div class="form-group">
              <label for="stepperId">Stepper motor the rotary encoder belongs to</label>
              <select id="stepperId" class="form-control" v-model="encoderToAdd.stepperId">
                <option value="-1" selected>please select a stepper motor</option>
                <option
                  v-for="stepperConfig in configuredSteppers"
                  :value="stepperConfig.id"
                  v-bind:key="'stepper'+stepperConfig.id"
                >{{stepperConfig.name}} ({{stepperConfig.id}})</option>
              </select>
              <small id="stepperIdHelp" class="form-text text-muted">
                select the stepper motor to which
                this rotary encoder should be associated with
              </small>
            </div>
            <div class="form-group">
              <label for="encoderMultuplier">Step Multiplier value</label>
              <input
                type="number"
                class="form-control"
                id="encoderMultuplier"
                v-model="encoderToAdd.stepMultiplier"
                min="1"
                max="18446744073709551615"
              />
              <small
                id="stepMultiplierHelp"
                class="form-text text-muted"
              >set a multiplier that defines how many steps the stepper motor should move when the rotary encoder is turned by one step</small>
            </div>
          </form>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<style>
.saveConfigBanner {
  position: fixed;
  bottom: 30px;
  right: 0;
  z-index: 1000;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  height: 50px;
  text-align: right;
  padding-top: 8px;
  padding-right: 10px;
  border-top: 1px solid #ccc;
}
</style>

<script>
/* eslint-disable no-console */
import { ApiService } from "../services/ApiService";
import StepperMotorDetails from "../components/StepperMotorDetails";
import PositionSwitchDetails from "../components/PositionSwitchDetails";
import { BButton } from "bootstrap-vue";
import RotaryEncoderDetails from "../components/RotaryEncoderDetails";

const apiService = new ApiService();

export default {
  name: "setupView",
  data: function() {
    return {
      switchTypes: [
        {
          bitMask: 4,
          displayName: "homing switch begin/left/bottom"
        },
        {
          bitMask: 8,
          displayName: "homing switch end/right/top"
        },
        {
          bitMask: 64,
          displayName: "combined homing switch begin and end (in serial)"
        },
        {
          bitMask: 16,
          displayName: "general position switch"
        },
        {
          bitMask: 32,
          displayName: "emergency stop switch"
        }
      ],
      stepperToAdd: {
        stepPin: -1,
        dirPin: -1,
        stepPerMM: 100,
        stepPerRev: 200,
        name: "",
        brakePin: 255,
        brakePinActiveState: 1,
        brakeEngageDelayMs: 0,
        brakeReleaseDelayMs: -1
      },
      switchToAdd: {
        stepperId: -1,
        ioPinNumber: -1,
        positionName: "",
        switchPosition: -1,
        switchType: -1,
        switchTypeActiveState: -1
      },
      encoderToAdd: {
        name: "",
        id: -1,
        ioPinA: -1,
        ioPinB: -1,
        stepperId: -1,
        stepMultiplier: 1
      },
      configuredSteppers: [],
      configuredSwitches: [],
      configuredEncoders: [],
      allowedIoOutputPins: [
        {
          pin: 0,
          disabled: false,
          label: "GPIO 0",
          connectedDeviceNames: ""
        },
        {
          pin: 1,
          disabled: false,
          label: "GPIO 1",
          connectedDeviceNames: ""
        },
        {
          pin: 2,
          disabled: false,
          label: "GPIO 2",
          connectedDeviceNames: ""
        },
        {
          pin: 3,
          disabled: false,
          label: "GPIO 3",
          connectedDeviceNames: ""
        },
        {
          pin: 4,
          disabled: false,
          label: "GPIO 4",
          connectedDeviceNames: ""
        },
        {
          pin: 5,
          disabled: false,
          label: "GPIO 5",
          connectedDeviceNames: ""
        },
        {
          pin: 12,
          disabled: false,
          label: "GPIO 12",
          connectedDeviceNames: ""
        },
        {
          pin: 13,
          disabled: false,
          label: "GPIO 13",
          connectedDeviceNames: ""
        },
        {
          pin: 14,
          disabled: false,
          label: "GPIO 14",
          connectedDeviceNames: ""
        },
        {
          pin: 15,
          disabled: false,
          label: "GPIO 15",
          connectedDeviceNames: ""
        },
        {
          pin: 16,
          disabled: false,
          label: "GPIO 16",
          connectedDeviceNames: ""
        },
        {
          pin: 17,
          disabled: false,
          label: "GPIO 17",
          connectedDeviceNames: ""
        },
        {
          pin: 18,
          disabled: false,
          label: "GPIO 18",
          connectedDeviceNames: ""
        },
        {
          pin: 19,
          disabled: false,
          label: "GPIO 19",
          connectedDeviceNames: ""
        },
        {
          pin: 21,
          disabled: false,
          label: "GPIO 21",
          connectedDeviceNames: ""
        },
        {
          pin: 22,
          disabled: false,
          label: "GPIO 22",
          connectedDeviceNames: ""
        },
        {
          pin: 23,
          disabled: false,
          label: "GPIO 23",
          connectedDeviceNames: ""
        },
        {
          pin: 25,
          disabled: false,
          label: "GPIO 25",
          connectedDeviceNames: ""
        },
        {
          pin: 26,
          disabled: false,
          label: "GPIO 26",
          connectedDeviceNames: ""
        },
        {
          pin: 27,
          disabled: false,
          label: "GPIO 27",
          connectedDeviceNames: ""
        },
        {
          pin: 32,
          disabled: false,
          label: "GPIO 32",
          connectedDeviceNames: ""
        },
        {
          pin: 33,
          disabled: false,
          label: "GPIO 33",
          connectedDeviceNames: ""
        },
        {
          pin: 34,
          disabled: false,
          label: "GPIO 34",
          connectedDeviceNames: ""
        },
        {
          pin: 35,
          disabled: false,
          label: "GPIO 35",
          connectedDeviceNames: ""
        },
        {
          pin: 36,
          disabled: false,
          label: "GPIO 36",
          connectedDeviceNames: ""
        },
        {
          pin: 39,
          disabled: false,
          label: "GPIO 39",
          connectedDeviceNames: ""
        }
      ]
    };
  },
  components: {
    BButton,
    StepperMotorDetails,
    PositionSwitchDetails,
    RotaryEncoderDetails
  },
  methods: {
    saveConfig(triggerDownload) {
      apiService.saveConfigurationToSpiffs().then(response => {
        console.log(response);
        if (response.status == 200 || response.status == 204) {
          this.$toastr.success("Configuration saved successful", {
            timeOut: 1500
          });
          if (triggerDownload) {
            location.href =
              process.env.VUE_APP_REST_API_BASE_URL + "/api/config";
          }
        } else {
          this.$toastr.error("Failed to save configuration", {
            timeOut: 1500
          });
        }
      });
    },
    setPinUsedByInfo(pinNumber, usedByString) {
      this.allowedIoOutputPins.forEach(pinObject => {
        if (pinObject.pin === pinNumber) {
          pinObject.connectedDeviceNames =
            pinObject.connectedDeviceNames + "(" + usedByString + ")";
          pinObject.disabled = true;
        }
      });
    },
    getConfiguredSteppers() {
      apiService.getConfiguredStepperMotors().then(data => {
        if (data) {
          this.configuredSteppers = data.filter(function(stepper) {
            return stepper.configured == "true";
          });

          this.configuredSteppers.forEach(value => {
            if (value.stepPin >= 0) {
              this.setPinUsedByInfo(value.stepPin, value.name + " step-pin");
            }
            if (value.dirPin >= 0) {
              this.setPinUsedByInfo(
                value.dirPin,
                value.name + " direction-pin"
              );
            }
            console.log(value);
          });
        }
      });
    },
    getConfiguredSwitches() {
      apiService.getConfiguredPositionSwitches().then(data => {
        if (data) {
          this.configuredSwitches = data.filter(function(configuredSwitch) {
            return configuredSwitch.name != null;
          });

          this.configuredSwitches.forEach(configuredSwitch => {
            if (configuredSwitch.pin >= 0) {
              this.setPinUsedByInfo(
                configuredSwitch.pin,
                configuredSwitch.name + " switch"
              );
            }
            console.log(configuredSwitch);
          });
        }
      });
    },
    getConfiguredRotaryEncoders() {
      apiService.getConfiguredRotaryEncoders().then(data => {
        if (data) {
          this.configuredEncoders = data;

          this.configuredEncoders.forEach(configuredSwitch => {
            if (configuredSwitch.pin >= 0) {
              this.setPinUsedByInfo(
                configuredSwitch.pin,
                configuredSwitch.name + " switch"
              );
            }
            console.log(configuredSwitch);
          });
        }
      });
      this.configuredEncoders.forEach(configuredEncoder => {
        if (configuredEncoder.ioPinA >= 0) {
          this.setPinUsedByInfo(
            configuredEncoder.ioPinA,
            configuredEncoder.name + " encoder pin A"
          );
        }
        if (configuredEncoder.ioPinB >= 0) {
          this.setPinUsedByInfo(
            configuredEncoder.ioPinB,
            configuredEncoder.name + " encoder pin B"
          );
        }
        // eslint-disable-next-line no-console
        console.log("encoder loaded: ", configuredEncoder);
      });
    },
    closeAndResetStepperModalForm() {
      this.$refs["addStepperModal"].hide();
      this.stepperToAdd.id = "";
      this.stepperToAdd.stepPin = -1;
      this.stepperToAdd.dirPin = -1;
      this.stepperToAdd.stepsPerMM = 100;
      this.stepperToAdd.stepsPerRev = 200;
      this.stepperToAdd.microsteppingDivisor = 1;
      this.stepperToAdd.name = "";
      this.stepperToAdd.mode = "add";
      this.stepperToAdd.brakePin = 255;
      this.stepperToAdd.brakePinActiveState = 1;
      this.stepperToAdd.brakeEngageDelayMs = 0;
      this.stepperToAdd.brakeReleaseDelayMs = -1;
    },
    addStepperConfiguration(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      if (this.stepperToAdd.name == "") {
        alert("Please enter a name for the new stepper motor");
      } else if (this.stepperToAdd.stepPin == -1) {
        alert("Please select the step IO pin");
      } else if (this.stepperToAdd.dirPin == -1) {
        alert("Please select the direction IO pin");
      } else {
        if (this.stepperToAdd.mode == "edit") {
          apiService
            .updateStepperMotor(
              this.stepperToAdd.id,
              this.stepperToAdd.stepPin,
              this.stepperToAdd.dirPin,
              this.stepperToAdd.stepsPerRev,
              this.stepperToAdd.stepsPerMM,
              this.stepperToAdd.microsteppingDivisor,
              this.stepperToAdd.name,
              this.stepperToAdd.brakePin,
              this.stepperToAdd.brakePinActiveState,
              this.stepperToAdd.brakeEngageDelayMs,
              this.stepperToAdd.brakeReleaseDelayMs
            )
            .then(
              () => {
                this.getConfiguredSteppers();
                this.closeAndResetStepperModalForm();
              },
              error => {
                alert(
                  "An error occurred while trying to udate the existing stepper:\n" +
                    error.response.data.error
                );
              }
            );
        } else {
          console.log(this.stepperToAdd);
          apiService
            .addStepperMotor(
              this.stepperToAdd.stepPin,
              this.stepperToAdd.dirPin,
              this.stepperToAdd.stepsPerRev,
              this.stepperToAdd.stepsPerMM,
              this.stepperToAdd.microsteppingDivisor,
              this.stepperToAdd.name,
              this.stepperToAdd.brakePin,
              this.stepperToAdd.brakePinActiveState,
              this.stepperToAdd.brakeEngageDelayMs,
              this.stepperToAdd.brakeReleaseDelayMs
            )
            .then(
              () => {
                this.getConfiguredSteppers();
                this.closeAndResetStepperModalForm();
              },
              error => {
                alert(
                  "An error occurred while trying to add the new stepper:\n" +
                    error.response.data.error
                );
              }
            );
        }
      }
    },
    closeAndResetSwitchModalForm() {
      this.$refs["addSwitchModal"].hide();
      this.switchToAdd.id = "";
      this.switchToAdd.stepperId = -1;
      this.switchToAdd.ioPinNumber = -1;
      this.switchToAdd.switchPosition = -1;
      this.switchToAdd.positionName = "";
      this.switchToAdd.switchType = -1;
      this.switchToAdd.switchTypeActiveState = "";
      this.switchToAdd.mode = "add";
    },
    addSwitch(bvModalEvt) {
      //emergency switch is currently only supported as global switch, so no need for stepper ID
      if (this.switchToAdd.switchType == this.switchTypes[4].bitMask) {
        this.switchToAdd.switchPosition = -1;
        this.switchToAdd.stepperId = -1;
      }

      // Prevent modal from closing
      bvModalEvt.preventDefault();
      if (this.switchToAdd.positionName == "") {
        alert("Please enter a name for the new switch");
      } else if (this.switchToAdd.ioPinNumber == -1) {
        alert("Please select the IO pin the switch is connected to");
      } else if (
        this.switchToAdd.switchType != this.switchTypes[4].bitMask &&
        this.switchToAdd.stepperId == -1
      ) {
        alert("Please select the stepper motor this switch is used for");
      } else if (
        this.switchToAdd.switchPosition == "" ||
        this.switchToAdd.switchPosition < -1
      ) {
        alert(
          "Please select the position of this switch or -1 for no specific position"
        );
      } else if (this.switchToAdd.switchType == -1) {
        alert("Please select the type of this switch");
      } else if (this.switchToAdd.switchTypeActiveState == "") {
        alert("Please select the active state of the switch");
      } else {
        let switchTypeBitMask = this.switchToAdd.switchType;
        switchTypeBitMask |= this.switchToAdd.switchTypeActiveState;

        if (this.switchToAdd.mode == "edit") {
          apiService
            .updatePositionSwitch(
              this.switchToAdd.id,
              this.switchToAdd.stepperId,
              this.switchToAdd.ioPinNumber,
              this.switchToAdd.positionName,
              this.switchToAdd.switchPosition,
              switchTypeBitMask
            )
            .then(
              () => {
                this.getConfiguredSwitches();
                this.closeAndResetSwitchModalForm();
              },
              error => {
                alert(
                  "An error occurred while trying to udate the switch config:\n" +
                    error.response.data.error
                );
              }
            );
        } else {
          apiService
            .addPositionSwitch(
              this.switchToAdd.stepperId,
              this.switchToAdd.ioPinNumber,
              this.switchToAdd.positionName,
              this.switchToAdd.switchPosition,
              switchTypeBitMask
            )
            .then(
              () => {
                this.getConfiguredSwitches();
                this.closeAndResetSwitchModalForm();
              },
              error => {
                alert(
                  "An error occurred while trying to add the new stepper:\n" +
                    error.response.data.error
                );
              }
            );
        }
      }
    },
    closeAndResetEncoderModalForm() {
      this.$refs["addEncoderModal"].hide();
      this.encoderToAdd.id = "";
      this.encoderToAdd.ioPinA = -1;
      this.encoderToAdd.ioPinB = -1;
      this.encoderToAdd.name = "";
      this.encoderToAdd.stepperId = -1;
      this.encoderToAdd.stepMultiplier = -1;
      this.encoderToAdd.mode = "add";
    },
    addEncoderConfiguration(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      if (this.encoderToAdd.name == "") {
        alert("Please enter a name for the new rotary encoder");
      } else if (this.encoderToAdd.ioPinA == -1) {
        alert("Please select the Pin A IO pin");
      } else if (this.encoderToAdd.ioPinB == -1) {
        alert("Please select the Pin B IO pin");
      } else if (this.encoderToAdd.stepperId == -1) {
        alert(
          "Please select the stepper configuration this encoder should be linked to"
        );
      } else if (this.encoderToAdd.stepMultiplier < 1) {
        alert(
          "Please select the step multiplier to be applied for each encoder step"
        );
      } else {
        if (this.encoderToAdd.mode == "edit") {
          apiService
            .updateRotaryEncoder(
              this.encoderToAdd.id,
              this.encoderToAdd.stepperId,
              this.encoderToAdd.ioPinA,
              this.encoderToAdd.ioPinB,
              this.encoderToAdd.name,
              this.encoderToAdd.stepMultiplier
            )
            .then(
              () => {
                this.getConfiguredRotaryEncoders();
                this.closeAndResetEncoderModalForm();
              },
              error => {
                alert(
                  "An error occurred while trying to udate the existing encoder config:\n" +
                    error.response.data.error
                );
              }
            );
        } else {
          apiService
            .addRotaryEncoder(
              this.encoderToAdd.stepperId,
              this.encoderToAdd.ioPinA,
              this.encoderToAdd.ioPinB,
              this.encoderToAdd.name,
              this.encoderToAdd.stepMultiplier
            )
            .then(
              () => {
                this.getConfiguredRotaryEncoders();
                this.$refs["addEncoderModal"].hide();
                this.encoderToAdd.stepperId = -1;
                this.encoderToAdd.ioPinA = -1;
                this.encoderToAdd.ioPinB = -1;
                this.encoderToAdd.name = "";
                this.encoderToAdd.stepMultiplier = 1;
              },
              error => {
                alert(
                  "An error occurred while trying to add the new rotary encoder:\n" +
                    error.response.data.error
                );
              }
            );
        }
      }
    },
    editStepperConfiguration(id) {
      var stepperConfigToEdit = this.configuredSteppers.filter(function(
        stepperConfig
      ) {
        return stepperConfig.id == id;
      });
      if (stepperConfigToEdit.length != 1) {
        alert(
          "a problem occured while trying to find the matching stepper configuration. Maybe reloading the page will solve the issue"
        );
        return;
      }
      stepperConfigToEdit = stepperConfigToEdit[0];
      console.log(
        "editStepperConfiguration called for id " + id,
        stepperConfigToEdit
      );
      this.$refs["addStepperModal"].show();
      this.stepperToAdd.stepPin = stepperConfigToEdit.stepPin;
      this.stepperToAdd.dirPin = stepperConfigToEdit.dirPin;
      this.stepperToAdd.stepsPerRev = stepperConfigToEdit.stepsPerRev;
      this.stepperToAdd.stepsPerMM = stepperConfigToEdit.stepsPerMM;
      this.stepperToAdd.microsteppingDivisor = stepperConfigToEdit.microsteppingDivisor;
      this.stepperToAdd.name = stepperConfigToEdit.name;
      this.stepperToAdd.id = stepperConfigToEdit.id;
      this.stepperToAdd.mode = "edit";
      this.stepperToAdd.brakePin = stepperConfigToEdit.brakePin;
      this.stepperToAdd.brakePinActiveState = stepperConfigToEdit.brakePinActiveState;
      this.stepperToAdd.brakeEngageDelayMs = stepperConfigToEdit.brakeEngageDelayMs;
      this.stepperToAdd.brakeReleaseDelayMs = stepperConfigToEdit.brakeReleaseDelayMs;
    },
    deleteStepperConfiguration(id) {
      apiService.deleteStepperMotor(id).then(
        () => {
          this.configuredSteppers = this.configuredSteppers.filter(function(
            stepper
          ) {
            return stepper.id != id;
          });
          //reload other configuration, since the switches and encoders might have been linked ot the stepper motor and as such would have been deleted as well
          //and also used pins need to be updated
          this.getConfiguredSteppers();
          this.getConfiguredSwitches();
          this.getConfiguredRotaryEncoders();
        },
        error => {
          alert(
            "An error occurred while trying to delete the stepper configuration:\n" +
              error.response.data.error
          );
        }
      );
    },
    deleteSwitchConfiguration(id) {
      apiService.deletePositionSwitch(id).then(
        () => {
          this.configuredSwitches = this.configuredSwitches.filter(function(
            positionSwitch
          ) {
            return positionSwitch.id != id;
          });
        },
        error => {
          alert(
            "An error occurred while trying to delete the switch:\n" +
              error.response.data.error
          );
        }
      );
    },
    deleteRotaryEncoderConfiguration(id) {
      apiService.deleteRotaryEncoder(id).then(
        () => {
          this.configuredEncoders = this.configuredEncoders.filter(function(
            rotaryEncoder
          ) {
            return rotaryEncoder.id != id;
          });
        },
        error => {
          alert(
            "An error occurred while trying to delete the rotary encoder:\n" +
              error.response.data.error
          );
        }
      );
    },
    editSwitchConfiguration(id) {
      var switchToEdit = this.configuredSwitches.filter(function(switchConfig) {
        return switchConfig.id == id;
      });
      if (switchToEdit.length != 1) {
        alert(
          "a problem occured while trying to find the matching switch configuration. Maybe reloading the page will solve the issue"
        );
        return;
      }
      switchToEdit = switchToEdit[0];
      this.$refs["addSwitchModal"].show();
      this.switchToAdd.id = switchToEdit.id;
      this.switchToAdd.stepperId = switchToEdit.stepperId;
      this.switchToAdd.ioPinNumber = switchToEdit.ioPin;
      this.switchToAdd.positionName = switchToEdit.name;
      this.switchToAdd.switchPosition = switchToEdit.switchPosition;
      var switchTypeDecoded = switchToEdit.type;
      if (switchToEdit.isActiveHighType) {
        this.switchToAdd.switchTypeActiveState = 1;
      } else {
        this.switchToAdd.switchTypeActiveState = 2;
      }
      this.switchToAdd.switchType = switchTypeDecoded &= ~this.switchToAdd
        .switchTypeActiveState;
      this.switchToAdd.mode = "edit";
      console.log("editSwitchConfiguration called for id " + id, switchToEdit);
    },
    editRotaryEncoderConfiguration(id) {
      var encoderToEdit = this.configuredEncoders.filter(function(
        encoderConfig
      ) {
        return encoderConfig.id == id;
      });
      if (encoderToEdit.length != 1) {
        alert(
          "a problem occured while trying to find the matching encoder configuration. Maybe reloading the page will solve the issue"
        );
        return;
      }
      encoderToEdit = encoderToEdit[0];
      console.log(
        "editEncoderConfiguration called for id " + id,
        encoderToEdit
      );
      this.$refs["addEncoderModal"].show();
      this.encoderToAdd.stepperId = encoderToEdit.stepperId;
      this.encoderToAdd.ioPinA = encoderToEdit.ioPinA;
      this.encoderToAdd.ioPinB = encoderToEdit.ioPinB;
      this.encoderToAdd.name = encoderToEdit.name;
      this.encoderToAdd.stepMultiplier = encoderToEdit.stepMultiplier;
      this.encoderToAdd.id = encoderToEdit.id;
      this.encoderToAdd.mode = "edit";
    }
  },
  mounted() {
    this.getConfiguredSteppers();
    this.getConfiguredSwitches();
    this.getConfiguredRotaryEncoders();
  }
};
</script>
