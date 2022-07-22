import { body } from "express-validator";

// у нас ця інформація буде перевіряти чи є email,  password, userName & avatar
export const registerValidation = [
  // пояснюємо, якщо в нашому тілі запиту буде 'email', перевірь  будь ласка чи ця властивість є 'email'
  // якщо воно буде не 'email', нас "express-validator" сповістить
  body("email", "Incorrect mail format").isEmail(),
  body("password", "The password must contain at least 5 characters").isLength({ min: 5 }),
  body("fullName", "Enter name").isLength({ min: 3 }),

  // вказуємо, що це поле може бути опціональним, тобто нічого страшного якщо поле буде пустим
  // та якщо воно прийде не пусте, то перевірь будь ласка чи це є лінком
  body("avatarUrl", "Wrong avatar link").optional().isURL(),
];

export const loginValidation = [
  body("email", "Incorrect mail format").isEmail(),
  body("password", "The password must contain at least 5 characters").isLength({ min: 5 }),
]

