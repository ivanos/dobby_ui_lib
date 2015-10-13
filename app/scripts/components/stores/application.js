import {setRootIdentifiers} from "../actions/application";

import Reflux from "reflux";

var appStateStore = Reflux.createStore({
    init() {
        this.listenTo(setRootIdentifiers, this.onSetRootIdentifiers);
    },

    getInitialState() {
        return {
            rootIdentifier: []
        }
    },

    onSetRootIdentifiers(rootIdentifiers) {
        console.log(arguments);
        this.trigger({rootIdentifiers});
    }

});

export default appStateStore;