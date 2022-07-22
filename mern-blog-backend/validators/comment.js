import { body } from "express-validator";

export const commentCreateValidation = [
  body("text", "Enter the text").isLength({ min: 5 }).isString(),
];


