<template>
    <div class="setup">

        <stepper-motor-details
                v-for="stepperConfiguration in configuredSteppers"
                v-bind:key="'stepper-'+stepperConfiguration.id"
                v-bind:stepperConfiguration="stepperConfiguration"
                v-on:delete="deleteStepperConfiguration">
        </stepper-motor-details>

        <div class="row pt-3">
            <div class="col-12">
                <b-button variant="success" v-b-modal.add-stepper>
                    <font-awesome-icon icon="plus-circle"/>
                    add stepper motor
                </b-button>

                <!-- Modal to add new stepper -->
                <b-modal id="add-stepper"
                         title="Add a new stepper motor configuration"
                         @ok="addStepperConfiguration"
                         ref="addStepperModal">
                    <form>
                        <div class="form-group">
                            <label for="displayName">Display name for the stepper motor</label>
                            <input type="text" class="form-control" id="displayName" v-model="stepperToAdd.name"
                                   placeholder="display name or axis name">
                        </div>
                        <div class="form-group">
                            <label for="stepPin">ESP IO pin for step signal</label>
                            <select id="stepPin" class="form-control" v-model="stepperToAdd.stepPin">
                                <option value="-1" selected>please select an IO pin</option>
                                <option v-for="ioPin in allowedIoOutputPins" :value="ioPin"
                                        v-bind:key="'stepPin'+ioPin">{{ioPin}}
                                </option>
                            </select>
                            <small id="stepPinHelp" class="form-text text-muted">select the IO pin of the ESP that is
                                connected to the step-pin on the stepper driver board
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="dirPin">ESP IO pin for direction signal</label>
                            <select id="dirPin" class="form-control" v-model="stepperToAdd.dirPin">
                                <option value="-1" selected>please select an IO pin</option>
                                <option v-for="ioPin in allowedIoOutputPins" :value="ioPin"
                                        v-bind:key="'dirPin'+ioPin">
                                    {{ioPin}}
                                </option>
                            </select>
                            <small id="dirPinHelp" class="form-text text-muted">select the IO pin of the ESP that is
                                connected to the direction-pin on the stepper driver board
                            </small>
                        </div>
                    </form>
                </b-modal>
            </div>
        </div>

        <position-switch-details
                v-for="switchConfiguration in configuredSwitches"
                v-bind:key="'switch-'+switchConfiguration.id"
                v-bind:switchConfiguration="switchConfiguration"
                v-on:delete="deleteSwitchConfiguration">
        </position-switch-details>

        <div class="row pt-3">
            <div class="col-12">
                <b-button variant="success" v-b-modal.add-switch>
                    <font-awesome-icon icon="plus-circle"/>
                    add limit switch
                </b-button>

                <!-- Modal to add new switch -->
                <b-modal id="add-switch"
                         title="Add a new limit switch configuration"
                         @ok="addSwitch"
                         ref="addSwitchModal">
                    <form>
                        <div class="form-group">
                            <label for="positionName">Display name for the switch</label>
                            <input type="text" class="form-control" id="positionName" v-model="switchToAdd.positionName"
                                   placeholder="display name for this switch">
                        </div>
                        <div class="form-group">
                            <label for="switchIoPin">ESP IO pin the switch is connected to</label>
                            <select id="switchIoPin" class="form-control" v-model="switchToAdd.ioPinNumber">
                                <option value="-1" selected>please select an IO pin</option>
                                <option v-for="ioPin in allowedIoOutputPins" :value="ioPin"
                                        v-bind:key="'switchPin'+ioPin">{{ioPin}}
                                </option>
                            </select>
                            <small id="switchIoPinHelp" class="form-text text-muted">select the IO pin of the ESP that
                                is
                                connected to this switch
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="stepperId">Stepper motor the switch belongs to</label>
                            <select id="stepperId" class="form-control" v-model="switchToAdd.stepperId">
                                <option value="-1" selected>please select a stepper motor</option>
                                <option v-for="stepperConfig in configuredSteppers" :value="stepperConfig.id"
                                        v-bind:key="'stepper'+stepperConfig.id">
                                    {{stepperConfig.name}} ({{stepperConfig.id}})
                                </option>
                            </select>
                            <small id="stepperIdHelp" class="form-text text-muted">select the IO pin of the ESP that is
                                connected to the direction-pin on the stepper driver board
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="switchType">Switch type</label>
                            <select id="switchType" class="form-control" v-model="switchToAdd.switchType">
                                <option value="-1" selected>please select the type of this switch</option>
                                <option value="4">homing switch begin/left/bottom</option>
                                <option value="8">homing switch end/right/top</option>
                                <option value="16">general position switch</option>
                                <option value="32">emergency stop switch</option>
                            </select>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="activeHigh"
                                   v-model="switchToAdd.switchTypeActiveState" v-bind:value="1">
                            <label class="form-check-label" for="activeHigh">Active-High</label>
                        </div>
                        <div class="form-check form-check-inline">

                            <input class="form-check-input" type="radio" id="activeLow"
                                   v-model="switchToAdd.switchTypeActiveState" v-bind:value="2">

                            <label class="form-check-label" for="activeLow">Active-Low</label>
                        </div>
                        <div>
                            <small id="switchTypeHelp" class="form-text text-muted">Define the type of the limit switch
                                and its active state
                            </small>
                        </div>
                        <div class="form-group">
                            <label for="switchPosition">Position (in steps) of the switch or -1 for not specific
                                position</label>
                            <input type="number" class="form-control" id="switchPosition"
                                   v-model="switchToAdd.switchPosition"
                                   placeholder="position in steps or -1">
                        </div>
                    </form>
                </b-modal>
            </div>
        </div>
    </div>
