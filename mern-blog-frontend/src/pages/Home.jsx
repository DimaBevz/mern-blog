import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import moment from "moment";

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags, comments } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);   // будемо пепервіряти, наш "id" (той, який ми зробили авторизацію) співпадає з "id" того у кого є записи користувача
  // якщо не співпадає, кнопки редагування та видалення ми не рендеримо

  const isPostLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  console.log(posts);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={0}
        aria-label="basic tabs example"
      >
        <Tab label="New" />
        <Tab label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {/* Пояснюємо, якщо в нас іде загрузка, ми створюємо масив. Якщо загрузки немає, беремо "posts.items" і його мапимо */}
          {(isPostLoading ? [...Array(5)] : posts.items).map((post, index) =>
            isPostLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                id={post._id}
                title={post.title}
                imageUrl={post.imageUrl ? `http://localhost:3333/${post.imageUrl}`: ""}
                user={post.user}
                createdAt={moment(post.createdAt).format("MMM Do YY")}
                viewsCount={post.viewsCount}
                commentsCount={post.comments.length}
                tags={post.tags}
                isEditable={userData?._id === post.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock
            items={tags.items}
            isLoading={isTagsLoading}
          />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Olexii",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
              },
              {
                user: {
                  fullName: "Egor",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
