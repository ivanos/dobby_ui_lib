import mouseEventsMixin from "./mouseEventsMixin";
import Metadata from "./Metadata";
import Identifier from "./Identifier";
import List from "./List";

import React from "react";

var IdentifierColumn = React.createClass({

    mixins: [mouseEventsMixin],

    render() {
        let {items, ...props} = this.props;
        return (
            <div {...props}>
                <Metadata className="matadata-identifier" data={(this.getHovered() || this.getSelected() || {}).metadata}/>
                <List
                    items={items}
                    renderItem={(...args) => {
                        var [item] = args;
                        return (
                            <div className={this.getClassName(item)}>
                                <Identifier
                                    className="identifier-item"
                                    identifier={item}
                                    {...this.getMouseHandlers(...args)}
                                />
                            </div>
                        )
                    }}
                    />
            </div>
        );
    }
});

export default IdentifierColumn;