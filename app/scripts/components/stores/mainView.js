import Reflux from "reflux";

import setView, { GRAPH_VIEW, COLUMN_VIEW } from "../actions/mainView";

var mainViewStore = Reflux.createStore({
    init() {
        this.listenTo(setView, this.onSwitchView);
    },

    getInitialState() {
        return {
            currentView: GRAPH_VIEW,
            panelViewRoots: []
        }
    },

    onSwitchView(viewType, panelViewRoots=null) {
        let state = {currentView: viewType};
        if (panelViewRoots !== null) {
            state.panelViewRoots = panelViewRoots;
        }
        this.trigger(state);
    }
});

export default mainViewStore;