import jwt  from 'jsonwebtoken';

// створюємо middleware
export default (req, res, next) => {
    // пишемо, що нам необхідно спарсити токен і розшифрувати в подальшому

    // дістаємо токен з хедеру
    // const token = req.headers.authorization;

    // ми кажемо, якщо прийшов або не прийшов токен, передавай нам у будь-якому випадку стрічку
    // з цієї стрички потрібно за допомогою регулярки видалити слово "Bearer" і замінити його на пусту стрічку
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (token) {
        // якщо токен є, ми маємо його розшифрувати
        try {
            // розшифровуємо за допомгою ф-ї "jwt.verify()", де передаємо сам токен і ключ за яким будемо розшифровувати
            const decode = jwt.verify(token, "secret123");

            // якщо ми змогли розшифрувати токен, у реквест userId передаємо те, що ми змогли розшифрувати
            // ми вшиваємо це в реквест для того, щоб потім дістати де ми захочемо "id" нашого юзера
            req.userId = decode._id;

            // тепер говоримо, що якщо ми розшифрували токен, зберегли його до "req.userId", то
            // потрібно сказати, що все добре, виконуй наступну ф-ю
            next();
        } catch (error) {
            return res.status(403).json({
                message: "No access",
            })
        }

    } else {
        return res.status(403).json({
            message: "No access",
        })
    }
}
