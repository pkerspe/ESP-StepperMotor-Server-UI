<template>
    <div class="stepperDetails card card-small mt-3">
        <div class="card-body p-3">
            <div class="d-flex flex-row">
                <div class="d-none d-sm-inline-block align-self-center p-1">
                    <img src="../assets/stepper.svg" style="width:70px;height:90px;"/>
                </div>
                <div class="p-1 pl-3">
                    Name: <br/>
                    ID:<br/>
                    Position:<br/>
                    Motion completed:<br/>
                    Velocity:<br/>
                    Hardware IO Pins:<br/>
                    Motion-Settings:<br/>
                </div>
                <div class="p-1">
                    <strong>{{stepperConfiguration.name}}</strong><br/>
                    {{stepperConfiguration.id}}<br/>
                    {{stepperConfiguration.position.mm}} mm / {{stepperConfiguration.position.revs}} revs /
                    {{stepperConfiguration.position.steps}} steps<br/>
                    {{stepperConfiguration.stopped}}<br/>
                    {{stepperConfiguration.velocity.rev_s}} revs/sec / {{stepperConfiguration.velocity.mm_s}} mm_s /
                    {{stepperConfiguration.velocity.steps_s}} steps/sec<br/>
                    Step-Pin: {{stepperConfiguration.stepPin}} / Dir-Pin: {{stepperConfiguration.dirPin}}<br/>
                    Steps/mm: {{stepperConfiguration.stepsPerMM}} / Steps/revolution: {{stepperConfiguration.stepsPerRev}}
                </div>
                <div class="hover-btn">
                    <b-button variant="danger" v-on:click="$emit('delete',stepperConfiguration.id)">
                        <font-awesome-icon icon="trash"/>
                    </b-button>
                    <br/>
                    <b-button class="mt-3" variant="success" v-on:click="$emit('edit',stepperConfiguration.id)">
                        <font-awesome-icon icon="pen"/>
                    </b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {BButton} from 'bootstrap-vue';

    export default {
        name: 'StepperMotorDetails',
        props: {
            stepperConfiguration: Object,
        },
        components: {
            BButton
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .hover-btn {
        position: absolute;
        right: 15px;
        display: none;
    }

    .stepperDetails:hover .hover-btn {
        display: block;
    }
</style>
