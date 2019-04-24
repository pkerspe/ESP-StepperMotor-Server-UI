<template>
    <div class="rotaryEncoderDetails card card-small mt-3">
        <div class="card-body p-3">
            <div class="d-flex flex-row">
                <div class="d-none d-sm-inline-block align-self-center p-1">
                    <img src="../assets/rotaryEncoderWheel.svg" style="width:70px;"/>
                </div>
                <div class="p-1 pl-3">
                    Name: <br/>
                    ID:<br/>
                    IO-Pin A:<br/>
                    IO-Pin B:<br/>
                    Linked stepper ID:<br/>
                </div>
                <div class="p-1">
                    <strong>{{encoderConfiguration.name}}</strong><br/>
                    <strong>{{encoderConfiguration.id}}</strong><br/>
                    <strong>{{encoderConfiguration.ioPinA}}</strong><br/>
                    <strong>{{encoderConfiguration.ioPinB}}</strong><br/>
                    <strong>{{encoderConfiguration.stepperId}}</strong> ({{encoderConfiguration.stepperName}})<br/>
                </div>
                <div class="hover-btn">
                    <b-button variant="danger" v-on:click="$emit('delete',encoderConfiguration.id)">
                        <font-awesome-icon icon="trash"/>
                    </b-button>
                    <br/>
                    <b-button class="mt-3" variant="success" v-on:click="$emit('edit',encoderConfiguration.id)">
                        <font-awesome-icon icon="pen"/>
                    </b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BButton from 'bootstrap-vue/es/components/button/button';

    export default {
        name: 'RotaryEncoderDetails',
        props: {
            encoderConfiguration: Object,
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

    .rotaryEncoderDetails:hover .hover-btn {
        display: block;
    }
</style>
