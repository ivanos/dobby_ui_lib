import Graph from "../D3Graph";
import Identifier from "../../model/Identifier";
import SearchMenu from "./SearchMenu";

var GraphView = React.createClass({

    getInitialState() {
        return {
            nodes: new Set(this.props.identifiers),
            edges: new Set(),
            searchMenuPosition: null,
            searchIdentifier: null
        }
    },

    _addListeners(graph) {
        $(graph).on("doubleClickNode", this._dblClick);
        $(graph).on("contextmenu", this._rightClick);
        $(graph).on("overNode", this._overNode);
        $(graph).on("overEdge", this._overEdge);
    },

    componentDidMount() {
        var graph = new Graph($(React.findDOMNode(this.refs.graphContainer)));

        this._addListeners(graph);
        this._updateGraph(graph);

        this.graph = graph;
    },

    _search(identifier, params={}) {
        var {nodes, edges} = this.state;
        nodes = [...nodes];
        edges = [...edges];

        return identifier.search(params)
            .then(({identifiers, links}) => {
                links = links.map((l) => {
                    return {
                        target: Identifier.get(l.target),
                        source: Identifier.get(l.source),
                        data: l
                    }
                });

                nodes.push(...identifiers);
                edges.push(...links);

                this.setState({nodes: new Set(nodes), edges: new Set(edges)})
            });
    },

    _dblClick(_, identifier) {
        this._search(identifier);
    },

    _rightClick(_, identifier) {
        var {x, y} = window.event;
        this.setState({
            searchMenuPosition: {x, y},
            searchIdentifier: identifier
        });
    },

    _resetSearch() {
        this.setState({
            searchMenuPosition: null,
            searchIdentifier: null
        })
    },

    _onSearch(params) {
        this._search(this.state.searchIdentifier, params)
            .then(() => this._resetSearch())
    },

    _overNode(_, identifier) {
        var graph = this.graph,
            links = [...this.state.edges].filter((link) => {
                return link.target == identifier || link.source == identifier;
            }),
            nodes = [...new Set(links.reduce((a, link) => {
                a.push(link.target, link.source);
                return a;
            }, []))],
            edges = links.map((l) => l.data);


        graph.highlight({nodes, edges, mainNode: identifier});

    },

    _overEdge(_, link) {
        var graph = this.graph;

        graph.highlight({
            nodes: [Identifier.get(link.source), Identifier.get(link.target)],
            edges: [link]}
        );
    },

    _updateGraph(graph) {
        graph.addNodes(this.state.nodes);
        graph.addEdges(this.state.edges);
    },

    componentDidUpdate(_, oldState) {
        if (this.state.nodes !== oldState.nodes || this.state.edges !== oldState.edges) {
            var graph = this.graph;
            this._updateGraph(graph);
        }
    },

    _onContainerClick() {
        this._resetSearch();
        this.graph.highlight({nodes: [], edges: []});
    },

    render() {
        return (
            <div
                style={{flex: 1, display: "flex", alignItems: "stretch"}}
            >
                <div
                    style={{flex: 1, display: "flex", alignItems: "stretch"}}
                    ref="graphContainer"
                    onClick={this._onContainerClick}
                />
                <SearchMenu
                    position={this.state.searchMenuPosition}
                    onSubmit={this._onSearch}
                />
            </div>
        );
    },

    // destructing component
    _removeListeners(graph) {
        $(graph).off("doubleClickNode", this._dblClick);
        $(graph).off("contextmenu", this._rightClick);
        $(graph).off("overNode", this._overNode);
        $(graph).off("overEdge", this._overEdge);

    },

    componentWillUnmount() {
        var graph = this.graph;

        this._removeListeners(graph);

        this.graph = null;
    }

});


//[MATCH_IDENTIFIERS_TYPE]: "match_metadata",
//[MATCH_LINKS_TYPE]: "match_links",
//[FILTER_TYPE]: "results_filter",
//[TERMINAL_TYPE]: "match_terminal",
//[DEPTH_TYPE]: "max_depth"

