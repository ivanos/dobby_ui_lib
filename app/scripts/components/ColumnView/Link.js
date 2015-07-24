
var Link = React.createClass({
    render() {
        var {link, ...props} = this.props;
        return (
            <div {...props}>{link.metadata.get("type")}</div>
        )
    }
});

export default Link;