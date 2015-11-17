import {hideGraphLinks, showGraphLinks} from "../actions/graphView";

import Reflux from "reflux";

let graphViewStore = Reflux.createStore({
    getInitialState() {
        return {
            isGraphLinksVisible: true
        }
    },

    init() {
        this.listenTo(hideGraphLinks, this.onHideLinksColumn);
        this.listenTo(showGraphLinks, this.onShowLinksColumn);
    },

    onHideLinksColumn() {
        this.trigger({isGraphLinksVisible: false});
    },

    onShowLinksColumn() {
        this.trigger({isGraphLinksVisible: true});
    }
});

export default graphViewStore;
