import Graph from "../D3Graph";
import Identifier from "../../model/Identifier";
import SearchMenu from "./SearchMenu";
import Tooltip from "./Tooltip";
import Metadata from "../ColumnView/Metadata";


var autoTransform = Reflux.createAction();
var userTransform = Reflux.createAction();
var zoomFit = Reflux.createAction();

var zoomStore = Reflux.createStore({
    init() {
        this.listenTo(autoTransform, this.onAutoTransform);
        this.listenTo(userTransform, this.onUserTransform);
        this.listenTo(zoomFit, this.onZoomFit);
    },

    getInitialState() {
        this.isUserTransform = false;
        return {
            isUserTransform: this.isUserTransform,
            scale: 1,
            offset: {
                offsetX: 0,
                offsetY: 0
            }
        }
    },

    _limitScale(scale, max=2, min=0.05) {
        return Math.max(Math.min(scale, max), min);
    },

    onZoomFit() {
        this.isUserTransform = false;
        this.trigger(this.autoTransform);
    },

    onUserTransform({scale, offset}) {
        this.isUserTransform = true;
        this.trigger({
            isUserTransform: this.isUserTransform,
            scale: this._limitScale(scale, 2),
            offset
        });
    },

    onAutoTransform({scale, offset}) {
        this.autoTransform = {
            isUserTransform: false,
            scale: this._limitScale(scale, 1),
            offset
        };

        if (!this.isUserTransform) {
            this.trigger(this.autoTransform);
        }
    }
});

// ZoomFit button handler
$(() => {
    var $zoomFit = $(".reset-zoom")
        .on("click", zoomFit);

    zoomStore.listen((state) => {
        $zoomFit[state.isUserTransform ? "show" : "hide"]();
    });
});

