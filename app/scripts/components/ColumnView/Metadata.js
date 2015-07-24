
var Metadata = React.createClass({
    render() {
        var metadata = this.props.data;
        return metadata ? <span>{metadata.get("type")}</span> : <span>Not Selected</span>;
    }
});

export default Metadata;