import React from "react";
import { useParams } from "react-router-dom";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import axios from "../../configure/axios";

export const Index = ({avatarImage}) => {
  const [text, setText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { id } = useParams();

  const onSubmit = async () => {
    const postId = id;
    try {
      setIsLoading(true);
      const fields = {
        text,
        postId
      };

      await axios.post("/comments", fields);
      setText("");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred while create comment");
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={avatarImage}
        />
        <div className={styles.form}>
          <TextField
            label="Enter comment"
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxRows={10}
            multiline
            fullWidth
          />
          <Button variant="contained" disabled={isLoading} onClick={onSubmit}>Send</Button>
        </div>
      </div>
    </>
  );
};
