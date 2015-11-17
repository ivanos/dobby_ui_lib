import Reflux from "reflux";

export const THEME_LIGHT = Symbol("THEME_LIGHT");
export const THEME_DARK = Symbol("THEME_DARK");

export const setTheme = Reflux.createAction();
