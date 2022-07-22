import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../configure/axios";
import moment from "moment";
import { fetchComments } from "../redux/slices/posts";

export const FullPost = () => {
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.posts);
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to retrieve post");
      });

      dispatch(fetchComments(id));
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:3333/${data.imageUrl}` : ""}
        user={data.user}
        createdAt={moment(data.createdAt).format("MMM Do YY")}
        viewsCount={data.viewsCount}
        commentsCount={comments.items.length}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={comments.items}
        isLoading={false}
      >
        <Index avatarImage={data.imageUrl} />
      </CommentsBlock>
    </>
  );
};
