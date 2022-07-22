import { body } from "express-validator";

export const postCreateValidation = [
    // пояснюємо, що ми будемо чекати заголовок, текст, теги, картинку
  body("title", "Enter the text name").isLength({ min: 3 }).isString(),
  body("text", "Enter the text").isLength({ min: 13 }).isString(),
  body("tags", "Wrong format tags name (enter array)").optional().isString(),
  body("imageUrl", "Wrong link").optional().isString(),
];

// optional() - опціональний параметр тобто він може бути, а може й ні  

