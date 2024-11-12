import Bar from './js/bar.js';
import { reloadStyles } from "./js/css.js";

reloadStyles();

App.config({
    windows: [
        Bar(1),
    ],
});
