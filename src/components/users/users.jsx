import React from "react";
import { Card, Avatar, Space, Button, Spin } from "antd";
import { DislikeTwoTone, HeartTwoTone, LikeTwoTone } from "@ant-design/icons";
import { useEffect, useRef, useState, useCallback } from "react";
import { auth } from "../firebase.js";
import { database } from "../firebase.js";
import {
  ref,
  get,
  onChildAdded,
  query,
  orderByChild,
  limitToLast,
  endAt,
  endBefore,
  update,
  onChildChanged,
  onValue,
} from "firebase/database";

const { Meta } = Card;
// onChildChanged(ref(database, "/users/"), (snap) => {
//   console.log(snap);
// });
export default function Users(props) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seed, setSeed] = useState("z");

  function likeProfile(user) {
    const uid = user.totalThumbs.split("_")[1];
    // console.log(uid);
    const userReference = ref(database, `/users/${uid}`);
    let like = user.like + 1;
    let total = String(like + user.dislike);
    let prefixLength = 10 - total.length;
    let prefix = "";
    for (let i = 1; i <= prefixLength; i++) {
      prefix += "0";
    }
    let totalThumbs = prefix + total + "_" + uid;
    update(userReference, { like: like, totalThumbs: totalThumbs })
      .then(() => {
        console.log("user updated");
        setUsers((prevState) => {
          return prevState.map((obj) =>
            obj.totalThumbs.split("_")[1] === uid
              ? Object.assign(obj, { like: like, totalThumbs: totalThumbs })
              : obj
          );
        });
      })
      .catch((e) => {
        console.log(err);
      });
  }
  function dislikeProfile(user) {
    const uid = user.totalThumbs.split("_")[1];
    // console.log(uid);
    const userReference = ref(database, `/users/${uid}`);
    let dislike = user.dislike + 1;
    let total = String(dislike + user.like);
    let prefixLength = 10 - total.length;
    let prefix = "";
    for (let i = 1; i <= prefixLength; i++) {
      prefix += "0";
    }
    let totalThumbs = prefix + total + "_" + uid;
    update(userReference, { dislike: dislike, totalThumbs: totalThumbs })
      .then(() => {
        console.log("user updated");
        setUsers((prevState) => {
          return prevState.map((obj) =>
            obj.totalThumbs.split("_")[1] === uid
              ? Object.assign(obj, {
                  dislike: dislike,
                  totalThumbs: totalThumbs,
                })
              : obj
          );
        });
      })
      .catch((e) => {
        console.log(err);
      });
  }

  const userRef = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      // console.log(node);
      // console.log("inside the callBack");
      if (userRef.current) userRef.current.disconnect();
      userRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // console.log("visible");
          setSeed(users[users.length - 1].totalThumbs);
        }
      });
      // console.log(userRef.current);
      if (node) userRef.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    setLoading(true);

    // console.log(seed);
    const userReference = query(
      ref(database, "/users"),
      orderByChild("totalThumbs"),
      endBefore(seed),
      limitToLast(7)
    );

    get(userReference)
      .then((snap) => {
        const result = snap.val();
        // console.log(result);

        let user_array = [];
        if (result) {
          Object.keys(result).forEach((user) => {
            if (user != auth.currentUser.uid) user_array.push(result[user]);
          });
        }

        user_array.sort((a, b) => {
          if (a.totalThumbs > b.totalThumbs) return -1;
          else return 0;
        });
        // console.log(user_array);
        setUsers((prev) => [...prev, ...user_array]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [seed]);

  return (
    <Space wrap align="center" size={[150, 50]}>
      {users.map((ele, index) => {
        if (users.length === index + 1) {
          return (
            <Card
              key={index}
              ref={lastItemRef}
              // ref={userRef}
              style={{
                width: "350px",
                maxWidth: "350px",
                height: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "5px 5px 10px rgba(0,0,0,0.2)",
                borderRadius: "10px",
                key: { index },
              }}
              actions={[
                <LikeTwoTone key="like" onClick={() => likeProfile(ele)} />,
                <DislikeTwoTone
                  key="dislike"
                  twoToneColor="#f7db07"
                  onClick={() => dislikeProfile(ele)}
                />,
                <HeartTwoTone key="heart" twoToneColor="#eb2f96" />,
              ]}
            >
              <Meta
                avatar={
                  <Avatar
                    src={ele.photo}
                    style={{ width: "50px", height: "50px" }}
                  />
                }
                title={ele.name}
                description={ele.status}
                style={{ flex: 1 }}
              />
              <div
                style={{
                  marginTop: "50px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <Meta avatar={<LikeTwoTone />} description={String(ele.like)} />
                <Meta
                  avatar={<DislikeTwoTone />}
                  description={String(ele.dislike)}
                />
              </div>
            </Card>
          );
        } else {
          return (
            <Card
              key={index}
              style={{
                width: "350px",
                maxWidth: "350px",
                height: "220px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "5px 5px 10px rgba(0,0,0,0.2)",
                borderRadius: "10px",
              }}
              actions={[
                <LikeTwoTone key="like" onClick={() => likeProfile(ele)} />,
                <DislikeTwoTone
                  key="dislike"
                  onClick={() => dislikeProfile(ele)}
                  twoToneColor="#f7db07"
                />,
                <HeartTwoTone key="heart" twoToneColor="#eb2f96" />,
              ]}
            >
              <Meta
                avatar={
                  <Avatar
                    src={ele.photo}
                    style={{ width: "50px", height: "50px" }}
                  />
                }
                title={ele.name}
                description={ele.status}
                style={{ flex: 1 }}
              />
              <div
                style={{
                  marginTop: "50px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <Meta avatar={<LikeTwoTone />} description={String(ele.like)} />
                <Meta
                  avatar={<DislikeTwoTone />}
                  description={String(ele.dislike)}
                />
              </div>
            </Card>
          );
        }
      })}
      {loading ? <Spin size="large" style={{ fontSize: "50px" }} /> : null}
    </Space>
  );
}
