import React, {useState} from "react";
import {Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"
import TableManageClass from "../TableManageClass";
const ManageClassAdminPage = () => {
    const [data, setData] = useState([]);
    const [loadFirst, setLoadFirst] = useState(true);
    const getInfo = () => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(process.env.REACT_APP_API_URL + "classes/admin" , requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw Error(response.status);
            })
            .then(result => {
                setData(result);
                
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
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Description",
            accessor: "description",
          },
          {
            Header: "ID Teacher",
            accessor: "creator",
          }
        ],
        []
    );
    const uploadData = () => {
        getInfo();
    }
    return (
        <div className="row admin-page">
            <div className="row mb-4">
                <h1 className="text-center ">List Class</h1>
            </div>
            
            <div className="col-2 catalog ">
                <div className="row">
                <Link to="/admin" className="text-catalog border-catalog"> Manage Account </Link>
                </div>
                <div className="row">
                <Link to="/adminaccount" className="text-catalog border-catalog "> Manage Admin </Link>
                </div>
                <div className="row">
                <Link to="#" className="text-catalog center-catalog selected-catalog"> Manage Class </Link>
                </div>
                <div className="row">
                <Link to="/mapID" className="text-catalog border-catalog "> Mapping Student ID </Link>
                </div>
            </div>
            <div className="offset-1 col-6">
                <TableManageClass columns={columns} data={data} uploadData={uploadData} /> 
            </div>
            
        </div>
    );
}

export default ManageClassAdminPage;