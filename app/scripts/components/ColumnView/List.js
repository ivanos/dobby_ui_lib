
var List = React.createClass({

    propTypes: {
        items: React.PropTypes.array,
        renderItem: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            items: [],
            renderItem: (item, index) => <span key={index}>{item}</span>
        }
    },

    render() {
        return (
            <ul>
                {this.props.items.map((item, index, items) => {
                    return <li key={index}>{this.props.renderItem(item, index, items)}</li>})}
            </ul>
        );
    }
});

export default List;