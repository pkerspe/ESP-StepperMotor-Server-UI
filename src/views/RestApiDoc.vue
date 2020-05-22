<template>
  <div class="restapi">
    <div class="card card-small mt-3">
      <div class="card-body p-3">
        <h1>REST API documentation (v. {{restApiVersionNumber}}):</h1>

        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th>METHOD</th>
              <th>ENDPOINT</th>
              <th style="min-width:250px">PARAMETERS</th>
              <th>DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="endpoint in endpointDetails" :key="endpoint.id">
              <td>
                <span v-if="endpoint.method == 'GET'">
                    <b-badge v-on:click="fireApiCall(endpoint)" variant="success">{{endpoint.method}}</b-badge>
                    <br/><span class="desc">(click to trigger parameterless call)</span>
                </span>
                <b-badge v-if="endpoint.method == 'POST' || endpoint.method == 'PUT'" variant="warning">{{endpoint.method}}</b-badge>
                <b-badge v-if="endpoint.method == 'DELETE'" variant="danger">{{endpoint.method}}</b-badge>
              </td>
              <td>
                <span v-for="path in endpoint.paths" :key="path">
                  <pre>{{path}}</pre>
                </span>
              </td>
              <td>
                  <span v-if="!endpoint.parameters || endpoint.parameters.length == 0">none</span>
                  <span class="parameter" v-for="parameter in endpoint.parameters" :key="parameter.name">
                      {{parameter.name}} (type: {{parameter.type}})<sup><span v-if="parameter.optional">optional</span>
                      <span v-if="!parameter.optional">required</span></sup><br/>
                    <span class="desc">{{parameter.desc}}</span>
                    <span v-if="parameter.allowedValues.length > 0" class="desc">
                        <strong>Allowed values: </strong>
                        <span v-for="value in parameter.allowedValues" :key="value">'{{value}}' </span><br/>
                    </span>
                  </span>
              </td>
              <td>{{endpoint.description}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ApiService } from "../services/ApiService";
import { BBadge } from "bootstrap-vue";
import axios from 'axios';

const apiService = new ApiService();