</template>

<style>

</style>

<script>
    import {ApiService} from '../services/ApiService';
    import StepperMotorDetails from '../components/StepperMotorDetails'
    import PositionSwitchDetails from '../components/PositionSwitchDetails'
    import BButton from 'bootstrap-vue/es/components/button/button';

    const apiService = new ApiService();

    export default {
        name: 'setup',
        data: function () {
            return {
                stepperToAdd: {
                    stepPin: -1,
                    dirPin: -1,
                    name: ""
                },
                switchToAdd: {
                    stepperId: -1,
                    ioPinNumber: -1,
                    positionName: "",
                    switchPosition: -1,
                    switchType: -1,
                    switchTypeActiveState: -1
                },
                configuredSteppers: [],
                configuredSwitches: [],
                allowedIoOutputPins: [0, 1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35, 36, 39]
            }
        },
        components: {
            BButton,
            StepperMotorDetails,
            PositionSwitchDetails
        },
        methods: {
            getConfiguredSteppers() {
                apiService.getConfiguredStepperMotors().then((data) => {
                    this.configuredSteppers = data.filter(function (stepper) {
                        return stepper.configured == "true"
                    });
                });
            },
            getConfiguredSwitches() {
                apiService.getConfiguredPositionSwitches().then((data) => {
                    this.configuredSwitches = data.filter(function (stepper) {
                        return stepper.name != null;
                    });
                });
            },
            addStepperConfiguration(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault();
                if (this.stepperToAdd.name == "") {
                    alert('Please enter a name for the new stepper motor');
                } else if (this.stepperToAdd.stepPin == -1) {
                    alert('Please select the step IO pin');
                } else if (this.stepperToAdd.dirPin == -1) {
                    alert('Please select the direction IO pin');
                } else {
                    apiService.addStepperMotor(this.stepperToAdd.stepPin, this.stepperToAdd.dirPin, this.stepperToAdd.name).then(() => {
                        this.getConfiguredSteppers();
                        this.$refs['addStepperModal'].hide();
                        this.stepperToAdd.stepPin = -1;
                        this.stepperToAdd.dirPin = -1;
                        this.stepperToAdd.name = "";
                    }, (error) => {
                        alert("An error occurred while trying to add the new stepper:\n" + error.response.data.error);
                    });
                }
            },
            addSwitch(bvModalEvt) {
                // Prevent modal from closing
                bvModalEvt.preventDefault();
                if (this.switchToAdd.positionName == "") {
                    alert('Please enter a name for the new switch');
                } else if (this.switchToAdd.ioPinNumber == -1) {
                    alert('Please select the IO pin the switch is connected to');
                } else if (this.switchToAdd.stepperId == -1) {
                    alert('Please select the stepper motor this switch is used for');
                } else if (this.switchToAdd.switchPosition == "") {
                    alert('Please select the position of this switch or -1 for no specific position');
                } else if (this.switchToAdd.switchType == -1) {
                    alert('Please select the type of this switch');
                } else if (this.switchToAdd.switchTypeActiveState == "") {
                    alert('Please select the active state of the switch');
                } else {
                    let switchTypeBitMask = this.switchToAdd.switchType + this.switchToAdd.switchTypeActiveState;
                    apiService.addPositionSwitch(this.switchToAdd.stepperId, this.switchToAdd.ioPinNumber, this.switchToAdd.positionName, this.switchToAdd.switchPosition, switchTypeBitMask).then(() => {
                        this.getConfiguredSwitches();
                        this.$refs['addSwitchModal'].hide();
                        this.switchToAdd.stepperId = -1;
                        this.switchToAdd.ioPinNumber = -1;
                        this.switchToAdd.positionName = "";
                        this.switchToAdd.switchPosition = -1;
                        this.switchToAdd.switchType = -1;
                        this.switchToAdd.switchTypeActiveState = "";
                    }, (error) => {
                        alert("An error occurred while trying to add the new stepper:\n" + error.response.data.error);
                    });
                }
            },
            deleteStepperConfiguration(id) {
                apiService.deleteStepperMotor(id).then(
                    () => {
                        this.configuredSteppers = this.configuredSteppers.filter(function (stepper) {
                            return stepper.id != id;
                        })
                    },
                    (error) => {
                        alert("An error occurred while trying to delete the stepper configuration:\n" + error.response.data.error);
                    }
                );
            },
            deleteSwitchConfiguration(id) {
                apiService.deletePositionSwitch(id).then(
                    () => {
                        this.configuredSwitches = this.configuredSwitches.filter(function (positionSwitch) {
                            return positionSwitch.id != id;
                        })
                    },
                    (error) => {
                        alert("An error occurred while trying to delete the switch:\n" + error.response.data.error);
                    }
                );
            },
        },
        mounted() {
            this.getConfiguredSteppers();
            this.getConfiguredSwitches();
        },
    }
</script>
