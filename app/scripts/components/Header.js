import {Button} from "./Common/Common";
import {setRootIdentifiers} from "./actions/application";
import applicationStore from "./stores/application";
import graphTransformStore from "./stores/graphTransform";
import {zoomFit} from "./actions/graphTransform";
import {setView} from "./actions/mainView";
import mainViewStore, {GRAPH_VIEW, COLUMN_VIEW} from "./stores/mainView";
import {hideLinkColumn, showLinkColumn} from "./actions/panelView";
import panelViewStore from "./stores/panelView";


var Header = React.createClass({
    getInitialState() {
        return {
            appInitialised: false,
            hideZoomButton: !graphTransformStore.getInitialState().isUserTransform,
            currentView: mainViewStore.getInitialState().currentView,
            isLinksVisible: panelViewStore.getInitialState().isLinksVisible
        }
    },

    componentDidMount() {
        this.unApplicationStore = applicationStore.listen(({rootIdentifiers}) => {
            this.setState({appInitialised: rootIdentifiers.length > 0});
        });

        this.unGraphTransformStore = graphTransformStore.listen(({isUserTransform}) => {
            this.setState({hideZoomButton: !isUserTransform})
        });

        this.unMainViewStore = mainViewStore.listen(({currentView}) => {
            this.setState({currentView});
        });

        this.unPanelViewStore = panelViewStore.listen(({isLinksVisible}) => {
            this.setState({isLinksVisible});
        });
    },

    componentWillUnmount() {
        this.unApplicationStore();
        this.unGraphTransformStore();
        this.unMainViewStore();
        this.unPanelViewStore();
    },

    render() {
        if (!this.state.appInitialised) {
            return (
                <div className="header">
                    <h1 className="title">Dobby</h1>
                </div>
            );
        }

        let setViewTitle = {
            [GRAPH_VIEW]: "Panel View",
            [COLUMN_VIEW]: "Graph View"
        }[this.state.currentView] || "";

        let setViewView = this.state.currentView == GRAPH_VIEW ? COLUMN_VIEW : GRAPH_VIEW;

        let toggleLinksTitle = this.state.isLinksVisible ? "Hide Links" : "Show Links";
        let toggleLinksOnClick = this.state.isLinksVisible ? hideLinkColumn : showLinkColumn;

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
                    {(this.state.hideZoomButton || this.state.currentView !== GRAPH_VIEW) ? null : <Button onClick={zoomFit} title="Zoom Fit"></Button>}
                    {(this.state.currentView === COLUMN_VIEW) ? <Button onClick={toggleLinksOnClick} title={toggleLinksTitle} /> : null}
                    <Button onClick={() => setView(setViewView)} title={setViewTitle}></Button>
                </div>
            </div>

        )
    }

});

export default Header;