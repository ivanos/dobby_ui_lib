import React from "react";

var Field = React.createClass({
    render() {
        return <input {...this.props} />;
    }
});

export default Field;
