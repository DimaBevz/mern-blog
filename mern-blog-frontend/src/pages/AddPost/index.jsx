import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

// ми юзаємо цю бібліотеку для того, щоб додати текстовий редактор до нашого додатку
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

import { selectisAuth } from "../../redux/slices/auth";
import axios from "../../configure/axios";

export const AddPost = () => {
  const isAuth = useSelector(selectisAuth);
  const inputFileRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);

      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (error) {
      console.error(error);
      alert("An error occurred while uploading the file");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const fields = {
        title,
        text,
        imageUrl,
        tags,
      };

      const { data } = isEdditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEdditing ? id : data._id;
      // виходить, якщо це редагування, то коли ми будемо перенаправляти користувача, ми будемо його перенаправляти з того "id", який знаходиться в "url"
      // якщо це не редагування, значить запит повернув нам новий запис, ми з нього дістаємо "id" і перенаправляємо корстувача

      navigate(`/posts/${_id}`);
    } catch (error) {
      console.error(error);
      alert("An error occurred while create post");
    }
  };

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(","));
        })
        .catch((err) => {
          console.warn(err);
          alert("An error occurred while get post");
        });
    }
  }, []);

  // особливість бібліотеки в тому, що ф-ю потрібно обгортати в "useCallback"
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  // особливість бібліотеки в тому, що ф-ю потрібно обгортати в "useMemo" - наші налаштування
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Enter text...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("tokenBlog") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
      >
        Add preview
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
            style={{marginLeft: 10}}
          >
            Delete
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:3333/${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Header post..."
        fullWidth
      />
      <TextField
        name="tags"
        value={tags}
        onChange={(event) => setTags(event.target.value)}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Enter tags separated by commas"
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEdditing ? "Save" : "Post"}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
