import { Button } from "./Common";
import { setScreen, WELCOME_SCREEN, MAIN_SCREEN } from "./actions/application";
import { setTheme, THEME_DARK, THEME_LIGHT} from "./actions/theme";
import appStateStore from "./stores/application";
import themeStore from "./stores/theme";
import graphTransformStore from "./stores/graphTransform";
import { zoomFit } from "./actions/graphTransform";
import { setView } from "./actions/mainView";
import mainViewStore, { GRAPH_VIEW, COLUMN_VIEW } from "./stores/mainView";
import { hideLinkColumn, showLinkColumn } from "./actions/panelView";
import panelViewStore from "./stores/panelView";

import { hideGraphLinks, showGraphLinks } from "./actions/graphView";
import graphViewStore from "./stores/graphView";

import $ from 'jquery';
import React from "react";

function toggleGraphLinks() {

}

var Header = React.createClass({
    getInitialState() {
        return {
            appInitialised: false,
            ...themeStore.getInitialState(),
            hideZoomButton: !graphTransformStore.getInitialState().isUserTransform,
            currentView: mainViewStore.getInitialState().currentView,
            isLinksVisible: panelViewStore.getInitialState().isLinksVisible,
            isGraphLinksVisible: graphViewStore.getInitialState().isGraphLinksVisible
        }
    },

    componentDidUpdate() {
        $("body")[this.state.theme === THEME_DARK ? "removeClass" : "addClass"]("light");

        // TODO: FIXME
        $("svg")[this.state.isGraphLinksVisible ? "removeClass" : "addClass"]("no-link-caption");
    },

    componentDidMount() {
        this.unApplicationStore = appStateStore.listen(({screen}) => {
            this.setState({appInitialised: screen == MAIN_SCREEN});
        });

        this.unThemeStore = themeStore.listen(state => this.setState(state));

        this.unGraphTransformStore = graphTransformStore.listen(({isUserTransform}) => {
            this.setState({hideZoomButton: !isUserTransform})
        });

        this.unMainViewStore = mainViewStore.listen(({currentView}) => {
            this.setState({currentView});
        });

        this.unPanelViewStore = panelViewStore.listen(({isLinksVisible}) => {
            this.setState({isLinksVisible});
        });

        this.unGraphViewStore = graphViewStore.listen(({isGraphLinksVisible}) => {
            this.setState({isGraphLinksVisible});
        });
    },

    componentWillUnmount() {
        this.unApplicationStore();
        this.unGraphTransformStore();
        this.unMainViewStore();
        this.unPanelViewStore();
        this.unGraphViewStore();
        this.unThemeStore();
    },

    render() {

        let themeTitle = this.state.theme === THEME_DARK ? "LIGHT" : "DARK";
        let nextTheme = this.state.theme === THEME_DARK ? THEME_LIGHT : THEME_DARK;


        let controls = [
            <div>
                <Button title={themeTitle} onClick={() => setTheme(nextTheme)} />
            </div>
        ];

        if (this.state.appInitialised) {
            let setViewTitle = {
                    [GRAPH_VIEW]: "Panel View",
                    [COLUMN_VIEW]: "Graph View"
                }[this.state.currentView] || "";

            let setViewView = this.state.currentView == GRAPH_VIEW ? COLUMN_VIEW : GRAPH_VIEW;

            let toggleLinksTitle = this.state.isLinksVisible ? "Hide Links" : "Show Links";
            let toggleLinksOnClick = this.state.isLinksVisible ? hideLinkColumn : showLinkColumn;

            let toggleGraphLinksTitle = this.state.isGraphLinksVisible ? "Hide Links" : "Show Links";
            let toggleGraphLinksOnClick = this.state.isGraphLinksVisible ? hideGraphLinks : showGraphLinks;

            controls.push(
                <div>
                    <Button
                        onClick={() => setScreen(WELCOME_SCREEN)}
                        title="Clear"
                    />
                </div>,
                <div className="spacer"></div>,
                <div>
                    {(this.state.hideZoomButton || this.state.currentView !== GRAPH_VIEW) ? null : <Button onClick={zoomFit} title="Zoom Fit" />}
                    {this.state.currentView !== GRAPH_VIEW ? null : <Button onClick={ toggleGraphLinksOnClick } title={toggleGraphLinksTitle} />}
                    {(this.state.currentView === COLUMN_VIEW) ? <Button onClick={ toggleLinksOnClick } title={toggleLinksTitle} /> : null}
                    <Button onClick={() => setView(setViewView)} title={setViewTitle} />
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