import Component from "../Component";
import Graph from "./D3Graph";

import ColumnView from "./ColumnView/ColumnView";
import GraphView from "./GraphView/GraphView";


const GRAPH_VIEW = Symbol("graph view");
const COLUMN_VIEW = Symbol("column view");


class Main extends React.Component {
    //static propTypes = { initialCount: React.PropTypes.number };
    //static defaultProps = { initialCount: 0 };
    constructor(props) {
        super(props);
        this.state = {
            currentView: GRAPH_VIEW
        };
    }

    showGraph() {
        this.setState({
            currentView: GRAPH_VIEW
        });
    }

    showColumn() {
        this.setState({
            currentView: COLUMN_VIEW
        })
    }

    componentDidMount() {

        var $switchView = $(".switch-view");

        $switchView.on("click", () => {
            // todo: get rid of this Panel View check
            if ($switchView.text() === "Panel View") {
                $switchView.text("Graph");
                this.showColumn();
                //this.hideTooltip();

            } else {
                $switchView.text("Panel View");
                this.showGraph();
            }
        });
    }

    componentWillUnmount() {
        $(".switch-view").off();
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

