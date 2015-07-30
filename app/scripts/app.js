import Welcome from "./components/Welcome";
import Main from "./components/Main";
import Identifier from "./model/Identifier";
import Link from "./model/Link";

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
        this.welcome.show();

        $(this.welcome).on("root-identifiers", (event, ...identifiers) => {
            this.welcome.hide(() => {
                $("[main]").show();
                React.render(
                    <Main
                        identifiers={identifiers}
                        />,
                    $("[main].container").get(0)
                );
            });
        });

        $("[main] .clear-identifier").on("click", () => {
            Link.clear();
            Identifier.clear();
            $("[main]").hide();
            //React.render(<div />, $("[main].container").get(0));
            //this.main.hide(() => {
                this.welcome.show();
            //})
        });
    }
}

