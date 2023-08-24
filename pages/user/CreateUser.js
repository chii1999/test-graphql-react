import { useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material"; 
import React, { useState } from "react";
import { CREATE_USER } from "../../apollo/user/Mutation";
import Swal from "sweetalert2";

export default function CreateUser(props) {
  const { closeDialog } = props;
  const [createUser, { loading }] = useMutation(CREATE_USER);
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");

  const regexMobile = /^0?(20)[2579]\d{7}$/;
  const regexUsername = /^[A-Za-z]{3,16}$/;

// create user ----------------
  const handleCreateUsers = async (values) => {
    if (fullname === "") {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please enter a name first",
        timer:2000,
        customClass: {
          popup: "my-popup-class",
          container: "my-container-class",
        },
      });
    } else if(!fullname.match(regexUsername)) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Regular expression to match username with at least 3 characters!",
        timer:2500,
        customClass: {
          popup: "my-popup-class",
          container: "my-container-class",
        },
      });
    } else if(!phone.match(regexMobile)) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Invalid phone number "+ phone,
        timer:2000,
        customClass: {
          popup: "my-popup-class",
          container: "my-container-class",
        },
      });
    } else {
      try {
        if (loading) return;
        await createUser({
          variables: {
            orderBy: "createdAt_DESC",
            data: {
              fullname,
              phone,
              age,
            },
          },
        });
        closeDialog();
      } catch (err) {
        console.log("error creating todo:", err);
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col gap-4 w-full">
        <TextField
          fullWidth
          placeholder="type name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <TextField
          fullWidth
          placeholder="phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          fullWidth
          placeholder="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <Button
          onClick={handleCreateUsers}
          autoFocus size="large"
          color="primary"
          variant="contained">
          <span>Confirm</span>
        </Button>
      </div>
    </div>
  );
}
