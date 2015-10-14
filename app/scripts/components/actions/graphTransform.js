import Reflux from "reflux";

var autoTransform = Reflux.createAction();
var userTransform = Reflux.createAction();
var zoomFit = Reflux.createAction();

export default {
    autoTransform,
    userTransform,
    zoomFit
}
