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
            currentView: mainViewStore.getInitialState().currentView
        };
    }

    componentDidMount() {
        this.unsubscribe = mainViewStore.listen(({currentView}) => {
            this.setState({currentView});
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
                    <ColumnView identifiers={this.props.identifiers} />
                </div>
            </div>
        )
    }
}


export default Main;

