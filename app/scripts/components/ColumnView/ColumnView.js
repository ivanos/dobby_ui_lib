import LinkIdentifierColumn from "./LinkIdentifierColumn";
import BreadCrumbs from "./BreadCrumbs";
import IdentifierColumn from "./IdentifierColumn";
import panelViewStore from "../stores/panelView";

import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";

import { identifierSelect, panelStore } from '../stores/dobbyGraphStore';

var ColumnView = React.createClass({

    getInitialState() {
        return {
            items: [],
            isLinksVisible: panelViewStore.getInitialState().isLinksVisible
        }
    },

    componentDidMount() {
        this.unPanelViewStore = panelViewStore.listen(({isLinksVisible}) => {
            this.setState({isLinksVisible});
        });

        this.unPanelStore = panelStore.listen(state => {
            this.setState(state);

            var $scroll = $(ReactDOM.findDOMNode(this.refs.scroll));
            $scroll.animate({scrollLeft: $scroll.prop("scrollWidth")}, 500);

        });
    },

    componentWillUnmount() {
        this.unPanelViewStore();
        this.unPanelStore();
    },

    _identifierSelect(identifier, index=0) {
        this.props.onIdentifierSelected(identifier);
        identifierSelect(identifier, index);
    },

    render() {
        var columns = this.state.items.map((item, index, items) => {
            let columnClassName = index === items.length - 2 ? ["last-column"] : [];

            if (this.state.isLinksVisible) {
                columnClassName.push("link-identifier-column");
            } else {
                columnClassName.push("identifier-column");
                columnClassName.push("no-link");
            }

            columnClassName = columnClassName.join(" ");

            return (
                <LinkIdentifierColumn
                    className={columnClassName}
                    disabledItems={new Set(items.slice(0, index + 1).map(({identifier}) => identifier))}
                    key={item.identifier.name}
                    items={item.neighbours}
                    onSelect={({identifier}) => this._identifierSelect(identifier, index + 1)}
                    onHover={(item={identifier: undefined}) => {this.refs.breadcrumbs.hover(item.identifier)}}
                    />
            )


        });

        var identifierColumnClassName = ["identifier-column"];
        if (this.state.items.length === 1) {
            identifierColumnClassName.push("last-column");
        }
        identifierColumnClassName = identifierColumnClassName.join(" ");

        return (
            <div className="column-list-component">
                <div ref="scroll" className="columns-scroll">
                    <div className="columns-container">
                        <IdentifierColumn
                            ref="root"
                            className={identifierColumnClassName}
                            items={this.props.identifiers}
                            onSelect={(identifier) => {this._identifierSelect(identifier)}}
                            onHover={(identifier) => {this.refs.breadcrumbs.hover(identifier)}}
                        />
                        {columns}
                    </div>
                </div>
                <BreadCrumbs
                    ref="breadcrumbs"
                    items={this.state.items.map(({identifier}) => identifier)}
                    onSelect={(identifier, index) => {
                        this._identifierSelect(identifier, index);
                        this.refs.breadcrumbs.select();
                    }}
                />
            </div>
        )
    }
});

export default ColumnView;
