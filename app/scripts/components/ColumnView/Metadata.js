import React from "react";

var Metadata = React.createClass({

    render() {
        var {data, className, ...props} = this.props;

        var metadataItems = (data ? data.entries().map(([__key, value]) => {
                return {
                    __key,
                    ...value
                };
            }) : []).map((metadataItem) => {
                return (<MetadataItem item={metadataItem}/>)
            });


        return (
            <div className={className} {...props}>
                {metadataItems}
            </div>);
    }
});

var MetadataItem = React.createClass({

    getInitialState() {
        return {
            left: -5000,
            top: -5000
        }
    },

    render() {
        var {item, ...props} = this.props;

        return (
            <div {...props}>
                <div
                    onMouseMove={this.onMouseOver}
                    onMouseLeave={() => this.setState(this.getInitialState())}
                >
                    <span>{item.__key}: </span>
                    <pre className="matadata-value">{JSON.stringify(item.value, null, 2)}</pre>
                </div>
                <div
                    className="card"
                    style={{opacity: 1, position: "fixed", top: this.state.top, left: this.state.left}}
                >
                    <div><span>Publisher: </span><span>{item.publisher_id}</span></div>
                    <div><span>Timestamp: </span><span>{item.timestamp}</span></div>
                </div>
            </div>
        )
    },

    onMouseOver({clientX, clientY}) {
        var left = clientX - 20,
            top = clientY + 20;

        this.setState({left, top})
    }

});


export default Metadata;