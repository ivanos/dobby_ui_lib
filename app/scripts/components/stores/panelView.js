import {hideLinkColumn, showLinkColumn} from "../actions/panelView";

import Reflux from "reflux";

var panelViewStore = Reflux.createStore({
    getInitialState() {
        return {
            isLinksVisible: true
        }
    },

    init() {
        this.listenTo(hideLinkColumn, this.onHideLinksColumn);
        this.listenTo(showLinkColumn, this.onShowLinksColumn);
    },

    onHideLinksColumn() {
        this.trigger({isLinksVisible: false});
    },

    onShowLinksColumn() {
        this.trigger({isLinksVisible: true});
    }
});

export default panelViewStore;
