import Component from "../Component";
import Graph from "./D3Graph";

import ColumnView from "./ColumnView/ColumnView";
import GraphView from "./GraphView/GraphView";

import {setView} from "./actions/mainView";
import mainViewStore, {GRAPH_VIEW, COLUMN_VIEW} from "./stores/mainView";

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentView: mainViewStore.getInitialState().currentView,
            panelViewRoots: this.props.identifiers
        };
    }

    componentDidMount() {
        this.unsubscribe = mainViewStore.listen((state) => {
            this.setState(state);
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        var content = "View is not defined";

        return (
            <div className="main-container">
                <div style={{flex: 1, display: this.state.currentView === GRAPH_VIEW ? "flex" : "none"}}>
                    <GraphView identifiers={this.props.identifiers} />
                </div>
                <div style={{flex: 1, display: this.state.currentView === COLUMN_VIEW ? "flex" : "none"}}>
                    <ColumnView key={this.state.panelViewRoots[0].name} identifiers={this.state.panelViewRoots} />
                </div>
            </div>
        )
    }
}


export default Main;

