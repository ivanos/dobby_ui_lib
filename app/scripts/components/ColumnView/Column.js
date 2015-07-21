import {ROW_NOT_EXIST} from "./constants";
import List from "./List";
import Metadata from "./Metadata";

var Column = React.createClass({

    getDefaultProps() {
        return {
            items: [],
            renderItem: (item) => item,
            hovered: ROW_NOT_EXIST,
            selected: ROW_NOT_EXIST
        }
    },

    setScrollPosition({scrollTop}) {
        this.refs.list.setScrollPosition({scrollTop});
    },

    _getMetadataIndex() {
        return this.props.hovered !== ROW_NOT_EXIST ? this.props.hovered : this.props.selected;
    },

    render() {
        return (
            <div className={["column-wrapper", this.props.className].join(" ")}>
                <Metadata
                    item={this.props.items[this._getMetadataIndex()]}
                    />
                <List
                    ref="list"
                    onScroll={this.props.onScroll}
                    items={this.props.items}
                    selected={this.props.selected}
                    hovered={this.props.hovered}
                    onHover={this.props.onHover}
                    onSelect={this.props.onSelect}
                    renderItem={this.props.renderItem}
                    />
            </div>
        )
    }
});

export default Column;