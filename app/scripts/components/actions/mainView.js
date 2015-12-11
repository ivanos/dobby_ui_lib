import Reflux from "reflux";

let setView = Reflux.createAction();

export const GRAPH_VIEW = Symbol("graph view");
export const COLUMN_VIEW = Symbol("column view");

export default setView;
