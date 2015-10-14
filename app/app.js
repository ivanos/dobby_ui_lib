// Import polyfill
import 'babel-core/polyfill';
import 'reset.css/reset.css';
import './app.css';


import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";


import Welcome from "./scripts/components/Welcome";
import Main from "./scripts/components/Main";
import Identifier from "./scripts/model/Identifier";
import Link from "./scripts/model/Link";
import Header from "./scripts/components/Header";
import appStateStore from "./scripts/components/stores/application";
import {setRootIdentifiers} from "./scripts/components/actions/application";

$(() => {

    $("[welcome]").hide();
    $("[main]").hide();

    var app = new App();
});


class App {
    constructor() {
        this.welcome = new Welcome();
        this.startup();
    }

    startup() {

        ReactDOM.render(<Header />, $('.viewport > .header-container').get(0));

        this.welcome.show();

        var renderMain = (identifiers) => {
            this.welcome.hide(() => {
                $("[main]").show();
                ReactDOM.render(
                    <Main
                        identifiers={identifiers}
                        />,
                    $("[main].container").get(0)
                );
            });
        };

        var renderWelcome = () => {
            Link.clear();
            Identifier.clear();
            $("[main]").hide();
            ReactDOM.render(<div />, $("[main].container").get(0));
            this.welcome.show();
        };

        appStateStore.listen(({rootIdentifiers: identifiers}) => {
            if (identifiers.length > 0) {
                renderMain(identifiers);
            } else {
                renderWelcome();
            }
        });

        $(this.welcome).on("root-identifiers", (event, ...identifiers) => {
            setRootIdentifiers(identifiers);
        });

        //$("[main] .clear-identifier").on("click", () => {
        //
        //});
    }
}

