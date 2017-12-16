const Router = require('koa-router');
const views = require('./views');

const router = new Router();


router.post('api:signIn', '/signin', views.signIn);
router.post('api:signUp', '/signup', views.signUp);
router.get('api:signOut', '/signout', views.signOut);


module.exports = router;
