import {setRootIdentifiers} from "../actions/application";

import Reflux from "reflux";

var appStateStore = Reflux.createStore({
    init() {
        this.listenTo(setRootIdentifiers, this.onSetRootIdentifiers);
    },

    getInitialState() {
        return {
            rootIdentifiers: []
        }
    },

    onSetRootIdentifiers(rootIdentifiers) {
        this.trigger({rootIdentifiers});
    }

});

export default appStateStore;