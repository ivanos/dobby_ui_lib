var Metadata = React.createClass({
    render () {
        return (
            <div className={"column-metadata"}
                 dangerouslySetInnerHTML={{__html: this.props.item ? this.props.item.metadata.display() : "Not selected"}}>
            </div>
        )
    }
});

export default Metadata;