//
//class GraphView1 extends React.Component {
//
//    constructor(props) {
//        super(props);
//
//        this.state = {
//            data: {
//                nodes: [],
//                links: []
//            }
//        };
//    }
//
//    componentDidMount() {
//        this.initGraph(this.props.identifier);
//    }
//
//    initGraph(identifier) {
//        this.graph = new Graph($(React.findDOMNode(this)));
//        this.graph.addNode(identifier);
//
//        $(this.graph).on("overEdge", (event, link) => {
//            this.showTooltip(false, link);
//            this.graph.highlight({
//                nodes: [Identifier.get(link.source), Identifier.get(link.target)],
//                edges: [link]
//            });
//        });
//        //$(this.graph).on("outEdge", this.hideTooltip.bind(this));
//        $(this.graph).on("overNode", (event, identifier) => {
//            var identifiers = identifier.neighbours();
//
//            identifiers.push(identifier);
//
//            this.showTooltip(true, identifier);
//            this.graph.highlight({
//                mainNode: identifier,
//                nodes: identifiers,
//                edges: identifier.links()
//            });
//        });
//
//        $(this.graph)
//            .on("doubleClickNode", (event, identifier) => this.search(identifier, {max_depth: 1}))
//            .on("contextmenu", (event, identifier) => this.showContextMenu(event, identifier));
//
//        $(this.graph.$el).on("click", () => {
//            this.hideTooltip();
//            this.hideContext();
//        });
//    }
//
//    hideTooltip() {
//        //this.tooltip.hide();
//    }
//
//    showTooltip(isIdentifier, data) {
//        //this.tooltip.show({
//        //    title: isIdentifier ? `Identifier: ${data.name}` : `Link: ${data.source} -> ${data.target}`,
//        //    content: data.metadata.display()
//        //});
//    }
//
//
//    search(identifier, params) {
//
//        this.hideContext();
//
//        identifier.search(params)
//            .then(({links, identifiers}) => {
//
//                this.graph.addNodes(identifiers);
//                this.graph.addEdges(links.map((l) => {
//                    return {
//                        target: Identifier.get(l.target),
//                        source: Identifier.get(l.source),
//                        data: l
//                    }
//                }));
//
//            }, function(error) {
//                alert("Unable to search for neighbors:" + error);
//            });
//    }
//
//    showContextMenu(event, identifier) {
//
//        //var position = {
//        //    x: window.event.x,
//        //    y: window.event.y
//        //};
//        //
//        //this.searchComponent.setIdentifier(identifier);
//        //this.menu.showAt(position);
//    }
//
//    hideContext() {
//        //this.menu.hide();
//        //this.graph.highlight({
//        //    nodes: [],
//        //    edges: []
//        //});
//    }
//
//
//
//    render() {
//        return (
//            <div style={{flex: 1, display: "flex", alignItems: "stretch"}}>
//            </div>
//        )
//    }
//}
//


/**
 * class Main extends Component {
    constructor(identifier) {
        super($("[main]"));

        this.$name = this.find(".identifier-name");
        this.$clearIdentifier = this.find(".clear-identifier");
        this.$clearIdentifier.on("click", () => $(this).trigger("clear-identifier"));
        this.$switchView = this.find(".switch-view");


        this.$switchView.click(() => {
            if (this.$switchView.text() === "List") {
                this.$switchView.text("Graph");
                this.hideTooltip();
                this.graph.hide(() => this.$list.show());
            } else {
                this.$switchView.text("List");
                this.$list.hide(() => this.graph.show());
            }
        });

        this.tooltip = new Tooltip(this.find("[tooltip]"));

        this.searchComponent = new Search(this.find("[search]"));
        this.menu = new Menu(this.find("[menu]"));
        $(this.searchComponent).on("search", (event, {identifier, params}) => this.search(identifier, params));
    }

    hideTooltip() {
        this.tooltip.hide();
    }

    showTooltip(isIdentifier, data) {
        this.tooltip.show({
            title: isIdentifier ? `Identifier: ${data.name}` : `Link: ${data.source} -> ${data.target}`,
            content: data.metadata.display()
        });
    }

    setIdentifier(identifier) {
        this.$name.text(identifier.name);

        this.initGraph(identifier);

        this.graph.show();

        this.$list = this.find("[list]");

        React.render(
            <ColumnView
                identifier={identifier}
                onAppend={() => this.$list.animate({scrollLeft: this.$list.prop("scrollWidth")}, 500)}
            />,
            this.$list.get(0)
        );

        this.$list.hide();
    }

    initGraph(identifier) {
        this.graph = new Graph(this.find("[graph]"));
        this.graph.addNode(identifier);

        $(this.graph).on("overEdge", (event, link) => {
            this.showTooltip(false, link);
            this.graph.highlight({
                nodes: [Identifier.get(link.source), Identifier.get(link.target)],
                edges: [link]
            });
        });
        //$(this.graph).on("outEdge", this.hideTooltip.bind(this));
        $(this.graph).on("overNode", (event, identifier) => {
            var identifiers = identifier.neighbours();

            identifiers.push(identifier);

            this.showTooltip(true, identifier);
            this.graph.highlight({
                mainNode: identifier,
                nodes: identifiers,
                edges: identifier.links()
            });
        });

        $(this.graph)
            .on("doubleClickNode", (event, identifier) => this.search(identifier, {max_depth: 1}))
            .on("contextmenu", (event, identifier) => this.showContextMenu(event, identifier));

        $(this.graph.$el).on("click", () => {
            this.hideTooltip();
            this.hideContext();
        });
    }

    search(identifier, params) {

        this.hideContext();

        identifier.search(params)
            .then(({links, identifiers}) => {

                this.graph.addNodes(identifiers);
                this.graph.addEdges(links.map((l) => {
                    return {
                        target: Identifier.get(l.target),
                        source: Identifier.get(l.source),
                        data: l
                    }
                }));

            }, function(error) {
                alert("Unable to search for neighbors:" + error);
            });
    }

    showContextMenu(event, identifier) {

        var position = {
            x: window.event.x,
            y: window.event.y
        };

        this.searchComponent.setIdentifier(identifier);
        this.menu.showAt(position);
    }

    hideContext() {
        this.menu.hide();
        this.graph.highlight({
            nodes: [],
            edges: []
        });
    }
}
 */


export default GraphView;