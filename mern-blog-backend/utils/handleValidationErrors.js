import { validationResult } from 'express-validator';

export default (req, res, next) => {
    // тут пояснюємо, що якщо виникла валідаційна помилка, далі запит виконуватись не буде
    // говоримо,якщо валідація успішно не пройдена, поверни нам помилку або список помилок  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    // якщо ж помилок немає, іти далі
    // тобто іди до іншої ф-ї та виконай іншу частину коду
    next()
}