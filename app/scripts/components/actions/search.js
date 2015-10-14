import Reflux from "reflux";

var searchAction = Reflux.createAction({
    asyncResult: true
});


var searchStore = Reflux.createStore({
    init() {
        this.listenTo(searchAction, this.onSearchAction);
        this.listenTo(searchAction.completed, this.onSearchActionCompleted);
    },

    onSearchAction(identifier, params={}) {
        identifier.search(params)
            .then(searchAction.completed)
            .catch(searchAction.failed)
    },

    onSearchActionCompleted(results) {
        this.trigger(results);
    }

});

export default {searchAction, searchStore};

