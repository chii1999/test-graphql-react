import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { GET_USER } from "../../apollo/user/Query";
import { DELETE_USER } from "../../apollo/user/Mutation";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import { ToastContainer, toast } from 'react-toastify';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ViewsUser from "./ViewsUser";
import CheckValidation from "./CheckValidation";

export default function UserList(props) {
  const query = props.search;
  const [users, setUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openViews, setOpenViews] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("md");
  const [eduser, setEdUser] = useState([]);
  const [veiuser, setVeiUser] = useState([]);

  const handleClose = () => {
    setOpen(false);
    setOpenAdd(false);
    setOpenEdit(false);
    setOpenViews(false);
    fetchData();
  };

  const [loaduser, { data: getUserData }] = useLazyQuery(GET_USER, {
    fetchPolicy: "network-only",
  });
  const [deleteUser, { data: loadDelete }] = useMutation(DELETE_USER);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (getUserData) {
      const selectedUsers = getUserData.getUsersList.data.map(
        ({ id, fullname, phone, age }) => ({
          id,
          fullname,
          phone,
          age,
        })
      ); 
      setUser(selectedUsers);
    }
  }, [getUserData]);

  const fetchData = async () => {
    await loaduser({});
  };

  const handleEdite = (user) => {
    setEdUser(user);
    setOpenEdit(true);
  };

  const handleAddEmployee = () => {
    setOpenAdd(true);
  };
  const handleCreate = () => {
    setOpen(true);
  };

  const handleDelete = (id) => {
    // if (loadDelete) return; ດັບຈັບຂໍ້ຜິດພາດ ບໍ່ໃຫ້ກົດຫຼາຍຄັ້ງພ້ອມກັນ
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetchData();
        deleteUser({
          variables: {
            where: {
              id: id,
            },
          },
        });
        Swal.fire({
          title: "Deleted!",
          text: "successfully",
          icon: "success",
          timer: 1500,
        });
      }
    });
  };

  const handleViews = (data) => {
    setOpenViews(true);
    setVeiUser(data);
    // toast.success('Add to cart successfully!', { autoClose: 3000 });
  };

  let number = 1;

  return (
    <div className="p-16">
      {/* <ToastContainer />  */}
      <div className="py-4 flex justify-between items-center">
        <h2 className="text-3xl font-medium">User Info</h2>
        <div className="grow-32 gap-4 flex">
          <Button
            onClick={handleAddEmployee}
            startIcon={<AddIcon />}
            size="large"
            color="primary"
            variant="contained">
            <span className=" capitalize">Add Employee</span>
          </Button>
          <Button
            onClick={handleCreate}
            startIcon={<AddIcon />}
            size="large"
            color="primary"
            variant="contained">
            <span className=" capitalize">Create User</span>
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650, backgroundColor: "#fff" }}
          aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="left">Fullname</TableCell>
              <TableCell align="left">Mobile Phone</TableCell>
              <TableCell align="left">Age</TableCell>
              <TableCell align="left">Users Number</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter(
                (data) =>
                  data.fullname.toLowerCase().includes(query) ||
                  data.age.toLowerCase().includes(query)
              )
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center" component="th" scope="row">
                    {number++}
                  </TableCell>
                  <TableCell align="left">{row.fullname}</TableCell>
                  <TableCell align="left">{row.phone}</TableCell>
                  <TableCell align="left">{row.age}</TableCell>
                  <TableCell align="left">
                    <span className="flex-nowrap">{row.id}</span>
                  </TableCell>
                  <TableCell align="right">
                    <div className="md:flex gap-2 justify-end items-center"> 
                      <Button
                        onClick={() => handleEdite(row)}
                        size="small"
                        color="primary"
                        variant="outlined">
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(row.id)}
                        size="small"
                        color="error"
                        variant="outlined">
                        Delete
                      </Button>
                      <Button
                        onClick={() => handleViews(row)}
                        size="small"
                        color="primary"
                        variant="contained">
                        Views
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        PaperProps={{ sx: { borderRadius: "16px" } }}
        open={openAdd}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <div className="flex justify-between items-center">
            <span>Add Employee Office</span>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ width: "100%" }}>
          <CheckValidation closeDialog={handleClose} />
        </DialogContent>
      </Dialog>

      <Dialog
        PaperProps={{ sx: { borderRadius: "16px" } }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <div className="flex justify-between items-center">
            <span>Add User</span>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          <CreateUser closeDialog={handleClose} />
        </DialogContent>
      </Dialog>

      <Dialog
        PaperProps={{ sx: { borderRadius: "16px" } }}
        open={openEdit}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <div className="flex justify-between items-center">
            <span>Edit User Info</span>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          <EditUser data={eduser} closeDialog={handleClose} />
        </DialogContent>
      </Dialog>

      <Dialog
        PaperProps={{ sx: { borderRadius: "16px" } }}
        open={openViews}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <div className="flex justify-between items-center">
            <span>User Views</span>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ width: 500 }}>
          <ViewsUser data={veiuser} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
