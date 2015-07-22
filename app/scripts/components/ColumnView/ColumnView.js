import {ROW_NOT_EXIST} from "./constants";
import Column from "./Column";
import ColumnPairView from "./ColumnPairView";

var BreadCrumbs = React.createClass({
    render() {
        return (
            <div className={"list-view-breadcrumbs"}>
                {this.props.items.map((item, index, items) => {
                    return (
                        <div>
                            <span
                                onClick={() => this.props.onSelect(index)}
                                onMouseOver={() => this.props.onHover(index)}
                                onMouseOut={() => this.props.onHover(ROW_NOT_EXIST)}
                                style={{backgroundColor: this.props.hovered == index ? "red" : null}}
                            >
                                {item.name}
                            </span>
                            {(index !== items.length - 1) ? <Separator /> : null}
                        </div>
                    );
                })}
            </div>
        );
    }
});

var Separator = React.createClass({
    render() {
        return <span>|</span>
    }
});

var ColumnView = React.createClass({

    getInitialState() {
        return {
            items: [],
            hovered: [],
            hoveredBreadcrumb: [ROW_NOT_EXIST],
            selected: []
        }
    },

    getDefaultProps() {
        return {
            onAppend: () => {}
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

    _rootColumnSelect() {
        // TODO: rework component do we could use _handleIdentifierSelect(0,0);
        //this._handleIdentifierSelect(0, 0);
        this.search(this.props.identifier)
            .then((result) => {
                this.setState({
                    items: [result],
                    selected: [],
                    hovered: []
                });
            });
    },

    componentDidMount() {
        this._rootColumnSelect();
    },

    search(identifier) {
        return identifier.search({})
            .then(this._removeIdentifierFromResult(identifier))
            .then(({identifiers, links}) => {return {identifier, identifiers, links}})
            .then(this._sortResults);
    },

    _handleIdentifierSelect(itemIndex, identifierIndex = ROW_NOT_EXIST) {
        var items = this.state.items,
            identifier = items[itemIndex].identifiers[identifierIndex] || items[itemIndex].identifier,
            newItems = items.slice(0, itemIndex + 1),
            selected = this.state.selected.slice(0, itemIndex + 1);

        var selectedIdentifiers = new Set(newItems.map(({identifier}) => identifier));

        if (selectedIdentifiers.has(identifier)) {
            return;
        }

        selected[itemIndex] = identifierIndex;

        this.search(identifier)
            .then((result) => {
                newItems.push(result);
                this.setState({
                    items: newItems,
                    selected
                });

                var $view = $(React.findDOMNode(this.refs.scroll));
                $view.animate({scrollLeft: $view.prop("scrollWidth")}, 500)
            });

    },

    _handleIdentifierHover(itemIndex, identifierIndex) {
        var hovered = this.state.hovered,
            hoveredIdentifier = this.state.items[itemIndex].identifiers[identifierIndex],
            hoveredBreadcrumb = ROW_NOT_EXIST;

            this.state.items.forEach(({identifier}, index) => {
                if (identifier === hoveredIdentifier) {
                    hoveredBreadcrumb = index;
                    return false;
                }
            });

        hovered[itemIndex] = identifierIndex;
        this.setState({
            hovered,
            hoveredBreadcrumb
        });
    },

    _breadcrumbSelect(index) {
        var items = this.state.items.slice(0, index + 1),
            selected = this.state.selected.slice(0, index);

        this.setState({items, selected});
    },

    render() {
        return (
            <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
                <div ref="scroll" className={"column-view-wrapper"}>
                    <div className={"column-view" + (this.state.items.length === 1 ? " last-column" : "")}>
                        <Column
                            ref="rootIdentifier"
                            selected={0}
                            className="column-identifiers root-identifier"
                            items={[this.props.identifier]}
                            onSelect={() => this._rootColumnSelect()}
                            onHover={() => {}}
                            renderItem={(item) => item.name}
                        />
                        {this.state.items.map(({identifier, identifiers, links}, index, items) => {
                            return <ColumnPairView
                                className={index === items.length - 2 ? "last-column" : ""}
                                key={identifier.name + index}
                                identifiers={identifiers}
                                onHover={(identifierIndex) => this._handleIdentifierHover(index, identifierIndex)}
                                selected={this.state.selected[index]}
                                hovered={this.state.hovered[index]}
                                links={links}
                                onSelect={(identifierIndex) =>
                                    this._handleIdentifierSelect(index, identifierIndex)}
                            />
                        })}
                    </div>
                </div>
                <BreadCrumbs
                    items={this.state.items.map(({identifier}) => identifier)}
                    hovered={this.state.hoveredBreadcrumb}
                    onHover={(hoveredBreadcrumb) => {this.setState({hoveredBreadcrumb})}}
                    onSelect={(index) => {this._breadcrumbSelect(index)}}
                />
            </div>
        )
    }
});

export default ColumnView;
