import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

export default function CheckValidation() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [job, setJob] = useState("");
  const [position, setPosition] = useState("");
  const [dateEmployment, setDateEmployment] = useState("");
  const [salary, setSalary] = useState("");
  const [employmentContract, setEmploymentContract] = useState("");

  const handleAddEmployee = () => {
    if (fname === "") {
      toast.warning(`Please fill the fields => fname `, {
        autoClose: 2000,
      });
    } else if(lname === ""){
      toast.warning(`Please fill the fields => lname `, {
        autoClose: 2000,
      });
    } else if(gender === ""){
      toast.warning(`Please fill the fields => gender `, {
        autoClose: 2000,
      });
    } else if(dob === ""){
      toast.warning(`Please fill the fields => dob `, {
        autoClose: 2000,
      });
    } else if(village === ""){
      toast.warning(`Please fill the fields => village `, {
        autoClose: 2000,
      });
    } else if(district === ""){
      toast.warning(`Please fill the fields => district `, {
        autoClose: 2000,
      });
    } else if(province === ""){
      toast.warning(`Please fill the fields => province `, {
        autoClose: 2000,
      });
    } else {
      Swal.fire({
        title: "successfully!",
        text: "success saved..",
        icon: "success",
        timer: 2000,
        customClass: {
          popup: "my-popup-class",
          container: "my-container-class",
        },
      });
    }
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="flex gap-8 w-full">
        <TextField
          fullWidth
          placeholder="first name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
        />
        <TextField
          fullWidth
          placeholder="last name"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-8 w-full pt-4">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">--select--</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={gender}
            label="--select--"
            onChange={(e) => setGender(e.target.value)}>
            <MenuItem value="">none</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="male">Male</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="date"
          placeholder="date of birth"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">--select--</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={village}
            label="--select--"
            onChange={(e) => setVillage(e.target.value)}>
            <MenuItem value="">none</MenuItem>
            <MenuItem value="NoneSawang">NoneSawang</MenuItem>
            <MenuItem value="Phone Mee">Phone Mee</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">--select--</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={district}
            label="--select--"
            onChange={(e) => setDistrict(e.target.value)}>
            <MenuItem value="">none</MenuItem>
            <MenuItem value="ViengKham">ViengKham</MenuItem>
            <MenuItem value="PhoneHong">PhoneHong</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">--select--</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={province}
            label="--select--"
            onChange={(e) => setProvince}>
            <MenuItem value="">none</MenuItem>
            <MenuItem value="XiengKhaung">XiengKhaung</MenuItem>
            <MenuItem value="Bokey">Bokey</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          placeholder="Job"
          value={job}
          onChange={(e) => setJob(e.target.value)}
        />
        <TextField
          fullWidth
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <TextField
          fullWidth
          placeholder="Position"
          value={dateEmployment}
          onChange={(e) => setDateEmployment(e.target.value)}
        />
        <TextField
          fullWidth
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
        <TextField
          fullWidth
          placeholder="Position"
          value={employmentContract}
          onChange={(e) => setEmploymentContract(e.target.value)}
        />
      </div>
      <div className="flex justify-center items-center mt-4">
        <Button
          autoFocus
          onClick={handleAddEmployee}
          size="large"
          color="primary"
          variant="contained">
          <span>Confirm</span>
        </Button>
      </div>
    </div>
  );
}
