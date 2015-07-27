import Link from "./Link";
import Identifier from "./Identifier";

var LinkIdentifier = React.createClass({
    render() {
        var {link, identifier, className = "", ...props} = this.props;
        className += " link-identifier-container";
        return (
            <div className={className} {...props}>
                <Link className="link-item" link={link}/>
                <Identifier className="identifier-item" identifier={identifier} />
            </div>
        );
    }
});

export default LinkIdentifier;