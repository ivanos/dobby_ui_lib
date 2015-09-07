import Welcome from "./components/Welcome";
import Main from "./components/Main";
import Identifier from "./model/Identifier";
import Link from "./model/Link";
import Header from "./components/Header";
import appStateStore from "./components/stores/application";
import {setRootIdentifiers} from "./components/actions/application";

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

        React.render(<Header />, $('.viewport > .header-container').get(0));

        this.welcome.show();

        var renderMain = (identifiers) => {
            this.welcome.hide(() => {
                $("[main]").show();
                React.render(
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
            React.render(<div />, $("[main].container").get(0));
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

