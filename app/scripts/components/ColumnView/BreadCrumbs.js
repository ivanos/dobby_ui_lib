import mouseEventsMixin from "./mouseEventsMixin";
import List from "./List";
import Identifier from "./Identifier";

import React from "react";

var Separator = React.createClass({
    render() {
        return <span>|</span>
    }
});

// TODO: reqrite with List and identifier
var BreadCrumbs = React.createClass({
    mixins: [mouseEventsMixin],

    render() {
        return (
            <List
                className={"breadcrumbs-list"}
                items={this.props.items}
                renderItem={(...args) => {
                    var [item, index, items] = args;

                    var className = [this.getClassName(item), "breadcrumb"].join(" ");

                    return (
                        <div className="breadcrumb-container">
                            <Identifier identifier={item} className={className} {...this.getMouseHandlers(...args)} />
                        </div>
                    );
                }}
            />
        );
    }
});


export default BreadCrumbs;