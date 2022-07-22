import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    // пояснюємно, що маємо повернути всі статті
    const posts = await PostModel.find().populate("user").populate("comments");

    // вказуємо, що маємо повернути масив ціх статтей
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve posts",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    // пояснюємо, що маємо дістати "id" статті, бо ми його будемо брати з запиту (динамічний параметр)
    // і для того, щоб його дістати, пишемо "req.params.id"
    const postId = req.params.id;

    // так як нам потрібно повернути одну статтю по "id", у MongoDB (у mongoose) є спеціальний метод "findById()"
    // і ми можемо вик-ти його, проте в нас такий прикол, що коли ми хочемо отримати статтю і хочемо її відкрити,
    // ми маємо збільшити кількість переглядів цієї статті, для цього ми будемо отримувати статтю й оновлювати її кількість переглядів
    PostModel.findOneAndUpdate(
      {
        // знаходимо ми за параметром
        _id: postId,
      },
      {
        // другим параметром ми передаємо до цієї ф-ї, що ми хочемо оновити
        // у MongoDB для того, щоб зробити оновлення якогось параметру, наприклад збільшити або зменшити
        $inc: { viewsCount: 1 },
      },
      {
        // пояснюємо, що ми не просто хочемо отримати статтю й її оновити, а її потрібно оновити й
        // оновлений рез-т повернути. Для цього третім параметром в опції ми передаємо інформацію про, що ми хочемо після оновлення
        // повернути вже оновлений документ
        returnDocument: "after",
      },
      // четвертим параметром ми передаємо ф-ю, яка буде виконуватись і говорити чи була помилка, чи прийшов документ
      // типу в цій спец-й ф-ї пояснюємо, що коли вийде отримання статті й оновлення, що робити далі? Повернути помилку чи документ
      (error, doc) => {
        if (error) {
          console.log(error);
          // пишемо "return", щоб не виконувався нижній код
          return res.status(500).json({
            message: "Failed to retrieve post",
          });
        }

        // перевіряємо чи є взагалі такий документ, можливо він видалився, а ми намагаємось його отримати
        // помилки тоді не буде й повернеться "undefined", тоді перевіряємо
        if (!doc) {
          return res.status(404).json({
            message: "Post not found",
          });
        }

        res.json(doc);
      }
    ).populate("user");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to retrieve post",
    });
  }
};

// тут ми будемо робити створення статті, видалення, редагування, отримання однієї статті та отримання всіх стеттей
export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      // body - те, що нам передає користувач
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),

      //  ми з клієнта не передаємо userId, це неправильно. Ми його записали на бекенді, звідти й беремо
      user: req.userId,
    });

    // тепер, коли документ був підгтовлений, його потрібно створити
    const post = await doc.save();

    // повертаємо відповідь
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create post",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    //  пояснюємо, що "remove" має за допомогою знайти документ і видалити його
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          res.status(500).json({
            message: "Failed to delete posts",
          });
        }

        if (!doc) {
          console.log(error);
          res.status(404).json({
            message: "Post not found",
          });
        }

        // якщо ж стаття видалилась (вона знайшлась і не було помилок), то повертаємо відповідь
        res.json({
          success: true,
          message: "Post has been successfully deleted",
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete posts",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    // для того, щоб оновити одну статтю можемо заюзати метод "updateOne()"
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        // другим параметром ми передаємо те, що хочемо оновити
        // тобто передаємо інформацію, яку ми хочемо оновити в нашій статті
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(","),
        user: req.userId,
      }
    );

    res.json({
      success: true,
      message: "Post has been successfully update",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update post",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    // кажемо, що нам потрібно отримати список 5 статтей
    const posts = await PostModel.find().limit(5).exec();

    // пояснюємо, що потрібно взяти масив статтей і за допомогою мапа ми беремо кожен об'єкт і дістаємо теги
    // зробити "flat()" і взяти 5 тегів
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to retrieve tags",
    });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const tagName = req.params.tagName;
    const posts = await PostModel.find();

    const tags = posts.filter((post) => post.tags.some(t => t === tagName));

    if (!tags) {
      res.status(404).json({
        message: "Not found comments",
      });
    }

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Not found comments",
    });
  }
};