
var Metadata = React.createClass({
    render() {
        var {data, className, ...props} = this.props;

        //className = [className;

        return <div className={className} {...props} dangerouslySetInnerHTML={{__html: data ? data.display() : ""}}></div>;
    }
});

export default Metadata;