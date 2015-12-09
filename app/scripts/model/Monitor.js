
const TYPE_EVENT = 'event';
const TYPE_RESPONSE = 'response';

export const CREATE_EVENT = 'create';
export const CHANGE_EVENT = 'create';
export const DELETE_EVENT = 'delete';

export default class DobbyMonitor {

    constructor() {
        this.callbacks = new Map();
    }

    openConnection() {
        if (this.connection) {
            return this.connection;
        }

        this.connection = new Promise((resolve, reject) => {
            let ws = new WebSocket('ws://localhost:8080/dobby/monitor');

            ws.onopen = function() {
                console.log("MONITOR OPENED");
                resolve(ws);
            };

            ws.onclose = () => {
                this.connection = null
            };

            ws.onmessage = ({ data }) => {
                let json = JSON.parse(data);
                if (json.type === TYPE_EVENT) {
                    let identifier = json.message;
                    identifier.identifier = decodeURIComponent(identifier.identifier);
                    let callback = this.callbacks.get(identifier.identifier);
                    if (callback) {
                        callback(json.event, identifier);
                    }
                }
            }
        });

        return this.connection;
    }

    _registerCallback(identifiers, changeCallback) {
        identifiers.forEach(i => {
            this.callbacks.set(i, changeCallback);
        })
    }

    _send(payload) {
        this.openConnection()
            .then(ws => {
                ws.send(JSON.stringify(payload));
            })
    }

    /***
     * public method, adds listener to identifier changes
     * @param identifiers [Array] of identifiers names
     * @param changeCallback callback which will be executed on identifier change
     */
    listen(identifiers, changeCallback) {
        this._registerCallback(identifiers, changeCallback);
        this._send({
            "type":"start",
            "sequence":"someSeq",
            "monitor":"identifier",
            "parameters": {
                "identifiers": identifiers
            }
        });
    }
}
