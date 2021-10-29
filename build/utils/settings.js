"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ElectronStore = require("electron-store");
const settings = new ElectronStore({
    defaults: {
        check: false,
    },
});
exports.default = settings;
//# sourceMappingURL=settings.js.map