export default {
  name: "restapi",
  data: function() {
    return {
      versionNumber: window.serverUIVersion,
      restApiVersionNumber: "",
      endpointDetails: [
        {
          id: 1,
          method: "GET",
          paths: ["/api/status"],
          description:
            "get the current stepper server status report including the following information: version string of the server, wifi information (wifi mode, IP address), spiffs information (total space and free space)",
          parameters: [],
          output: ""
        },
        {
          id: 3,
          method: "POST",
          paths: ["/api/steppers/moveby"],
          description:
            "endpoint to set a new RELATIVE target position for the stepper motor in either mm, revs or steps. Required post parameters: id, unit, value",
          parameters: [
              {name:"id", type:"int", optional: false, desc:"the id of the stepper motor configuration",allowedValues:[]},
              {name:"unit", type:"String",optional: false, desc:"the unit describing the value parameter",allowedValues:["mm","revs","steps"]},
              {name:"value", type:"int",optional: false, desc:"the amount of units to move",allowedValues:[]}
          ],
          output: ""
        },
        {
          id: 4,
          method: "POST",
          paths: ["/api/steppers/position"],
          description:
            "endpoint to set a new absolute target position for the stepper motor in either mm, revs or steps. Required post parameters: id, unit, value",
          parameters: [
              {name:"id", type:"int",optional: false, desc:"the id of the stepper motor configuration",allowedValues:[]},
              {name:"unit", type:"String",optional: false, desc:"the unit describing the value parameter",allowedValues:["mm","revs","steps"]},
              {name:"value", type:"int",optional: false, desc:"the amount of units to move",allowedValues:[]}
          ],
          output: ""
        },
        {
          id: 5,
          method: "GET",
          paths: ["/api/steppers", "/api/steppers?id=[id]"],
          description:
            "endpoint to list all configured steppers or a specific one if 'id' query parameter is given",
          parameters: [
              {name:"id", type:"int",optional: true, desc:"the id of the stepper motor configuration to retrieve",allowedValues:[]},
          ],
          output: ""
        },
        {
          id: 6,
          method: "DELETE",
          paths: ["/api/steppers?id=[id]"],
          description: "delete an existing stepper configuration entry",
          parameters: [
              {name:"id", type:"int",optional: false, desc:"the id of the stepper motor configuration to delete",allowedValues:[]},
          ],

          output: ""
        },
        {
          id: 7,
          method: "POST",
          paths: ["/api/steppers"],
          description: "add a new stepper configuration entry. Returns the id of the newly created stepper configuration",
          parameters: [
            {name:"name", type:"String",optional: false, desc:"the display name for this stepper configuration. E.g. the axis name for the stepper. Should not be longer then 30 characters",allowedValues:[]},
            {name:"stepPin", type:"int",optional: false, desc:"the IO pin number of the ESP to use for sending step signals to the stepper driver",allowedValues:[]},
            {name:"dirPin", type:"int",optional: false, desc:"the IO pin number of the ESP to use for sending the direction signal to the stepper driver",allowedValues:[]}
          ],
          output: ""
        },
        {
          id: 8,
          method: "PUT",
          paths: ["/api/steppers?id=[id]"],
          description: "update an existing stepper configuration entry",
          parameters: [
            {name:"id", type:"int",optional: false, desc:"the id of the stepper motor configuration to update",allowedValues:[]},
            {name:"name", type:"String",optional: false, desc:"the display name for this stepper configuration. E.g. the axis name for the stepper. Should not be longer then 30 characters",allowedValues:[]},
            {name:"stepPin", type:"int",optional: false, desc:"the IO pin number of the ESP to use for sending step signals to the stepper driver",allowedValues:[]},
            {name:"dirPin", type:"int",optional: false, desc:"the IO pin number of the ESP to use for sending the direction signal to the stepper driver",allowedValues:[]}
          ],
          output: ""
        },
        {
          id: 9,
          method: "GET",
          paths: ["/api/switches/status", "/api/switches/status?id=[id]"],
          description:
            "get the current switch status (active, inactive) of either one specific switch or all switches (returned as a bit mask in MSB order)",
          parameters: [
              {name:"id", type:"int",optional: true, desc:"the id of the switch status to retrieve",allowedValues:[]},
          ],
          output: ""
        },
        {
          id: 10,
          method: "GET",
          paths: ["/api/switches", "/api/switches?id=[id]"],
          description:
            "endpoint to list all switch configurations or a specific configuration if the 'id' query parameter is given",
          parameters: [
              {name:"id", type:"int",optional: true, desc:"the id of the switch configuration to retrieve",allowedValues:[]},
          ],
          output: ""
        },
        {
          id: 11,
          method: "POST",
          paths: ["/api/switches"],
          description: "endpoint to add a new switch configuration, Retuns the id of the newly created switch configuration in the response",
          parameters: [
              {name:"stepperId", type:"int",optional: false, desc:"the id of the stepper configuration this switch should be linked to",allowedValues:[]},
              {name:"ioPinNumber", type:"int",optional: false, desc:"the IO pin number the switch is connected to",allowedValues:[]},
              {name:"positionName", type:"String",optional: false, desc:"the name for this switch or the position it represents e.g. 'Homing Switch X-Axis'. Should be no more than 30 characters long",allowedValues:[]},
              {name:"switchPosition", type:"String",optional: false, desc:"the position value",allowedValues:[]},
              {name:"switchType", type:"int",optional: false, desc:"the type of switch. 4=homing switch begin/left/bottom,8=homing switch end/right/top,16=general position switch,32=emergency stop switch",allowedValues:[4,8,16,32]},
          ],
          output: ""
        },
        {
          id: 12,
          method: "PUT",
          paths: ["/api/switches?id=[id]"],
          description: "endpoint to update an existing switch configuration",
          parameters: [
              {name:"id", type:"int",optional: false, desc:"the id of the switch configuration to update",allowedValues:[]},
              {name:"stepperId", type:"int",optional: false, desc:"the id of the stepper configuration this switch should be linked to",allowedValues:[]},
              {name:"ioPinNumber", type:"int",optional: false, desc:"the IO pin number the switch is connected to",allowedValues:[]},
              {name:"positionName", type:"String",optional: false, desc:"the name for this switch or the position it represents e.g. 'Homing Switch X-Axis'. Should be no more than 30 characters long",allowedValues:[]},
              {name:"switchPosition", type:"String",optional: false, desc:"the position value",allowedValues:[]},
              {name:"switchType", type:"int",optional: false, desc:"the type of switch. 4=homing switch begin/left/bottom,8=homing switch end/right/top,16=general position switch,32=emergency stop switch",allowedValues:[4,8,16,32]}
          ],
          output: ""
        },
        {
          id: 13,
          method: "DELETE",
          paths: ["/api/switches?id=[id]"],
          description: "delete a specific switch configuration",
          parameters: [
              {name:"id", type:"int",optional: false, desc:"the id of the switchconfiguration to delete",allowedValues:[]},
          ],
          output: ""
        }
      ]
    };
  },
  components: {
    BBadge
  },
  methods: {
    getRestApiVersion() {
      apiService.getRestApiVersion().then(data => {
        this.restApiVersionNumber = data;
      });
    },
    fireApiCall(endpointConfig){
        var url = process.env.VUE_APP_REST_API_BASE_URL + endpointConfig.paths[0];
        axios.get(url).then(response => alert(JSON.stringify(response.data,null,2)));
    }
  },
  mounted() {
    this.getRestApiVersion();
  }
};
</script>

<style>
.parameter {
    display: block;
    margin-bottom: 10px;
    color: grey;
}

.desc {
    font-size: 0.6rem;
    display: block;
}
</style>
