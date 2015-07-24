import mouseEventsMixin from "./mouseEventsMixin";
import Metadata from "./Metadata";
import Identifier from "./Identifier";
import List from "./List";

var IdentifierColumn = React.createClass({

    mixins: [mouseEventsMixin],

    getInitialState() {
        return {
            items: []
        }
    },

    render() {
        let {items, ...props} = this.props;
        return (
            <div {...props}>
                <Metadata item={(this.getHovered() || this.getSelected() || {}).matadata}/>
                <List
                    items={items}
                    renderItem={(...args) => {
                        var [item] = args;
                        return (
                            <Identifier
                                className={this.getClassName(item)}
                                identifier={item}
                                {...this.getMouseHandlers(...args)}
                            />
                        )
                    }}
                    />
            </div>
        );
    }
});

export default IdentifierColumn;