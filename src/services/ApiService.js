import axios from 'axios';
import steppersMock from './mock_responses/steppers';
import switchesMock from './mock_responses/steppers';

const API_URL = process.env.VUE_APP_REST_API_BASE_URL;
const mock = false;

export class ApiService {
    constructor() {}

    getConfiguredStepperMotors() {
        const url = `${API_URL}/api/steppers`;
        if (mock) {
            var p1 = new Promise(
                function(resolve) {
                    resolve(steppersMock.steppers);
                });
            return p1;
        } else {
            return axios.get(url).then(response => response.data.steppers);
        }

    }

    getConfiguredStepperMotor(id) {
        const url = `${API_URL}/api/steppers?id=${id}`;
        return axios.get(url).then(response => response.data);
    }

    addStepperMotor(stepPin, dirPin, displayName) {
        const url = `${API_URL}/api/steppers`;
        var params = {
            stepPin: stepPin,
            dirPin: dirPin,
            name: displayName
        };
        return axios.post(url, params).then(response => response.data);
    }

    moveStepperBySteps(stepperId, steps, speed, accell) {
        const url = `${API_URL}/api/steppers/moveby?id=` + stepperId + '&value=' + steps + '&unit=steps&speed=' + speed + "&accell=" + accell;
        return axios.post(url).then(response => response.data);
    }

    moveStepperByRevs(stepperId, revs) {
        const url = `${API_URL}/api/steppers/moveby?id=` + stepperId + '&value=' + revs + '&unit=revs';
        return axios.post(url).then(response => response.data);
    }

    moveStepperByMilimeter(stepperId, mm) {
        const url = `${API_URL}/api/steppers/moveby?id=` + stepperId + '&value=' + mm + '&unit=mm';
        return axios.post(url).then(response => response.data);
    }

    deleteStepperMotor(stepperId) {
        const url = `${API_URL}/api/steppers?id=` + stepperId;
        return axios.delete(url).then(response => response.data);
    }

    addPositionSwitch(stepperId, ioPinNumber, positionName, switchPosition, switchType) {
        const url = `${API_URL}/api/switches`;
        var params = {
            stepperId: stepperId,
            ioPinNumber: ioPinNumber,
            positionName: positionName,
            switchPosition: switchPosition,
            switchType: switchType
        };
        return axios.post(url, params).then(response => response.data);
    }

    getConfiguredPositionSwitches() {
        const url = `${API_URL}/api/switches`;
        if (mock) {
            var p1 = new Promise(
                function(resolve) {
                    resolve(switchesMock.switches);
                });
            return p1;
        } else {
            return axios.get(url).then(response => response.data.switches);
        }
    }

    deletePositionSwitch(switchId) {
        const url = `${API_URL}/api/switches?id=` + switchId;
        return axios.delete(url).then(response => response.data);
    }

    deleteRotaryEncoder(encoderId) {
        const url = `${API_URL}/api/encoders?id=` + encoderId;
        return axios.delete(url).then(response => response.data);
    }

    getServerStatus() {
        const url = `${API_URL}/api/status`;
        if (mock) {
            var p1 = new Promise(
                function(resolve) {
                    resolve(switchesMock.status);
                });
            return p1;
        } else {
            return axios({
                method: 'get',
                url: url,
                timeout: 2000
            }).then(response => response.data);
        }
    }

    getRestApiVersion() {
        return this.getServerStatus().then(response => response.version)
    }
}