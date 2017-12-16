function json(ctx, payload) {
    ctx.set('Content-Type', 'application/json');
    ctx.body = payload;
}

function errorJson(ctx, e) {
    const err = {
        code: e.code || 500,
        message: e.message || e.msg,
    };
    ctx.status = parseInt(err.code, 10);
    json(ctx, { success: false, error: err });
}

function successJson(ctx, data, statusCode) {
    ctx.status = parseInt(statusCode, 10) || 200;
    json(ctx, { success: true, data });
}


module.exports = {
    errorJson,
    json,
    successJson,
};
