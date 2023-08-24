import { useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { UPDATE_USER } from "../../apollo/user/Mutation";
import Swal from "sweetalert2";

export default function EditUser(props) {
  const userData = props.data;
  const id = userData.id;
  const { closeDialog } = props;
  const [updateUser, { data: loadUpdate }] = useMutation(UPDATE_USER);
  // const [id, setId] = useState(userData.id);
  const [fullname, setFullname] = useState(userData.fullname);
  const [phone, setPhone] = useState(userData.phone);
  const [age, setAge] = useState(userData.age);

  const handleUpdate = () => {
    // console.log(id)
    if (loadUpdate) return;
    updateUser({
      variables: {
        // orderBy: "createdAt_DESC",
        where: {
          id: id,
        },
        data: {
          fullname: fullname,
          phone: phone,
          age: age,
        },
      },
    })
      .then(() => {
        Swal.fire({
          title: "Successfully!",
          text: "updated data success.",
          icon: "success",
          timer: 3000,
          customClass: {
            popup: "my-popup-class",
            container: "my-container-class",
          },
        });
      })
      .then(() => {
        closeDialog();
      })
      .catch((error) => {
        Swal.fire({
          title: "Error!",
          text: error,
          icon: "error",
          customClass: {
            popup: "my-popup-class",
            container: "my-container-class",
          },
        });
      });
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <TextField
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          fullWidth
        />
        <TextField
          value={age}
          onChange={(e) => setAge(e.target.value)}
          fullWidth
        />
        <TextField
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
        />

        <div className="flex justify-end items-center">
          <Button
            onClick={handleUpdate}
            color="primary"
            size="large"
            variant="contained">
            update
          </Button>
        </div>
      </div>
    </>
  );
}
