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
            ...panelStore.getInitialState(),
            isLinksVisible: panelViewStore.getInitialState().isLinksVisible
        }
    },

    componentDidMount() {
        this.unPanelViewStore = panelViewStore.listen(({isLinksVisible}) => {
            this.setState({isLinksVisible});
        });

        this.unPanelStore = panelStore.listen(state => {
            let needsScroll = this.state.items.length !== state.items.length
            this.setState(state);

            if (needsScroll) {
                var $scroll = $(ReactDOM.findDOMNode(this.refs.scroll));
                $scroll.animate({scrollLeft: $scroll.prop("scrollWidth")}, 500);
            }

        });
    },

    componentWillUnmount() {
        this.unPanelViewStore();
        this.unPanelStore();
    },

    _identifierSelect(identifier, index=1) {
        this.props.onIdentifierSelected(identifier);
        identifierSelect(identifier, index);
    },

    render() {
        var columns = this.state.items.map((item, index, items) => {

            if (item.identifier === null) {
                let identifierColumnClassName = ["identifier-column"];
                if (this.state.items.length === 1) {
                    identifierColumnClassName.push("last-column");
                }
                identifierColumnClassName = identifierColumnClassName.join(" ");

                return (
                    <IdentifierColumn
                        ref="root"
                        className={identifierColumnClassName}
                        items={item.neighbours.map(({identifier}) => identifier)}
                        onSelect={(identifier) => {this._identifierSelect(identifier)}}
                        onHover={(identifier) => {this.refs.breadcrumbs.hover(identifier)}}
                    />
                )
            }

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

        return (
            <div className="column-list-component">
                <div ref="scroll" className="columns-scroll">
                    <div className="columns-container">
                        {columns}
                    </div>
                </div>
                <BreadCrumbs
                    ref="breadcrumbs"
                    items={this.state.items.map(({identifier}) => identifier).filter(i => !!i)}
                    onSelect={(identifier, index) => {
                        this._identifierSelect(identifier, index + 1);
                        this.refs.breadcrumbs.select();
                    }}
                />
            </div>
        )
    }
});

export default ColumnView;
