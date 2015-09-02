import {
    autoTransform,
    userTransform,
    zoomFit
} from "../actions/graphTransform";


var zoomStore = Reflux.createStore({
    init() {
        this.listenTo(autoTransform, this.onAutoTransform);
        this.listenTo(userTransform, this.onUserTransform);
        this.listenTo(zoomFit, this.onZoomFit);
    },

    getInitialState() {
        this.isUserTransform = false;
        return {
            isUserTransform: this.isUserTransform,
            scale: 1,
            offset: {
                offsetX: 0,
                offsetY: 0
            }
        }
    },

    _limitScale(scale, max=2, min=0.05) {
        return Math.max(Math.min(scale, max), min);
    },

    onZoomFit() {
        this.isUserTransform = false;
        this.trigger(this.autoTransform);
    },

    onUserTransform({scale, offset}) {
        this.isUserTransform = true;
        this.trigger({
            isUserTransform: this.isUserTransform,
            scale: this._limitScale(scale, 2),
            offset
        });
    },

    onAutoTransform({scale, offset}) {
        this.autoTransform = {
            isUserTransform: false,
            scale: this._limitScale(scale, 1),
            offset
        };

        if (!this.isUserTransform) {
            this.trigger(this.autoTransform);
        }
    }
});

export default zoomStore;