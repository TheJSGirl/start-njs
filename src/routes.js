const Router = require('koa-router');
const AuthenticationMiddleware = require('./authentication/middlewares');

const router = new Router();
router.use(AuthenticationMiddleware);

const authenticationRoutes = require('./authentication/routes');
const userRoutes = require('./users/routes');

router.use(...[
  '',
  authenticationRoutes.routes(),
  userRoutes.routes(),
]);

module.exports = router;
