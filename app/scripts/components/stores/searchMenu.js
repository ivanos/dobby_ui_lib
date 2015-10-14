import {showSearchMenu, hideSearchMenu} from "../actions/searchMenu";

import Reflux from "reflux";

var searchMenuStore = Reflux.createStore({
    getInitialState() {
        return {
            searchMenuPosition: null,
            searchIdentifier: null
        }
    },

    init() {
        this.listenTo(showSearchMenu, this.onShowSearchMenu);
        this.listenTo(hideSearchMenu, this.onHideSearchMenu);
    },

    onShowSearchMenu(searchMenuPosition, searchIdentifier) {
        this.trigger({
            searchMenuPosition,
            searchIdentifier
        });
    },

    onHideSearchMenu() {
        this.trigger({
            searchMenuPosition: null,
            searchIdentifier: null
        });
    }
});

export default searchMenuStore;
