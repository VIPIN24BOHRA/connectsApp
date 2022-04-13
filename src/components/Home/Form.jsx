import React, { useState } from "react";
import SocialMedia from "../../uitlities/social_media.png";
import { Typography, Spin } from "antd";
import {
  GooglePlusCircleFilled,
  SmileFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { auth } from "../firebase.js";
import { database } from "../firebase.js";
import { ref, get, set } from "firebase/database";

import { message } from "antd";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth";
import "./Form.css";

const { Text, Title } = Typography;
const googleProvider = new GoogleAuthProvider();

export default function Form(props) {
  const [logging, setLogging] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLogging(true);
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      // navigation("/profile", { replace: true });
      const userRef = ref(database, `users/${user.uid}`);
      console.log("signed up succesfully", user);
      // dispatch(userLogged(user.uid, user.isAnonymous));

      message.success("logged in");
      setLogging(false);

      get(userRef)
        .then((snap) => {
          const result = snap.val();
          if (result === null) {
            set(userRef, {
              name: user.displayName,
              photo: user.photoURL,
              status: "Hi there, I am using connects app",
              like: 0,
              dislike: 0,
              likeSearchQuery: "0000000000_" + user.uid,
              reactedTo: [],
            })
              .then(() => {
                console.log("user has been added");
              })
              .catch((err) => {
                console.log("some error");
                setLogging(false);
              });
          } else {
            // get the user.
            // console.log(user);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithoutProvider = () => {
    setLogging(true);

    signInAnonymously(auth)
      .then((result) => {
        const user = result.user;
        const userRef = ref(database, `users/${user.uid}`);
        console.log(user, "signed in anonymously");
        message.success("logged in");
        setLogging(false);

        fetch("https://randomuser.me/api/")
          .then((res) => res.json())
          .then((randomUser) => {
            console.log(randomUser);
            let addUserDetails = {
              name:
                randomUser.results[0].name.title +
                " " +
                randomUser.results[0].name.first +
                " " +
                randomUser.results[0].name.last,
              photo: randomUser.results[0].picture.large,
              status: "Hi there, I am using connects app",
              like: 0,
              dislike: 0,
              likeSearchQuery: "0000000000_" + user.uid,
              reactedTo: [],
            };

            set(userRef, addUserDetails)
              .then(() => {
                console.log("user has been added");
              })
              .catch((err) => {
                setLogging(false);

                console.log("some error");
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="form_block">
      <div
        style={{
          backgroundImage: `linear-gradient(to right, #fa709a 0%, #fee140 100%),url(${SocialMedia})`,
        }}
        className="img_block"
      >
        {/* <img src={SocialMedia} style={{ height: "100%", width: "100%" }} /> */}
      </div>
      <div className="input_block">
        <Title style={{ fontSize: "40px", color: "#fdfbfb" }} className="mb_50">
          Sign In
        </Title>

        <Text
          type="secondary"
          strong
          style={{
            display: "inline-block",
            fontSize: "30px",
            color: "#fdfbfb",
          }}
          className="mb_70"
        >
          Welcome To Connects App
        </Text>
        <br />
        <div className="link_block">
          <Text strong style={{ fontSize: "20px", color: "#fdfbfb" }}>
            Sign in with google
          </Text>
          <GooglePlusCircleFilled
            className="icon_"
            onClick={() => {
              signInWithGoogle();
            }}
          />
        </div>
        <div className="link_block">
          <Text strong style={{ fontSize: "20px", color: "#fdfbfb" }}>
            Sign in Anonymously
          </Text>
          <SmileFilled
            className="icon_"
            onClick={() => {
              signInWithoutProvider();
            }}
          />
        </div>
        <div className="link_block">
          {logging ? (
            <LoadingOutlined style={{ fontSize: "25px" }} spin fill="#fdfbfb" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
