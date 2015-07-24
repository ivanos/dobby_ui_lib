import mouseEventsMixin from "./mouseEventsMixin";
import Metadata from "./Metadata";
import LinkIdentifier from "./LinkIdentifier";
import List from "./List";

var LinkIdentifierColumn = React.createClass({
    mixins: [mouseEventsMixin],

    getInitialState() {
        return {
            items: []
        };
    },

    render() {
        var {identifier, link} = this.getHovered() || this.getSelected() || {},
            {items, ...props} = this.props;

        return (
            <div {...props}>
                <div>
                    <Metadata data={link ? link.metadata : null} />
                    <Metadata data={identifier ? identifier.metadata : null} />
                </div>
                <List
                    items={items}
                    renderItem={(...args) => {
                        var [item] = args,
                            className = this.getClassName(item);

                        if (this.props.disabledItems.has(item.identifier)) {
                            className += " disabled";
                        }

                        return (
                            <LinkIdentifier
                                className={className}
                                link={item.link}
                                identifier={item.identifier}
                                {...this.getMouseHandlers(...args)}
                            />
                        );
                    }}
                    />
            </div>
        );
    }
});


export default LinkIdentifierColumn;