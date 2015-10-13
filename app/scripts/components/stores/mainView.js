import {setView} from "../actions/mainView";

import Reflux from "reflux";

const GRAPH_VIEW = Symbol("graph view");
const COLUMN_VIEW = Symbol("column view");

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

export {
    GRAPH_VIEW,
    COLUMN_VIEW
}

export default mainViewStore;