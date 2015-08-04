var Tooltip = React.createClass({
    getInitialState() {
        return {

        }
    },

    _updatePlaceholderSize() {
        var tooltip = React.findDOMNode(this.refs.tooltip),
            placeholder = React.findDOMNode(this.refs.placeholder);

        placeholder.style.width = tooltip.offsetWidth + "px";
        placeholder.style.height = tooltip.offsetHeight + "px";
    },

    componentDidMount() {
        this._updatePlaceholderSize();
    },

    componentDidUpdate() {
        this._updatePlaceholderSize();
    },

    render() {
        var position = {
            [this.state.hovered ? "left" : "right"]: 16
        };
        return (
            <div style={{}}>
                <div
                    ref="tooltip"
                    className="card"
                    style={{opacity: 0.8, position: "absolute", top: 20, maxWidth: 400, ...position}}
                    >
                    <h1>{this.props.title}</h1>
                    <p >{this.props.content}</p>
                </div>
                <div
                    ref="placeholder"
                    onMouseEnter={() => {this.setState({hovered: true})}}
                    onMouseLeave={() => {this.setState({hovered: false})}}
                    style={{position: "absolute", right: 16, top: 20}}
                    ></div>
            </div>
        )
    }
});

export default Tooltip;
