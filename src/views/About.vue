<template>
    <div class="about">
        <div class="card card-small mt-3">
            <div class="card-body p-3">
                <div class="row pb-2 border-bottom">
                    <div class="col-md-4">
                        <img src="../assets/logo.svg" style="width: 100%;"/>
                    </div>
                    <div class="col-md-8">
                        <p><strong>ESP-StepperMotion-Server</strong><br/>
                            UI version: {{versionNumber}}<br/>
                            Server version: {{restApiVersionNumber}}<br/>
                            Copyright (c) 2019 Paul Kerspe - Licensed under the <a
                                    href="https://github.com/pkerspe/ESP-StepperMotor-Server/blob/master/LICENSE.txt"
                                    target="_blank">MIT license</a>.</p>
                                    <p>
                                    <b-button variant="success" href="/restapi">
                                        <font-awesome-icon icon="file" /> show REST API documentation
                                    </b-button>
                                    </p>
                    </div>
                </div>

                <div class="pt-3">
                    <p>This user interface is part of the ESP-StepperMotor-Server Library for ESP32 and ESP8266 modules.<br/>
                        For a <strong>user manual</strong> visit the <a
                                href="https://github.com/pkerspe/ESP-StepperMotor-Server/wiki/ESP-Stepper-Motor-Server-user-manual">WIKI
                            pages of the project</a>.<br/>
                        For more details see the project code repository: <a
                                href="https://github.com/pkerspe/ESP-StepperMotor-Server" target="_blank">https://github.com/pkerspe/ESP-StepperMotor-Server</a><br/>
                        The user interface is developed in a seperate code repository: <a
                                href="https://github.com/pkerspe/ESP-StepperMotor-Server-UI" target="_blank">https://github.com/pkerspe/ESP-StepperMotor-Server-UI</a>
                    </p>
                    <p>All code is provided as-is, use it on your own risk. Users are responsible for connecting the
                        hardware
                        correctly and being cautious when working with higher voltages and moving parts in general.</p>
                    <p><span class="copyright ml-auto my-auto mr-2">Admin Template by <a
                            href="https://designrevision.com"
                            rel="nofollow">DesignRevision</a></span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {ApiService} from '../services/ApiService';
    import {BButton} from 'bootstrap-vue';

    const apiService = new ApiService();

    export default {
        name: 'about',
        data: function () {
            return {
                versionNumber: window.serverUIVersion,
                restApiVersionNumber: ""
            }
        },
        components: {
            BButton
        },
        methods: {
            getRestApiVersion() {
                apiService.getRestApiVersion().then((data) => {
                    this.restApiVersionNumber = data;
                });
            },
        },
        mounted() {
            this.getRestApiVersion();
        },
    }
</script>
