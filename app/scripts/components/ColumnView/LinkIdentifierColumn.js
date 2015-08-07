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
                <div className="link-identifier-matadata-wrapper">
                    <Metadata className="matadata-link" data={link ? link.metadata : null} />
                    <Metadata className="matadata-identifier" data={identifier ? identifier.metadata : null} />
                </div>
                <div className={"link-identifier-list-wrapper"}>
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
            </div>
        );
    }
});


export default LinkIdentifierColumn;