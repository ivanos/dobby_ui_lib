var Identifier = React.createClass({
    render() {
        var {identifier, ...props} = this.props;
        return (
            <div {...props}>{identifier.name}</div>
        );
    }
});

export default Identifier;
