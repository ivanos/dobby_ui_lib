import Link from "./Link";
import Identifier from "./Identifier";

var LinkIdentifier = React.createClass({
    render() {
        var {link, identifier, ...props} = this.props;
        return (
            <div {...props}>
                <Link link={link}/>
                <Identifier identifier={identifier} />
            </div>
        );
    }
});

export default LinkIdentifier;