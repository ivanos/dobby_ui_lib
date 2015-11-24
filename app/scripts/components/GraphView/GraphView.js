import Graph from "../D3Graph";
import Identifier from "../../model/Identifier";
import SearchMenu from "./SearchMenu";
import Tooltip from "./Tooltip";
import Metadata from "../ColumnView/Metadata";
import {
    autoTransform,
    userTransform,
    zoomFit
} from "../actions/graphTransform";

import zoomStore from "../stores/graphTransform";
import searchMenuStore from "../stores/searchMenu";

import {showSearchMenu, hideSearchMenu} from "../actions/searchMenu";
import {setView} from "../actions/mainView";
import {COLUMN_VIEW} from "../stores/mainView";

import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";

import { graphStore, searchGraph } from '../stores/dobbyGraphStore';
import graphViewStore from '../stores/graphView';


var GraphView = React.createClass({

    getInitialState() {
        var zoomStoreState = zoomStore.getInitialState(),
            searchStoreState = searchMenuStore.getInitialState(),
            graphStoreState = graphStore.getInitialState();

        return {

            //searchMenuPosition: null,
            //searchIdentifier: null,

            hoveredLink: null,
            hoveredIdentifier: null,
            ...zoomStoreState,
            ...searchStoreState,
            ...graphStoreState,

            isGraphLinksVisible: graphViewStore.getInitialState().isGraphLinksVisible
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
        var graph = new Graph($(ReactDOM.findDOMNode(this.refs.graphContainer)));

        this._addListeners(graph);
        this._updateGraph(graph);

        this.graph = graph;


        this.unZoomStore = zoomStore.listen((state) => {
            this.setState(state);
        });

        this.unSearchMenuStore = searchMenuStore.listen((state) => {
            this.setState(state);
        });

        this.unGraphStore = graphStore.listen((state) => {
            this.setState(state);
        });

        this.unGraphViewStore = graphViewStore.listen(({ isGraphLinksVisible }) => {
            this.setState({ isGraphLinksVisible })
        });
    },

    _search(identifier, params={}) {
        searchGraph(identifier, params);
    },

    _dblClick(_, identifier) {
        this._search(identifier);
    },

    _rightClick(_, identifier) {
        var {x, y} = window.event;
        showSearchMenu({x, y}, identifier);
    },

    _onSearch(params) {
        this._search(this.state.searchIdentifier, params)
            .then(() => hideSearchMenu())
    },

    _onPanelView() {
        var identifier = this.state.searchIdentifier;
        hideSearchMenu();
        setView(COLUMN_VIEW, [identifier]);
    },

    _overNode(_, identifier) {
        this.setState({hoveredIdentifier: identifier});
    },

    _overEdge(_, link) {
        this.setState({hoveredLink: link});
    },

    _updateGraph(graph) {
        graph.setNodes(this.state.nodes);
        graph.setEdges(this.state.edges);
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

    componentDidUpdate(oldProps, oldState) {
        var graph = this.graph;

        if (this.props.isRunning) {
            if (this.state.nodes !== oldState.nodes ||
                this.state.edges !== oldState.edges) {
                this._updateGraph(graph);
            }

            if (this.state.hoveredLink !== oldState.hoveredLink ||
                this.state.hoveredIdentifier !== oldState.hoveredIdentifier) {
                this._highlightGraph(graph);
            }

            if (!this._compareTransform(oldState, this.state)) {
                graph.transform(this.state.scale, this.state.offset);
            }

            if (oldProps.isRunning !== this.props.isRunning) {
                this._updateGraph(graph);
                this._highlightGraph(graph);
            }
        }
    },

    _compareTransform(oldTransform, newTransform) {
        return oldTransform.scale === newTransform.scale &&
                oldTransform.offset.offsetX === newTransform.offset.offsetX &&
                oldTransform.offset.offsetY === newTransform.offset.offsetY
    },

    hoverIdentifier(identifier) {
        this.setState({
            hoveredIdentifier: identifier,
            hoveredLink: null
        })
    },

    _onContainerClick() {
        hideSearchMenu();
        this.setState({
            hoveredLink: null,
            hoveredIdentifier: null
        });
    },

    render() {
        var {hoveredIdentifier, hoveredLink} = this.state,
            tooltip = null;

        if (hoveredIdentifier || hoveredLink) {
            let data = hoveredIdentifier || hoveredLink,
                isIdentifier = hoveredIdentifier !== null;

            var title = isIdentifier ?
                (<span><span>Identifier: </span><span className="tooltip-title-text">{data.name}</span></span>) :
                (<span><span>Link: </span><span className="tooltip-title-text">{data.source} -> {data.target}</span></span>);

            tooltip = (
                <Tooltip
                    title={title}
                    content={<Metadata data={data.metadata} />}
                    />);
        }


        return (
            <div
                style={{flex: 1, display: "flex", alignItems: "stretch"}}
                className={!this.state.isGraphLinksVisible && "no-link-caption"}
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
                    onPanelView={this._onPanelView}
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

        var {top, left} = ReactDOM.findDOMNode(this).getBoundingClientRect(),

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
            mousePosition: {
                x: currentX,
                y: currentY
            }
        });

        userTransform({
            scale: this.state.scale,
            offset
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

        this.unZoomStore();
        this.unSearchMenuStore();
        this.unGraphStore();

        this.unGraphViewStore();

    }

});

export default GraphView;
