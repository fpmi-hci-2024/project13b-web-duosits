const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user-controller");
const PostController = require("../controllers/post-controller");
const FollowController = require("../controllers/follow-controller");
const LikeController = require("../controllers/like-controller");
const CommentController = require("../controllers/comment-controller");
const { authenticateToken } = require("../middleware/auth");
const multer = require('multer');

const uploadDestination = 'uploads';

// Показываем, где хранить загружаемые файлы
const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });
// Роуты User
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Регистрирует нового пользователя
 *     description: Создаёт нового пользователя с указанными данными
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная регистрация
 *       400:
 *         description: Ошибка валидации данных
 *       500:
 *         description: Внутренняя ошибка сервера
 */
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", authenticateToken, UserController.current);
router.get("/users/:id", authenticateToken, UserController.getUserById);
router.put("/users/:id", authenticateToken, upload.single('avatar'), UserController.updateUser);

// Роуты Post
router.post("/posts", authenticateToken, PostController.createPost);
router.get("/posts", authenticateToken, PostController.getAllPosts);
router.get("/posts/:id", authenticateToken, PostController.getPostById);
router.delete("/posts/:id", authenticateToken, PostController.deletePost);

// Роуты подписки
router.post("/follow", authenticateToken, FollowController.followUser);
router.delete("/unfollow/:id",authenticateToken, FollowController.unfollowUser);

// Роуты лайков
router.post("/likes", authenticateToken, LikeController.likePost);
router.delete("/likes/:id", authenticateToken, LikeController.unlikePost);

// Роуты комментариев
router.post("/comments", authenticateToken, CommentController.createComment);
router.delete(
  "/comments/:id",
  authenticateToken,
  CommentController.deleteComment
);

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Тестовый маршрут
 *     description: Просто тестовый маршрут для проверки Swagger.
 *     responses:
 *       200:
 *         description: Успешный ответ
 */
router.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});


module.exports = router;
