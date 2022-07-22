import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";

import { logout, selectisAuth } from "../../redux/slices/auth";

export const Header = () => {
  const isAuth = useSelector(selectisAuth);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data); 

  const onClickLogout = () => {
    if (window.confirm("Are you shure want to logout?")) {
      dispatch(logout());
      window.localStorage.removeItem("tokenBlog");
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>{userData?.fullName ? `${userData?.fullName}'s blog` : "News"}</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Create Post</Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Create account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
