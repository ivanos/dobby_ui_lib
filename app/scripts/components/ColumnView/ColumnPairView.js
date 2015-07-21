import {ROW_NOT_EXIST} from "./constants";
import Column from "./Column";

var ColumnPairView = React.createClass({

    getDefaultProps() {
        return {
            selected: ROW_NOT_EXIST,
            hovered: ROW_NOT_EXIST,
            links: [],
            identifiers: []
        }
    },

    _onScroll(event) {
        var scrollTop = event.target.scrollTop;
        this.refs.identifiers.setScrollPosition({scrollTop});
        this.refs.links.setScrollPosition({scrollTop});
    },

    render() {
        return (
            <div className={this.props.className} style={{display: "flex"}}>
                <Column
                    ref="links"
                    onScroll={(e) => this._onScroll(e)}
                    items={this.props.links}
                    selected={this.props.selected}
                    hovered={this.props.hovered}
                    onSelect={this.props.onSelect}
                    onHover={this.props.onHover}
                    renderItem={(item) => item.metadata.get("type")}
                    />
                <Column
                    ref="identifiers"
                    className="column-identifiers"
                    onScroll={(e) => this._onScroll(e)}
                    items={this.props.identifiers}
                    selected={this.props.selected}
                    hovered={this.props.hovered}
                    onSelect={this.props.onSelect}
                    onHover={this.props.onHover}
                    renderItem={(item) => item.name}
                    />
            </div>
        )
    }
});

export default ColumnPairView;
