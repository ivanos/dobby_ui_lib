import {ROW_NOT_EXIST} from "./constants";

var List = React.createClass({

    getInitialState() {
        return {
            scrollTop: 0
        }
    },

    setScrollPosition({scrollTop}) {
        this.setState({
            scrollTop
        });
    },

    shouldComponentUpdate(_, newState) {
        if (this.state.scrollTop !== newState.scrollTop) {
            this.getDOMNode().scrollTop = newState.scrollTop;

            return false;
        }
        return true;
    },

    render() {

        return (
            <div className={"column-list-wrapper"} onScroll={this.props.onScroll}>
                <ul className={"column-list"}>
                    {this.props.items.map((item, index, items) => {
                        var classes = [];

                        if (this.props.hovered === index) {
                            classes.push("hovered");
                        }

                        if (this.props.selected === index) {
                            classes.push("selected");
                        }

                        return <li key={index} className={classes.join(" ")}
                                   onClick={() => this.props.onSelect(index)}
                                   onMouseEnter={() => this.props.onHover(index)}
                                   onMouseLeave={() => this.props.onHover(ROW_NOT_EXIST)}
                            >{this.props.renderItem(item, index, items)}</li>
                    }, this)}
                </ul>
            </div>
        )
    }
});

export default List;