//import { searchGraph, searchPanel } from "../actions/panelView";

import Reflux from "reflux";
import Identifier from '../../model/Identifier';

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

export const globalStore = Reflux.createStore({
    getInitialState() {
        return {
            nodes: [],
            edges: []
        }
    },

    init() {

        this.state = this.getInitialState();

        this.listenTo(search.completed, this.onSearchCompleted);
        //this.listenTo(searchPanel, this.onSearch.bind(this, GRAPH_SEARCH));
    },

    onSearchCompleted(options, result) {
        this.state = this._onSearchCompleted(result);
        console.log(options);

        storeUpdated(options, this.state, result);
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

        // TODO: hold only ids

        return { nodes: new Set(nodes), edges: new Set(edges) };
    }

});

export const graphStore = Reflux.createStore({
    getInitialState() {
        return {
            nodes: [],
            edges: []
        }
    },

    init() {
        this.listenTo(storeUpdated, this.onStoreUpdated);
    },

    onStoreUpdated(options, state, results) {
        this.trigger(state);
    }
});

export const panelStore = Reflux.createStore({
    getInitialState() {
        return {
            items: []
        }
    },

    init() {
        this.state = this.getInitialState();
        this.listenTo(storeUpdated, this.onStoreSearchUpdated);
    },

    onStoreSearchUpdated(options, state, results = null) {
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


