"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = response;
function response(res, status, data, label) {
    if (status === 404) {
        res.status(404).send({
            error: `${data} not found`
        });
    }
    res.status(status).send({
        [label || 'message']: data
    });
}
//# sourceMappingURL=response.js.map