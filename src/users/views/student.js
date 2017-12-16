const Access = require('../../../utils/access');
const operations = require('../operations/student');

async function get(ctx) {
  const id = ctx.params.id;
  const conditions = {};

  const result = await operations.findById(id, conditions);
  ctx.successJson(result);
}

async function list(ctx) {
  const options = ctx.request.query;

  const query = options.q ? JSON.parse(options.q) : {};
  const sort = options.sort ? options.sort : '';
  const fields = options.fields ? options.fields : '';

  const result = await operations.list(query, sort, fields);
  ctx.successJson(result);
}

async function post(ctx) {
  const data = ctx.request.fields;
  const result = await operations.create(data);
  ctx.successJson(result);
}

async function progress(ctx) {
  Access.isAuthenticated(ctx);
  const user = ctx.request.user;
  const { section } = ctx.request.fields;
  const result = await operations.progress(user, section);
  ctx.successJson(result);
}

async function put(ctx) {
  const id = ctx.params.id;
  const data = ctx.request.fields;

  const result = await operations.update(id, data);
  ctx.successJson(result);
}

async function del(ctx) {
  const id = ctx.params.id;
  const data = ctx.request.fields;
  let result;

  if (data.permanent) {
    result = await operations.remove(id);
  } else {
    result = await operations.markDeleted(id);
  }

  ctx.successJson(result);
}

async function uploadSillyVideo(ctx) {
  Access.isAuthenticated(ctx);
  const user = ctx.request.user;
  const { video } = ctx.request.fields;
  const result = await operations.uploadSillyVideo(user, video);
  ctx.successJson(result);
}

module.exports = {
  post,
  put,
  list,
  del,
  get,
  progress,
  uploadSillyVideo,
};

