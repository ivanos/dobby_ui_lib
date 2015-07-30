
import Identifier from "../model/Identifier";
import Component from "../Component";

class Welcome extends Component {
    constructor() {
        super($("[welcome]"));
    }

    init() {
        super.init();

        this.$error = this.find("[invalid-message]");
        this.$find = this.find("form");

        this.$error.hide();
        this.$find.on("submit", (event) => {

            this.$error.hide();

            var identifierName = this.find("input").val();
            this.findIdentifiers(identifierName.split(" "));
            event.preventDefault();
        });
    }

    findIdentifiers(names) {
        Promise.all(names.map((name) => {
            return Identifier.find(name);
        })).then((identifiers) => {
                $(this).trigger("root-identifiers", identifiers);
            }, (error) => {
                this.$error.show();
                this.$error.text(error);
            });
    }
}

export default Welcome;
