
var Button = React.createClass({
    render() {
        var {title, ...props} = this.props;
        return <input type="button" {...props} value={title} />;
    }
});

export default Button;