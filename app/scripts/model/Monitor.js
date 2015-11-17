
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

            ws.onmessage = ({ data }) => {
                let json = JSON.parse(data);
                json.response.state.forEach(i => {
                    if (i.identifier) {
                        // TODO: think what to do with it.
                        i.identifier = decodeURIComponent(i.identifier);
                        let callback = this.callbacks.get(i.identifier);
                        if (callback) {
                            callback(i);
                        }
                    }
                })
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
