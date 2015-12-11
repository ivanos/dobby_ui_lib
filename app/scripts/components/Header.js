import React from "react";

import { Button, ToggleButton } from "./Common";
import { setScreen, WELCOME_SCREEN, MAIN_SCREEN } from "./actions/application";
import { setTheme, THEME_DARK, THEME_LIGHT} from "./actions/theme";
import graphTransformStore from "./stores/graphTransform";
import { zoomFit } from "./actions/graphTransform";
import setView, { GRAPH_VIEW, COLUMN_VIEW } from "./actions/mainView";
import { hideLinkColumn, showLinkColumn } from "./actions/panelView";
import { hideGraphLinks, showGraphLinks } from "./actions/graphView";
import appStateStore from './stores/application';
import mainViewStore from './stores/mainView';


var Header = React.createClass({
    getInitialState() {
        return {
            appInitialised: false,
            hideZoomButton: !graphTransformStore.getInitialState().isUserTransform,
            currentView: mainViewStore.getInitialState().currentView,
        }
    },

    componentDidMount() {
        this.unApplicationStore = appStateStore.listen(({screen}) => {
            this.setState({appInitialised: screen == MAIN_SCREEN});
        });

        this.unGraphTransformStore = graphTransformStore.listen(({isUserTransform}) => {
            this.setState({hideZoomButton: !isUserTransform})
        });

        this.unMainViewStore = mainViewStore.listen(({currentView}) => {
            this.setState({currentView});
        });
    },

    componentWillUnmount() {
        this.unApplicationStore();
        this.unGraphTransformStore();
        this.unMainViewStore();
    },

    render() {

        let controls = [
            <div key="themeGroup">
                <ToggleButton
                    initialItem={0}
                    values={[{
                        title: "LIGHT",
                        action: () => setTheme(THEME_LIGHT)
                    }, {
                        title: "DARK",
                        action: () => setTheme(THEME_DARK)
                    }]}
                />
            </div>
        ];

        if (this.state.appInitialised) {

            let viewButton = (
                <ToggleButton
                    values={[{
                        title: 'Panel View',
                        action: () => setView(COLUMN_VIEW)
                    }, {
                        title: 'Graph View',
                        action: () => setView(GRAPH_VIEW)
                    }]}
                />
            );

            let panelLinksButton = null;
            if (this.state.currentView === COLUMN_VIEW) {
                panelLinksButton = (
                    <ToggleButton
                        values={[{
                        title: 'Hide Links',
                        action: hideLinkColumn
                    }, {
                        title: 'Show Links',
                        action: showLinkColumn
                    }]}
                    />
                );
            }

            let graphLinksButton = null;
            if (this.state.currentView === GRAPH_VIEW) {
                graphLinksButton = (
                    <ToggleButton
                        values={[{
                        title: 'Hide Links',
                        action: hideGraphLinks
                    }, {
                        title: 'Show Links',
                        action: showGraphLinks
                    }]}
                    />
                );
            }

            let zoomFitButton = null;
            if (!this.state.hideZoomButton && this.state.currentView === GRAPH_VIEW) {
                zoomFitButton = <Button onClick={zoomFit} title="Zoom Fit" />;
            }

            controls.push(
                <div key="clearGroup">
                    <Button
                        onClick={() => setScreen(WELCOME_SCREEN)}
                        title="Clear"
                    />
                </div>,
                <div key="spacer" className="spacer"></div>,
                <div key="actionsGroup">
                    { zoomFitButton }
                    { graphLinksButton }
                    { panelLinksButton }
                    { viewButton }
                </div>
            );
        }

        return (
            <div className="header">
                <h1 className="title">Dobby</h1>
                { controls }
            </div>

        )
    }

});

export default Header;