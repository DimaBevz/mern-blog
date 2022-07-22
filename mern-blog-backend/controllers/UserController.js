import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const login = async (req, res) => {
  try {
    // пояснюємо, що коли ми авторизуємось, то хочемо знайти юзера
    // тобто ми маємо зрозуміти чи є він у БД
    const user = await UserModel.findOne({ email: req.body.email });

    // якщо його не знайдено, то маємо видати статус помилки 404 та текст
    // проте не потрібно вказувати яке з полів не вірне (пояснення в конспекті)
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    // тепер перевіряємо, якщо ж користувач знайшовся в БД, то перевіримо його пароль
    // чи сходиться він
    // перевіряємо чи те, що нам надіслав користувач з тіла запиту і те, що в нас є в БД (у passwordHash) чи сходяться вони
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Not valid login or password",
      });
    }

    // тепер, якщо користувач авторизувався, пароль є коректним, значить він зміг авторизуватись. Формуємо знову токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Authorization failed",
    });
  }
};

export const registration = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        // пишемо _id, бо це синтаксис MongoDB
        _id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );

    // пишемо деструктуризацію, щоб вказати, що нам потрібно повертати в response
    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const getMe = async (req, res) => {
  // перевіряємо чи можемо ми взагалі отримати інф-ю про себе
  // цей запит буде нам говорити чи ми авторизовані, чи ні
  // завдяки йому вже в реактовскому додатку, ми зможемо показати інф-ю на профілі і т.д.
  try {
    // тут пояснюємо, що нам потрібно отримати інформацію про юзера
    // ми можемо зробити дешифровку токена тут
    // маємо взяти токен, який будемо передавати в тілі запиту,
    // дешифрувати його й зрозуміти чи може користувач (який зараз робив запит) отримати інф-ю про себе за цим токеном чи взагалі є там токен,
    // чи має він доступ до цього запиту

    // ф-я "checkAuth" вирішить чи можна вертати якусь секретну інформацію, тобто перевірить чи можемо ми виконати цю ф-ю або ні
    // якщо ми не зможемо її виконати (наприклад токен виявився некоректним або його немає), сповісти нас про це
    // якщо все добре, то виконаємо далі код

    // говоримо, що "UserModel" повинен за допомогою "findById" дістати цього юзера (його id) і знайти в БД такий запис по такому id
    const user = await UserModel.findById(req.userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    console.log(err);
    res.status(403).json({
      message: "No access",
    });
  }
};
