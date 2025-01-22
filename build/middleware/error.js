"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = error;
function error(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({
        error: err.message,
    });
}
