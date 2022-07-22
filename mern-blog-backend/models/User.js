// у цьому файлі ми опишемо структуру таблиці нашого списку юзерів 
import mongoose from "mongoose";

// пояснюємо, що необхідно створити схему нашої таблиці 
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,

},
// далі ми вказуємо, що при створенні будь-якої сущності, а в нашому випадку користувача,
// окрім властивостей, що написані вище, має бути ще дата створення та оновлення
// timestamps - ми пояснюємо, що схемі, що вона має припинити дату створення й оновлення цієї сущності 
{
    timestamps: true,
});

// 1 - перше ми передаємо нейм. Вказуємо як потрібно назвати нашу схему
// 2 - передаємо саму схему
export default mongoose.model('User', UserSchema);