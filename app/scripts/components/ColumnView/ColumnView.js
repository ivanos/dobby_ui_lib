import LinkIdentifierColumn from "./LinkIdentifierColumn";
import BreadCrumbs from "./BreadCrumbs";
import IdentifierColumn from "./IdentifierColumn";

var ColumnView = React.createClass({

    getInitialState() {
        return {
            items: [],
        }
    },

    _sortResults({identifier, identifiers, links}) {
        identifiers = identifiers.sort((i1, i2) => i1.name.localeCompare(i2.name));
        links = links.sort((i1, i2) => {
            var name = identifier.name;
            // TODO: rewrite in elegant and robust way
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
        this._identifierSelect(this.props.identifier);
        this.refs.root.select(this.props.identifier);
    },

    search(identifier) {
        return identifier.search({})
            .then(this._removeIdentifierFromResult(identifier))
            .then(({identifiers, links}) => {return {identifier, identifiers, links}})
            .then(this._sortResults)
            .then(this._mapResults);
    },

    _identifierSelect(identifier, index=0) {
        var items = this.state.items.slice(0, index);
        this.search(identifier)
            .then((results) => {
                items.push(results);
                this.setState({items})
            });
    },

    render() {
        var columns = this.state.items.map((item, index, items) => {
            return (
                <LinkIdentifierColumn
                    className={index === items.length - 2 ? "last-column" : ""}
                    disabledItems={new Set(items.slice(0, index + 1).map(({identifier}) => identifier))}
                    key={item.identifier.name}
                    items={item.neighbours}
                    onSelect={({identifier}) => this._identifierSelect(identifier, index + 1)}
                    onHover={(item={identifier: undefined}) => {this.refs.breadcrumbs.hover(item.identifier)}}
                />
            )
        });

        return (
            <div className="column-list" style={{flex: 1, display: "flex", flexDirection: "column"}}>
                <div style={{flex: 1, display: "flex", flexDirection: "row", overflowX: "auto", overflowY: "hidden"}}>
                    <IdentifierColumn
                        ref="root"
                        className={this.state.items.length === 1 ? " last-column" : ""}
                        items={[this.props.identifier]}
                        onSelect={(identifier) => {this._identifierSelect(identifier)}}
                        onHover={(identifier) => {this.refs.breadcrumbs.hover(identifier)}}
                    />
                    {columns}
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
