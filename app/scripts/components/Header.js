import {Button} from "./Common/Common";
import {setRootIdentifiers} from "./actions/application";
import applicationStore from "./stores/application";
import graphTransformStore from "./stores/graphTransform";
import {zoomFit} from "./actions/graphTransform";


var Header = React.createClass({
    getInitialState() {
        return {
            appInitialised: false,
            hideZoomButton: !graphTransformStore.getInitialState().isUserTransform
        }
    },

    componentDidMount() {
        this.unApplicationStore = applicationStore.listen(({rootIdentifiers}) => {
            this.setState({appInitialised: rootIdentifiers.length > 0});
        });

        this.unGraphTransformStore = graphTransformStore.listen(({isUserTransform}) => {
            this.setState({hideZoomButton: !isUserTransform})
        });
    },

    componentDidUnmount() {
        this.unApplicationStore();
        this.unGraphTransformStore();
    },

    render() {
        if (this.state.appInitialised) {
            return (
                <div className="header">
                    <h1 className="title">Dobby</h1>
                    <div>
                        <Button
                            onClick={() => setRootIdentifiers([])}
                            title="Clear"
                            />
                    </div>
                    <div className="spacer"></div>
                    <div>
                        {this.state.hideZoomButton ? null : <Button onClick={zoomFit} title="Zoom Fit"></Button>}
                        <Button title="Panel View"></Button>
                    </div>
                </div>

            )
        }

        return (
            <div className="header">
                <h1 className="title">Dobby</h1>
            </div>
        );
    }

});

export default Header;