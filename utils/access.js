const Errors = require('njs/lib/errors');

function isUnauthenticated(ctx) {
    return !(ctx.request.authenticated || ctx.request.user);
}

function isAuthenticated(ctx) {
    if (isUnauthenticated(ctx)) {
        throw new Errors.UnauthorizedAccess('Not logged in');
    }

    return true;
}

function isAdmin(ctx) {
    isAuthenticated(ctx);
    const { user } = ctx.request;

    if (!user.admin) {
        throw new Errors.UnauthorizedAccess('Restricted Area');
    }

    return true;
}

module.exports = {
    isAuthenticated,
    isAdmin,
};
