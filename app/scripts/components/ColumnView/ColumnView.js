import LinkIdentifierColumn from "./LinkIdentifierColumn";
import BreadCrumbs from "./BreadCrumbs";
import IdentifierColumn from "./IdentifierColumn";
import panelViewStore from "../stores/panelView";

var ColumnView = React.createClass({

    getInitialState() {
        return {
            items: [],
            isLinksVisible: panelViewStore.getInitialState().isLinksVisible
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
    },

    componentDidMount() {
        this.unPanelViewStore = panelViewStore.listen(({isLinksVisible}) => {
            this.setState({isLinksVisible});
        });
        //this._identifierSelect(this.props.identifier);
        //this.refs.root.select(this.props.identifier);
    },

    componentWillUnmount() {
        this.unPanelViewStore();
    },

    search(identifier) {
        return identifier.search({})
            .then((result) => {
                this.props.onSearchResults(result);
                return result;
            })
            .then(this._removeIdentifierFromResult(identifier))
            .then(({identifiers, links}) => {return {identifier, identifiers, links}})
            .then(this._sortResults)
            .then(this._mapResults);
    },

    _identifierSelect(identifier, index=0) {
        var items = this.state.items.slice(0, index);
        this.props.onIdentifierSelected(identifier);
        this.search(identifier)
            .then((results) => {
                items.push(results);
                this.setState({items});

                var $scroll = $(React.findDOMNode(this.refs.scroll));
                $scroll.animate({scrollLeft: $scroll.prop("scrollWidth")}, 500);
            });
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
