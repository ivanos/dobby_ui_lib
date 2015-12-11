// Import polyfill
import 'babel-core/polyfill';
import 'reset.css/reset.css';
import './app.scss';

import React, { Component } from "react";
import ReactDOM from "react-dom";


import Welcome from "./scripts/components/Welcome";
import Main from "./scripts/components/Main";
import Identifier from "./scripts/model/Identifier";
import Link from "./scripts/model/Link";
import Header from "./scripts/components/Header";
import appStateStore from "./scripts/components/stores/application";
import appThemeStore from './scripts/components/stores/theme';
import { THEME_LIGHT } from './scripts/components/actions/theme';
import { MAIN_SCREEN } from "./scripts/components/actions/application";


class Application extends Component {

    state = {
        ...appStateStore.getInitialState(),
        ...appThemeStore.getInitialState()
    };

    componentDidMount() {
        this.unAppStateStore = appStateStore.listen(state => this.setState(state));
        this.unAppThemeStore = appThemeStore.listen(state => this.setState(state));
    }

    componentWillUnmount() {
        this.unAppStateStore();
        this.unAppThemeStore();
    }

    render() {
        let content = this.state.screen === MAIN_SCREEN ?
            <Main /> :
            <Welcome />;

        return (
            <div className={`application ${this.state.theme === THEME_LIGHT ? 'light' : 'dark'}`}>
                <div className="viewport">
                    <div className="header-container"><Header /></div>
                    <div className="container">{ content }</div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Application />, document.getElementById('application'));
