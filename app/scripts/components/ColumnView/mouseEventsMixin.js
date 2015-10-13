import React from "react";

var mouseEventsMixin = React.createMixin({

    propTypes: {
        onSelect: React.PropTypes.func,
        onHover: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            onSelect: () => {},
            onHover: () => {}
        }
    },

    getInitialState() {
        return {
            selected: undefined,
            hovered: undefined
        }
    },

    getHovered() {
        return this.state.hovered
    },

    getSelected() {
        return this.state.selected
    },

    getClassName(item) {
        var className = [];

        if (this.getHovered() === item) {
            className.push("hovered");
        }

        if (this.getSelected() === item) {
            className.push("selected");
        }

        return className.join(" ");
    },

    select(item) {
        this.setState({selected: item});
    },

    hover(item) {
        this.setState({hovered: item});
    },

    getMouseHandlers(item, index, items) {
        return {
            onClick: () =>{
                this.setState({selected: item});
                this.props.onSelect(...arguments);
            },
            onMouseEnter: () => {
                this.setState({hovered: item});
                this.props.onHover(...arguments);
            },
            onMouseLeave: () => {
                this.setState({hovered: undefined});
                this.props.onHover(undefined, -1, items);
            }
        }
    }
});

export default mouseEventsMixin;