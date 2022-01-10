import React, {useState} from "react";
import {Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"
import TableMappingID from "../TableMappingID";
const MappingIDPage = () => {
    const [data, setData] = useState([]);
    const [loadFirst, setLoadFirst] = useState(true);
    const [loadCheckUser, setLoadCheckUser] = useState(false);
    const getInfo = () => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(process.env.REACT_APP_API_URL + "accounts/user" , requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw Error(response.status);
            })
            .then(result => {
                setData(result);
                setLoadCheckUser(true);
                
            })
            .catch(error => {
                console.log('error', error)
            });
    }
    if (loadFirst){
        getInfo();
        setLoadFirst(false);
    }
    const columns = React.useMemo(
        () => [
          {
            Header: "ID",
            accessor: "id",
          },
          {
            Header: "Username",
            accessor: "username",
          },
          {
            Header: "StudentID",
            accessor: "studentID",
          }
        ],
        []
    );
    const checkUsernameExist = () => {
        if (loadCheckUser) {
            let newData = [];
            for (let index = 0; index <data.length; index++) {
                if (data[index].username === "") {
                    data[index].username = data[index].email;
                }
                newData.push(data[index]);
            }
            setData(newData);
            setLoadCheckUser(false);
        }
    }
    const uploadData = () => {
        getInfo();
    }
    checkUsernameExist();
    return (
        <div className="row admin-page">
            <div className="row mb-4">
                <h1 className="text-center ">List Account</h1>
            </div>
            
            <div className="col-2 catalog ">
                <div className="row">
                <Link to="/admin" className="text-catalog border-catalog"> Manage Account </Link>
                </div>
                <div className="row">
                <Link to="/adminaccount" className="text-catalog border-catalog "> Manage Admin </Link>
                </div>
                <div className="row">
                <Link to="/manageclass" className="text-catalog center-catalog "> Manage Class </Link>
                </div>
                <div className="row">
                <Link to="#" className="text-catalog border-catalog selected-catalog"> Mapping Student ID </Link>
                </div>
            </div>
            <div className="offset-1 col-6">
                <TableMappingID columns={columns} data={data} uploadData={uploadData} /> 
            </div>
            
        </div>
    );
}

export default MappingIDPage;