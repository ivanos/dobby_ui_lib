import { setScreen, WELCOME_SCREEN } from "../actions/application";

import Reflux from "reflux";

var appStateStore = Reflux.createStore({
    init() {
        this.listenTo(setScreen, this.onSetScreen);
    },

    getInitialState() {
        return {
            screen: WELCOME_SCREEN
        }
    },

    onSetScreen(screen) {
        this.trigger({screen: screen});
    }

});

export default appStateStore;