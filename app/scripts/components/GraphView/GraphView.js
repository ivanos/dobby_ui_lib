import Graph from "../D3Graph";
import Identifier from "../../model/Identifier";


var GraphView = React.createClass({

    getInitialState() {
        return {
            nodes: new Set([this.props.identifier]),
            edges: new Set()
        }
    },

    _addListeners(graph) {
        $(graph).on("doubleClickNode", this._dblClick);
        $(graph).on("contextmenu", this._rightClick);
    },

    componentDidMount() {
        var graph = new Graph($(React.findDOMNode(this)));

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

    _searchParams() {
        return new Promise((resolve, reject) => {
            resolve({});
        });
    },

    _rightClick(_, identifier) {
        // setContextState here?

        this._searchParams()
            .then(params => this._search(identifier, params));
    },

    _updateGraph(graph) {
        graph.addNodes(this.state.nodes);
        graph.addEdges(this.state.edges);
    },

    componentDidUpdate() {
        var graph = this.graph;
        this._updateGraph(graph);
    },

    render() {
        return (<div style={{flex: 1, display: "flex", alignItems: "stretch"}}></div>);
    },

    // destructing component
    _removeListeners(graph) {
        $(graph).off("doubleClickNode", this._dblClick);
        $(graph).off("contextmenu", this._rightClick);
    },

    componentDidUnmount() {
        var graph = this.graph;

        this._removeListeners(graph);

        this.graph = null;
    }

});

class GraphView1 extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {
                nodes: [],
                links: []
            }
        };
    }

    componentDidMount() {
        this.initGraph(this.props.identifier);
    }

    initGraph(identifier) {
        this.graph = new Graph($(React.findDOMNode(this)));
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

    hideTooltip() {
        //this.tooltip.hide();
    }

    showTooltip(isIdentifier, data) {
        //this.tooltip.show({
        //    title: isIdentifier ? `Identifier: ${data.name}` : `Link: ${data.source} -> ${data.target}`,
        //    content: data.metadata.display()
        //});
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

        //var position = {
        //    x: window.event.x,
        //    y: window.event.y
        //};
        //
        //this.searchComponent.setIdentifier(identifier);
        //this.menu.showAt(position);
    }

    hideContext() {
        //this.menu.hide();
        //this.graph.highlight({
        //    nodes: [],
        //    edges: []
        //});
    }



    render() {
        return (
            <div style={{flex: 1, display: "flex", alignItems: "stretch"}}></div>
        )
    }
}

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