import Reflux from "reflux";

export const setRootIdentifiers = Reflux.createAction();
export const setPanelViewRoots = Reflux.createAction();

export const setScreen = Reflux.createAction();
export const MAIN_SCREEN = Symbol('MAIN_SCREEN');
export const WELCOME_SCREEN = Symbol('WELCOME_SCREEN');
