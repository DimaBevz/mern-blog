import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { UserController, PostController, CommentController } from "./controllers/index.js"
import { checkAuth, handleValidationErrors } from "./utils/index.js";

import { registerValidation, loginValidation } from "./validators/auth.js";
import { postCreateValidation } from "./validators/post.js";
import { commentCreateValidation } from "./validators/comment.js";

mongoose
  .connect(
    "mongodb+srv://admin:Qwerty123@cluster0.kbiwi.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  // ця ф-я буде пояснювати який шлях юзати в мультері
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  // пояснюємо як буде називатись наш файл
  // беремо назву нашого файлу "file" і ми пояснюємо, що хочемо дістати оригінальну назву файлу
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

// пояснюємо, що в "multer" є отаке сховище
// створюємо спец-ну ф-ю, яка буде нам дозволяти юзати "multer"
const upload = multer({ storage });

app.use(cors());
app.use(express.json());

// пояснюємо нашому додатку, що він повинен перевірити, якщо йому прийде будь-який запит на "uploads"
// тоді з бібліотеки "express" потрібно взяти ф-ю "static" і перевіряти чи є в цій папці те, що ми передаємо
app.use("/uploads", express.static("uploads"));

app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.post("/auth/register", registerValidation, handleValidationErrors, UserController.registration);
app.get("/auth/me", checkAuth, UserController.getMe);

// вказуємо, що коли прийде запит на "upload", то ми перед тим як виконати щось, будемо юзати "middleware" із мультера
// скажемо, що очікуємо файл під назвою "image", тобто ми будемо очікувати властивістть "image" з якоюсь картинкою
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  // якщо ж такий файл прийде, то в цьому випадку скажемо, що все добре
  // тобто ми поверрнемо відповідь, якщо ж завантаження успішне, ми тоді скажемо клієнту "ось тобі лінк на нашу картинку"
  // у буде "req.file" зберігатись інформація про завантажений файл
  res.json({
    url: `uploads/${req.file.originalname}`,
  })
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/tags/:tagName", PostController.getPostsByTag);
// спочатку йде перевірка на авторизацію, далі валідація, далі створення статті
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, handleValidationErrors, PostController.update);

// comments
app.post("/comments", checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);
app.get("/comments/:postId", checkAuth, handleValidationErrors, CommentController.getComments);
app.get("/comments/:postId/last_comments", CommentController.getLastComments);

app.listen(3333, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK ");
});