// GraphView component
var GraphView = React.createClass({

    getInitialState() {
        var zoomStoreState = zoomStore.getInitialState();
        return {
            nodes: new Set(this.props.identifiers),
            edges: new Set(),
            searchMenuPosition: null,
            searchIdentifier: null,
            hoveredLink: null,
            hoveredIdentifier: null,
            ...zoomStoreState
        }
    },

    _addListeners(graph) {
        $(graph).on("doubleClickNode", this._dblClick);
        $(graph).on("contextmenu", this._rightClick);
        $(graph).on("overNode", this._overNode);
        $(graph).on("overEdge", this._overEdge);
        $(graph).on("fitTransform", this._handleFitTransform);
    },

    componentDidMount() {
        var graph = new Graph($(React.findDOMNode(this.refs.graphContainer)));

        this._addListeners(graph);
        this._updateGraph(graph);

        this.graph = graph;

        this.unsubscribe = zoomStore.listen((state) => {
            this.setState(state);
        });
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

    _onSearch(params) {
        this._search(this.state.searchIdentifier, params)
            .then(() => this.setState({
                searchMenuPosition: null,
                searchIdentifier: null
            }))
    },

    _overNode(_, identifier) {
        this.setState({hoveredIdentifier: identifier});
    },

    _overEdge(_, link) {
        this.setState({hoveredLink: link});
    },

    _updateGraph(graph) {
        graph.addNodes(this.state.nodes);
        graph.addEdges(this.state.edges);
    },

    _highlightGraph(graph) {
        var edgesToHighlight = [],
            nodesToHighlight = [],
            mainHighlightNode = null;

        let link = this.state.hoveredLink;
        if (link) {
            nodesToHighlight = [Identifier.get(link.source), Identifier.get(link.target)];
            edgesToHighlight = [link];
        }

        let identifier = this.state.hoveredIdentifier;
        if (identifier) {
            let links = [...this.state.edges].filter((link) => {
                return link.target == identifier || link.source == identifier;
            });

            nodesToHighlight = [...new Set(links.reduce((a, link) => {
                a.push(link.target, link.source);
                return a;
            }, [identifier]))];

            edgesToHighlight = links.map((l) => l.data);
            mainHighlightNode = identifier;
        }

        graph.highlight({nodes: nodesToHighlight, edges: edgesToHighlight, mainNode: mainHighlightNode});

    },

    componentDidUpdate(_, oldState) {
        var graph = this.graph;

        if (this.state.nodes !== oldState.nodes || this.state.edges !== oldState.edges) {
            this._updateGraph(graph);
        }

        if (this.state.hoveredLink !== oldState.hoveredLinks || this.state.hoveredIdentifier !== oldState.hoveredIdentifier) {
            this._highlightGraph(graph);
        }

        if (this.state.scale !== oldState.scale || this.state.offset !== oldState.offset) {
            graph.transform(this.state.scale, this.state.offset);
        }
    },

    _onContainerClick() {
        this.setState({
            hoveredLink: null,
            hoveredIdentifier: null,
            searchMenuPosition: null,
            searchIdentifier: null
        });
    },

    render() {
        var {hoveredIdentifier, hoveredLink} = this.state,
            tooltip = null;

        if (hoveredIdentifier || hoveredLink) {
            let data = hoveredIdentifier || hoveredLink,
                isIdentifier = hoveredIdentifier !== null;

            tooltip = (
                <Tooltip
                    title={isIdentifier ? `Identifier: ${data.name}` : `Link: ${data.source} -> ${data.target}`}
                    content={<Metadata data={data.metadata} />}
                    />);
        }


        return (
            <div
                style={{flex: 1, display: "flex", alignItems: "stretch"}}
            >
                <div
                    onWheel={this._handleZoom}
                    onMouseDown={this._handleMouseDown}
                    onMouseUp={this._handleMouseUp}
                    onMouseMove={this._handleMouseMove}
                    onScroll={(event)=> console.log(event)}
                    style={{flex: 1, display: "flex", alignItems: "stretch"}}
                    ref="graphContainer"
                    onClick={this._onContainerClick}
                />
                <SearchMenu
                    position={this.state.searchMenuPosition}
                    onSubmit={this._onSearch}
                />
                {tooltip}
            </div>
        );
    },

    _handleFitTransform(_, scale, offset) {
        autoTransform({scale, offset});
    },

    _handleZoom(event) {
        event.preventDefault();

        var {top, left} = React.findDOMNode(this).getBoundingClientRect(),

            mouseY = event.clientY - top,
            mouseX = event.clientX - left,

            deltaScale = event.deltaY * 0.01,

            oldScale = this.state.scale,
            scale = oldScale - deltaScale,

            {offsetX, offsetY} = this.state.offset,
            distanceX = (mouseX - offsetX),
            distanceY = (mouseY - offsetY);

        userTransform({
            scale,
            offset: {
                offsetX: offsetX + distanceX * (1 - scale / oldScale),
                offsetY: offsetY + distanceY * (1 - scale / oldScale)
            }
        });
    },

    _handleMouseUp(event) {
        this.setState({
            mousePosition: null
        })
    },

    _handleMouseDown(event) {
        this.setState({
            userTransform: true,
            mousePosition: {
                x: event.clientX,
                y: event.clientY
            }
        })
    },

    _handleMouseMove(event) {
        if (!this.state.mousePosition) { return; }

        var {x: initialX, y: initialY} = this.state.mousePosition,
            {clientX: currentX, clientY: currentY} = event;

        var offset = {
            offsetX: this.state.offset.offsetX - initialX + currentX,
            offsetY: this.state.offset.offsetY - initialY + currentY
        };

        userTransform({
            scale: this.state.scale,
            offset
        });

        this.setState({
            mousePosition: {
                x: currentX,
                y: currentY
            }
        });
    },

    // destructing component
    _removeListeners(graph) {
        $(graph).off("doubleClickNode", this._dblClick);
        $(graph).off("contextmenu", this._rightClick);
        $(graph).off("overNode", this._overNode);
        $(graph).off("overEdge", this._overEdge);
        $(graph).off("fitTransform", this._handleFitTransform);
    },

    componentWillUnmount() {
        var graph = this.graph;

        this._removeListeners(graph);

        this.graph = null;

        // TODO: move this out of here;
        $(".reset-zoom")
            .hide();

        this.unsubscribe();
    }

});

export default GraphView;
