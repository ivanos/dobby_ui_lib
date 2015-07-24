import mouseEventsMixin from "./mouseEventsMixin";

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
            <div className={"list-view-breadcrumbs"}>
                {this.props.items.map((...args) => {
                    var [item, index, items] = args;
                    return (
                        <div key={index}>
                            <div className={this.getClassName(item)} {...this.getMouseHandlers(...args)}>{item.name}</div>
                            {(index !== items.length - 1) ? <Separator /> : null}
                        </div>
                    );
                })}
            </div>
        );
    }
});


export default BreadCrumbs;