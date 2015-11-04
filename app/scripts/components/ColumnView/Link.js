import React from "react";

var Link = React.createClass({
    render() {
        let {link, ...props} = this.props;
        let type = link.metadata['type'] ? link.metadata['type'].value : "undefined";
        return (
            <div {...props}>{type}</div>
        )
    }
});

export default Link;