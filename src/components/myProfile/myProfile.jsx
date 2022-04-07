import React, { useEffect } from "react";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Space,
  Typography,
  Spin,
  message,
} from "antd";
import { EditTwoTone, SaveTwoTone } from "@ant-design/icons";
import { useState } from "react";
import { auth } from "../firebase";

import { update, get, onChildAdded, ref } from "firebase/database";

import { database } from "../firebase.js";

// import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Title } = Typography;

export default function MyProfile(props) {
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [status, setStatus] = useState();
  const [myProfile, setProfile] = useState({});
  const [count, setCount] = useState(0);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    get(ref(database, `users/${auth.currentUser.uid}`))
      .then((snap) => {
        let newUser = snap.val();
        console.log(newUser);
        if (newUser === null) {
          if (count <= 5) {
            setCount((prev) => ++prev);
            return;
          } else {
            alert("cannot fetch user data");
          }
        }
        setStatus(newUser.status);
        setProfile(newUser);
      })
      .catch((e) => {
        console.log(e);
      });
    // onChildAdded(ref(database, "/users"), (snap) => {
    //   console.log(snap.val());
    // });
  }, [count]);

  function onClose() {
    setVisible(false);
  }

  function showDrawer() {
    setVisible(true);
  }

  function updateStatus() {
    setUpdating(true);
    update(ref(database, `users/${auth.currentUser.uid}`), { status: status })
      .then(() => {
        console.log("updated");
        setEdit(false);
        setUpdating(false);
        message.success("status updated");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          style={{
            width: "50px",
            borderRadius: "50%",
            cursor: "pointer",
            marginLeft: "50px",
            marginRight: "20px",
          }}
          src={myProfile.photo}
          alt=""
          onClick={() => {
            showDrawer();
          }}
        />
        <Title level={4}>{myProfile.name}</Title>
      </div>

      <Drawer
        title={myProfile.name}
        width={500}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 80 }}
        placement="left"
        extra={<Space>{edit ? <></> : null}</Space>}
      >
        <Form layout="vertical" hideRequiredMark>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "50px",
            }}
          >
            <img
              style={{
                width: "250px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              src={myProfile.photo}
              alt=""
            />
          </div>
          {/* <Row gutter={16}> */}
          {/* <Col span={16}> */}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <EditTwoTone
              style={{
                fontSize: "25px",
                cursor: "pointer",
                marginBottom: "10px",
              }}
              twoToneColor={edit ? "#ff9a9e " : "#52c41a"}
              onClick={() => {
                setEdit(!edit);
              }}
            />

            {edit ? (
              <>
                {updating ? <Spin></Spin> : null}
                <SaveTwoTone
                  style={{
                    fontSize: "25px",
                    cursor: "pointer",
                    marginRight: "20px",
                    marginBottom: "10px",
                  }}
                  onClick={updateStatus}
                />
              </>
            ) : null}
          </div>

          <TextArea
            showCount
            maxLength={500}
            style={{ height: "120px" }}
            disabled={!edit}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          />
          {/* </Col> */}
          {/* <Col span={12}>
              <Form.Item
                name="url"
                label="Url"
                rules={[{ required: true, message: "Please enter url" }]}
              >
                <Input
                  style={{ width: "100%" }}
                  addonBefore="http://"
                  addonAfter=".com"
                  placeholder="Please enter url"
                />
              </Form.Item>
            </Col> */}
          {/* </Row> */}
        </Form>
      </Drawer>
    </>
  );
}
