import {setView} from "../actions/mainView";

const GRAPH_VIEW = Symbol("graph view");
const COLUMN_VIEW = Symbol("column view");

var mainViewStore = Reflux.createStore({
    init() {
        this.listenTo(setView, this.onSwitchView);
    },

    getInitialState() {
        return {
            currentView: GRAPH_VIEW
        }
    },

    onSwitchView(viewType) {
        this.trigger({currentView: viewType});
    }
});

export {
    GRAPH_VIEW,
    COLUMN_VIEW
}

export default mainViewStore;