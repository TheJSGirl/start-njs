const Router = require('koa-router');
const studentViews = require('./views/student');
const views = require('./views');

const router = new Router();

router.prefix('/user');

router.get('api:student:list', '/student/', studentViews.list);
router.get('api:user:getProfile', '/my-profile', views.myProfile);
router.get('api:user:getProfile', '/:id', views.get);
router.get('api:student:find', '/student/:id', studentViews.get);

router.post('api:student:create', '/student', studentViews.post);
router.post('api:student:progress', '/student/progress', studentViews.progress);
router.post('api:student:uploadSillyVideo', '/student/silly-video', studentViews.uploadSillyVideo);
router.post('api:user:forgotPassword', '/forgot-password', views.forgotPassword);
router.post('api:user:changePassword', '/change-password', views.changePassword);
router.post('api:user:updatePoints', '/:id?/points', views.points);
router.post('api:user:updateProfile', '/:id?/update-profile', views.updateProfile);
router.post('api:user:follow', '/:id?/follow', views.follow);

router.put('api:student:update', '/student/:id', studentViews.put);

router.del('api:student:remove', '/student/:id', studentViews.del);
router.del('api:user:unfollow', '/:id?/follow', views.unfollow);


module.exports = router;
