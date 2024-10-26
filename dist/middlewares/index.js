"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sessionIdMiddleware;
async function sessionIdMiddleware(request, reply) {
    const { session_id } = request.cookies;
    if (!session_id)
        return reply.status(401).send();
}
