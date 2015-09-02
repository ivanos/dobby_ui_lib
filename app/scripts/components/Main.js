import Component from "../Component";
import Graph from "./D3Graph";

import ColumnView from "./ColumnView/ColumnView";
import GraphView from "./GraphView/GraphView";

import {setView} from "./actions/mainView";
import mainViewStore, {GRAPH_VIEW, COLUMN_VIEW} from "./stores/mainView";

class Main extends React.Component {
    //static propTypes = { initialCount: React.PropTypes.number };
    //static defaultProps = { initialCount: 0 };
    constructor(props) {
        super(props);
        this.state = {
            currentView: GRAPH_VIEW
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

        if (this.state.currentView === GRAPH_VIEW) {
            content = <GraphView identifiers={this.props.identifiers} />
        } else if (this.state.currentView === COLUMN_VIEW) {
            content = <ColumnView
                identifiers={this.props.identifiers}
            />
        }

        return (<div className="main-container">{content}</div>)
    }
}


export default Main;


/**
 * Components:
 *
 * Main -> Manage switches between graph and Column
 *  Graph -> State - {identifiers, links}
 *      Tooltip ->
 *  Column -> State - {identifier, Neighbour: {identifiers, links}}
 *      Column ->
 *      Breadcrumbs ->
 *
 */

