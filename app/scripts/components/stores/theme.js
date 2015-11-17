import { setTheme, THEME_DARK } from "../actions/theme";

import Reflux from "reflux";

var themeStore = Reflux.createStore({
    init() {
        this.listenTo(setTheme, this.onThemenChange);
    },

    getInitialState() {
        return {
            theme: THEME_DARK
        }
    },

    onThemenChange(theme) {
        this.trigger({theme});
    }
});

export default themeStore;
