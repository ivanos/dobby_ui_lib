import React, { Component } from "react";

import Button from './Button';

//values = [{
//    title: 'Light',
//    action: () => ()
//}]
//
class ToggleButton extends Component {

    state = {
        item: this.props.initialItem || 0
    };

    render() {
        let {values, ...props} = this.props;
        let {title, action} = values[this.state.item];

        return <Button onClick={() => this._onClick(action)} {...props} title={title} />;
    }

    _onClick(action) {
        action();
        let item = this.state.item + 1;
        if (item === this.props.values.length) {
            item = 0;
        }
        this.setState({ item });
    }
}

export default ToggleButton;