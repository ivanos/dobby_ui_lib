import Graph from "../D3Graph";
import Identifier from "../../model/Identifier";


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

        console.log(arguments);
    },

    _overEdge(_, link) {

        console.log(arguments);
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

    render() {
        return (
            <div
                style={{flex: 1, display: "flex", alignItems: "stretch"}}
            >
                <div
                    style={{flex: 1, display: "flex", alignItems: "stretch"}}
                    ref="graphContainer"
                    onClick={() => this._resetSearch()}
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

/**
 * kvValue = {String: [String]}
 * this.state.max_depth = Number
 * this.state.results_filter = [String]
 * this.state.match_links = [{key: [values]}, ]
 * this.state.match_metadata = [{key: [values]}, ]
 * this.state.match_terminal = [{key: [values]}, ]
 */

const fieldPairs = [{
    name: "Match Identifiers Metadata",
    paramsKey: "match_metadata"
}, {
    paramsKey: "match_links",
    name: "Match Links Metadata"
}, {
    paramsKey: "match_terminal",
    name: "Match Identifiers Metadata"
}];


var SearchMenu = React.createClass({

    getInitialState() {
        return {
            params: {
                max_depth: 1,
                results_filter: [],
                match_metadata: [],
                match_links: [],
                match_terminal: []
            }
        }
    },

    paramsChanged(paramsKey, value) {
        var params = this.state.params;

        params[paramsKey] = value;

        this.setState({params});
    },

    _addField(key) {
        var params = this.state.params;

        params[key].push({key: "", value: []});

        this.setState({params})
    },

    _removeField(key, index) {
        var fields = this.state.params[key];
        fields.splice(index, 1);
        this.setState({fields});
    },

    _normaliseValues(params) {
        var {max_depth, results_filter, ...toNormalise} = params;

        Object.keys(toNormalise).map((key) => {
            toNormalise[key] = toNormalise[key].reduce((obj, val) => {
                obj[val.key] = val.value;
            }, {});
        });

        return {max_depth, results_filter, ...toNormalise};
    },

    _onSubmit(event) {
        event.preventDefault();
        console.log(this.state.params);
        this.props.onSubmit(this._normaliseValues(this.state.params));
    },

    render() {
        var {x: left=50000, y: top=50000} = this.props.position || {};

        var fields = fieldPairs.map(({paramsKey, name}) => {
            return (
                <AddableFieldPair
                    fields={this.state.params[paramsKey]}
                    addField={() => this._addField(paramsKey)}
                    removeField={(index) => this._removeField(paramsKey, index)}
                    onChange={(fields) => this.paramsChanged(paramsKey, fields)}
                    name={name}
                />
            )
        });

        return (
            <div className="card menu" style={{position: "fixed", top, left}}>
                <form onSubmit={this._onSubmit} onChange={(fields) => console.log(fields)}>
                    <div>Search for Identifiers</div>
                    <div>
                        <p>
                            <span>Max Depth </span>
                            <Field
                                type="number"
                                onChange={({target: {value}}) => this.paramsChanged("max_depth", parseInt(value, 10))}
                                value={this.state.params.max_depth}
                            />
                        </p>
                    </div>
                    <div>
                        <p>
                            <span>Filter Metadata</span>
                            <Field
                                onChange={({target: {value}}) => this.paramsChanged("results_filter", value.split(" "))}
                                value={this.state.params.results_filter.join(" ")}
                            />
                        </p>
                    </div>
                    {fields}
                    <Button type="submit" onClick={this._onSubmit} title="Search" />
                </form>
            </div>
        )
    }
});

var AddableFieldPair = React.createClass({

    _addField() {
        this.props.addField();
    },

    _removeField(index) {
        this.props.removeField(index);
    },

    _keyChanged(index, key) {
        var fields = this.props.fields,
            {value} = fields[index];

        fields[index] = {key, value};
        this.props.onChange(fields);
    },

    _valueChanged(index, value) {
        var fields = this.props.fields,
            {key} = fields[index];

        fields[index] = {key, value:value.split(" ")};
        this.props.onChange(fields);
    },

    render() {
        var fields = this.props.fields.map((field, index) => {
            var {key, value} = field;

            return (
                    <div key={index}>
                        <Field onChange={({target: {value}}) => this._keyChanged(index, value)} value={key} />
                        <Field onChange={({target: {value}}) => this._valueChanged(index, value)} value={value.join(" ")} />
                        <Button onClick={() => this._removeField(index)} title="-" />
                    </div>
                )
        });
        return (
            <div>
                <div>
                    <p>
                        <span>{this.props.name}</span>
                        <Button onClick={this._addField} title="+" />
                    </p>
                </div>
                <div>
                    {fields}
                </div>
            </div>
        )
    }
});

var Field = React.createClass({
    render() {
        return <input {...this.props} />;
    }
});

var Button = React.createClass({
    render() {
        var {title, ...props} = this.props;
        return <input type="button" {...props} value={title} />;
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