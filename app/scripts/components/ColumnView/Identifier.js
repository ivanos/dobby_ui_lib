import React from "react";

var Identifier = React.createClass({
    render() {
        var {identifier, ...props} = this.props;
        return (
            <div {...props} title={"Identifier: " + identifier.name}>{identifier.name}</div>
        );
    }
});

export default Identifier;
