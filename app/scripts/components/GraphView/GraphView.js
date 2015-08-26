import Graph from "../D3Graph";
import Identifier from "../../model/Identifier";
import SearchMenu from "./SearchMenu";
import Tooltip from "./Tooltip";
import Metadata from "../ColumnView/Metadata";


var GraphView = React.createClass({

    getInitialState() {
        return {
            nodes: new Set(this.props.identifiers),
            edges: new Set(),
            searchMenuPosition: null,
            searchIdentifier: null,
            hoveredLink: null,
            hoveredIdentifier: null,
            userTransform: false,
            scale: 1,
            offset: {
                offsetX: 0,
                offsetY: 0
            }
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

        $(".reset-zoom").on("click", this._handleZoomFit.bind(this));
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

        if (this.state.userTransform) {
            $(".reset-zoom").show();
        } else {
            $(".reset-zoom").hide();
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

    _limitScale(scale, max=2, min=0.05) {
        return Math.max(Math.min(scale, max), min);
    },

    _handleZoomFit() {
        var fitTransform = this.state.fitTransform;
        //todo: animate
        this.setState({
            ...fitTransform,
            userTransform: false
        });
    },

    _handleFitTransform(_, scale, offset) {
        var fitTransform = {
            scale: this._limitScale(scale, 1),
            offset
        };

        var state;

        if (!this.state.userTransform) {
            state = {
                fitTransform,
                ...fitTransform
            }
        } else {
            state = {
                fitTransform
            }
        }

        this.setState(state);
    },

    _handleZoom(event) {
        event.preventDefault();

        var {top, left} = React.findDOMNode(this).getBoundingClientRect(),

            mouseY = event.clientY - top,
            mouseX = event.clientX - left,

            deltaScale = event.deltaY * 0.01,

            maxScale = 2,
            oldScale = this.state.scale,
            scale = this._limitScale(oldScale - deltaScale, maxScale),

            {offsetX, offsetY} = this.state.offset,
            distanceX = (mouseX - offsetX),
            distanceY = (mouseY - offsetY);

        this.setState({
            scale,
            offset: {
                offsetX: offsetX + distanceX * (1 - scale / oldScale),
                offsetY: offsetY + distanceY * (1 - scale / oldScale)
            },
            userTransform: true
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

        this.setState({
            offset,
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

        $(".reset-zoom").off("click");
    }

});

export default GraphView;
