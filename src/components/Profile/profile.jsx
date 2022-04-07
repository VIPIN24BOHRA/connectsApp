import React from "react";

import { signOut } from "firebase/auth";
import { Button, Layout, Menu, Card, Avatar, Space, message } from "antd";
import { auth } from "../firebase.js";

import { GoogleAuthProvider, linkWithPopup } from "firebase/auth";
import { useState } from "react";
import "./profile.css";
import MyProfile from "../myProfile/myProfile.jsx";
import Users from "../users/users.jsx";

const { Header, Sider, Content } = Layout;

export default function Profile(props) {
  const [isAnonymous, setAnonymous] = useState(props.user.isAnonymous);

  console.log(props.user);

  // using use Effect you need to call the api
  // and get the result;

  // function to log out user'

  function logoutUser() {
    if (isAnonymous) {
      console.log("delete account permanently", auth.currentUser);
      auth.currentUser
        .delete()
        .then((data) => {
          console.log(data, "deleted succesfully");
          message.success("logged out");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("only logged out", auth.currentUser);
      signOut(auth)
        .then(() => {
          message.success("logged out");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  // function to set anonymous account  permanent account ;

  function permanentLogin() {
    const provider = new GoogleAuthProvider();

    linkWithPopup(auth.currentUser, provider)
      .then((usercred) => {
        const credential = GoogleAuthProvider.credentialFromResult(usercred);
        const user = usercred.user;

        // console.log(
        //   "Anonymous account successfully upgraded",
        //   user,
        //   credential
        // );

        message.success("user account upgraded");

        setAnonymous(false);
      })
      .catch((error) => {
        console.log("account already in use");
        message.error("account already in use signup with different account");
      });
  }

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ padding: 0, display: "flex", alignItems: "center" }}
        >
          <MyProfile />
          <div style={{ flex: "1" }}></div>
          {isAnonymous ? (
            <Button
              type="primary"
              danger
              style={{
                backgroundImage:
                  "linear-gradient(to right,#ff9a9e 0%,#fad0c4 99%,#fad0c4 100%)",
                marginRight: "15px",
                color: "#666",
              }}
              shape="round"
              onClick={() => {
                permanentLogin();
              }}
            >
              save account
            </Button>
          ) : null}
          <Button
            type="primary"
            style={{
              backgroundImage:
                " linear-gradient(to right, #84fab0 0%, #8fd3f4 100%)",
              marginRight: "15px",
              color: "#666",
            }}
            shape="round"
            onClick={() => {
              logoutUser();
            }}
          >
            Log Out
          </Button>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 250,
            marginBottom: "60px",
            overflowY: "scroll",
          }}
          id="scrollArea"
        >
          <Users />
        </Content>
      </Layout>
    </Layout>
  );
}
