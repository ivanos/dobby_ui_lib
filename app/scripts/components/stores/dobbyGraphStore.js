//import { searchGraph, searchPanel } from "../actions/panelView";

import Reflux from "reflux";
import Identifier from '../../model/Identifier';

import { setRootIdentifiers, setPanelViewRoots } from '../actions/application';

import Monitor, { DELETE_EVENT, CHANGE_EVENT } from '../../model/Monitor';


export const PANEL_SEARCH = Symbol("PANEL_SEARCH");
export const GRAPH_SEARCH = Symbol("GRAPH_SEARCH");
export const DEFAULT_SEARCH = Symbol("DEFAULT_SEARCH");

var search = Reflux.createAction({
    asyncResult: true
});

export const searchGraph = function(identifier, params) {
    search(identifier, params, {context: GRAPH_SEARCH});
};

export const identifierSelect = function(identifier, columnIndex, params = {}) {
    search(identifier, params, {columnIndex, context: PANEL_SEARCH});
};

search.listen((identifier, params, options) => {
    identifier.search(params)
        .then(search.completed.bind(null, {identifier, params, ...options}))
        .catch(search.failed)
});

var storeUpdated = Reflux.createAction();

var storeDataUpdated = Reflux.createAction();

let updateMetadata = Reflux.createAction();

// TODO: This is for demo only
window.updateMetadata = updateMetadata;

export const globalStore = Reflux.createStore({
    getInitialState() {
        return {
            nodes: new Set(),
            edges: new Set()
        }
    },

    init() {
        this.state = this.getInitialState();
        this.listenTo(search.completed, this.onSearchCompleted);
        this.listenTo(updateMetadata, this.onMetadataUpdate);
        this.listenTo(setRootIdentifiers, this.setRootIdentifiers);

        this.monitor = new Monitor();
    },

    setRootIdentifiers(identifiers) {
        this.state = { nodes: new Set(identifiers), edges: new Set() };
        this._startMonitoring(identifiers);
        storeUpdated(this.state, {context: DEFAULT_SEARCH}, null);
    },

    onMetadataUpdate(identifier, metadata) {
        identifier.metadata = metadata;
        storeDataUpdated(this.state);
    },

    onSearchCompleted(options, result) {
        this.state = this._onSearchCompleted(result);
        storeUpdated(this.state, options, result);
    },

    onIdentifierDelete(identifier) {
        let nodes = this.state.nodes;
        let edges = this.state.edges;

        nodes.delete(identifier);
        edges = [...edges].filter((edge) => {
            return edge.source !== identifier && edge.target !== identifier
        });

        this.state = {
            edges: new Set(edges),
            nodes
        };

        identifier.name = "IDENTIFIER WAS DELETED";

        storeDataUpdated(this.state);

        this._stopMonitoring([identifier]);
    },

    _stopMonitoring(identifiers) {
        console.warn("not implemented");
    },

    _startMonitoring(identifiers) {
        this.monitor.listen(identifiers.map(i => i.name), (event, i) => {
            let identifier = Identifier.get(i.identifier);
            identifier.metadata = i.metadata;

            switch (event) {
                case CHANGE_EVENT:
                    this.onMetadataUpdate(identifier, i.metadata);
                    break;
                case DELETE_EVENT:
                    this.onIdentifierDelete(identifier);
                    break;
                default:
                    console.warn("Undefined monitor event");
            }
        });
    },

    _onSearchCompleted({ identifiers, links }) {
        var { nodes, edges } = this.state;
        nodes = [...nodes];
        edges = [...edges];

        links = links.map((l) => {
            return {
                target: Identifier.get(l.target),
                source: Identifier.get(l.source),
                data: l
            }
        });

        nodes.push(...identifiers);
        edges.push(...links);

        this._startMonitoring(identifiers);

        return { nodes: new Set(nodes), edges: new Set(edges) };
    }

});

export const graphStore = Reflux.createStore({
    getInitialState() {
        return globalStore.state;
        //return {
        //    nodes: [],
        //    edges: []
        //}
    },

    init() {
        this.listenTo(storeUpdated, this.onStoreUpdated);
        this.listenTo(storeDataUpdated, this.onStoreUpdated);
    },

    onStoreUpdated(state, options, results) {
        //console.log(state);
        this.trigger(state);
    }
});

export const panelStore = Reflux.createStore({
    state: {
        items: []
    },

    getInitialState() {
        return this.state;
    },

    init() {
        this.state = this.getInitialState();
        this.listenTo(storeUpdated, this.onStoreSearchUpdated);
        this.listenTo(setPanelViewRoots, this.onSetPanelViewRoots);
        this.listenTo(setRootIdentifiers, this.onSetPanelViewRoots);
        this.listenTo(storeDataUpdated, this.onStoreDataUpdated);

    },

    onStoreDataUpdated(state) {
        let index = this.state.items
            .findIndex(({identifier}) => !!identifier && !state.nodes.has(identifier));
        let items = this.state.items.slice(0, index < 0 ? this.state.items.length : index)
            .map(({identifier, neighbours}) => {
                let newNeighbours = neighbours.filter(({identifier, link}) => state.nodes.has(identifier));
                return {
                    identifier,
                    neighbours: newNeighbours
                }
            });

        this.state = {
            items
        };

        this.trigger(this.state);
    },

    onSetPanelViewRoots(identifiers) {
        this.state = {
            items: [{
                identifier: null,
                neighbours: identifiers.map(identifier => ({identifier}))
            }]
        };
        this.trigger(this.state)
    },

    onStoreSearchUpdated(state, options, results = null) {
        if (options.context === PANEL_SEARCH) {
            let items = this.state.items.slice(0, options.columnIndex);
            Promise.resolve(results)
                .then(this._removeIdentifierFromResult(options.identifier))
                .then(({identifiers, links}) => {return {identifier: options.identifier, identifiers, links}})
                .then(this._sortResults)
                .then(this._mapResults)
                .then(results => {
                    items.push(results);
                    this.state = { items };
                    this.trigger(this.state);
                });
        }
    },

    _sortResults({identifier, identifiers, links}) {
        identifiers = identifiers.sort((i1, i2) => i1.name.localeCompare(i2.name));
        links = links.sort((i1, i2) => {
            var name = identifier.name;
            // TODO: rewrite in elegant and robust way
            // sorting links by identifiers name
            if (name === i1.target && name === i2.target) {
                return i1.source.localeCompare(i2.source);
            } else if (name === i1.source && name === i2.source) {
                return i1.target.localeCompare(i2.target);
            } else if (name === i1.source && name === i2.target) {
                return i1.target.localeCompare(i2.source);
            } else if (name === i1.target && name === i2.source) {
                return i1.source.localeCompare(i2.target);
            }

        });

        return {identifier, identifiers, links}
    },

    _removeIdentifierFromResult(identifier) {
        return ({identifiers, links}) => {
            var identifiersSet = new Set(identifiers);
            identifiersSet.delete(identifier);
            return {identifiers: Array.from(identifiersSet), links}
        }
    },

    _mapResults({identifier, identifiers, links}) {
        var neighbours = identifiers.map((identifier, index) => {
            return {identifier, link: links[index]}
        });

        return {identifier, neighbours};
    }
});
