import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router"
import { Button } from "@material-ui/core";
import Metadata from "../layout/Metadata";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { deleteUser, fetchAdminUsers } from "../../redux/userSlice";

const UsersList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const users = useSelector((state) => state.user.allUsers);
    const deleteSuccess = useSelector((state) => state.user.deleteSuccess);
    //   const {
    //     error: deleteError,
    //     isDeleted,
    //     message,
    //   } = useSelector((state) => state.profile);

    const deleteUserHandler = (id) => {
        dispatch(deleteUser(id));
    };

    useEffect( () => {
        async function fetchUsers() {
            await dispatch(fetchAdminUsers());
            
        }
        if (deleteSuccess) {
            navigate("/admin/users");
            console.log("user deleted");
        }
        fetchUsers()
    }, [dispatch, deleteSuccess]);

    const columns = [
        { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },

        {
            field: "email",
            headerName: "Email",
            minWidth: 200,
            flex: 1,
        },
        {
            field: "name",
            headerName: "Name",
            minWidth: 150,
            flex: 0.5,
        },

        {
            field: "role",
            headerName: "Role",
            type: "number",
            minWidth: 150,
            flex: 0.3,
            cellClassName: (params) => {
                return params.getValue(params.id, "role") === "admin"
                    ? "greenColor"
                    : "redColor";
            },
        },

        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 150,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                            <EditIcon />
                        </Link>

                        <Button
                            onClick={() =>
                                deleteUserHandler(params.getValue(params.id, "id"))
                            }
                        >
                            <DeleteIcon />
                        </Button>
                    </Fragment>
                );
            },
        },
    ];

    const rows = [];
    // console.log(users)
    if(users){
        
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            rows.push({
                id: users[index]._id,
                role: users[index].role,
                email: users[index].email,
                name: users[index].name,
              });
        }
    }
      

    return (
        <Fragment>
            <Metadata title={`ALL USERS - Admin`} />

            <div className="dashboard">
                <SideBar />
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL USERS</h1>

                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
    );
};

export default UsersList;