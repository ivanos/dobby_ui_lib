// Import polyfill
import 'babel-core/polyfill';
import 'reset.css/reset.css';
import './app.scss';


import $ from "jquery";
import React, { Component } from "react";
import ReactDOM from "react-dom";


import Welcome from "./scripts/components/Welcome";
import Main from "./scripts/components/Main";
import Identifier from "./scripts/model/Identifier";
import Link from "./scripts/model/Link";
import Header from "./scripts/components/Header";
import appStateStore from "./scripts/components/stores/application";
import { MAIN_SCREEN } from "./scripts/components/actions/application";


class Application extends Component {
    render() {
        return (
            <div>
                <Header />
                <Main />
                <Welcome />
            </div>
        );
    }
}

$(() => {

    //$("[welcome]").hide();
    //$("[main]").hide();

    var app = new App();
});


class App {
    constructor() {
        this.welcome = new Welcome();
        this.startup();
    }

    startup() {

        ReactDOM.render(<Header />, $('.viewport > .header-container').get(0));
        ReactDOM.render(<Welcome />, $('.container').get(0));


        //this.welcome.show();

        var renderMain = () => {
            ReactDOM.render(<Main />, $(".container").get(0));
        };

        var renderWelcome = () => {
            Link.clear();
            Identifier.clear();
            ReactDOM.render(<Welcome />, $('.container').get(0));
        };

        appStateStore.listen(({screen}) => {
            if (screen === MAIN_SCREEN) {
                renderMain();
            } else {
                renderWelcome();
            }
        });
    }
}

