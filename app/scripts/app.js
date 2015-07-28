import Welcome from "./components/Welcome";
import Main from "./components/Main";
import Identifier from "./model/Identifier";
import Link from "./model/Link";

$(() => {

    $("[welcome]").hide();
    //$("[main]").hide();

    var app = new App();
});


class App {
    constructor() {
        this.welcome = new Welcome();
        this.startup();
    }

    startup() {
        this.welcome.show();

        $(this.welcome).on("root-identifier", (event, identifier) => {
            this.welcome.hide(() => {
                React.render(
                    <Main
                        identifier={identifier}
                        />,
                    $("[main].container").get(0)
                );
            });
        });

        $(this.main).on("clear-identifier", () => {
            Link.clear();
            Identifier.clear();
            //this.main.hide(() => {
            //    this.welcome.show();
            //})
        });
    }
}

