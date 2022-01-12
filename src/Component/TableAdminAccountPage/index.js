import React, {useState} from "react";
import { useTable, useGlobalFilter, useAsyncDebounce  } from "react-table";
import "./index.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Modal, Form } from "react-bootstrap"
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
      setGlobalFilter(value || undefined)
    }, 200)
  
    return (
      <span>
        Search:{' '}
        <input
          value={value || ""}
          onChange={e => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
        />
      </span>
    )
}
function TableAdminAccountPage({ columns, data, uploadData }) {
  
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirm, setConfirm] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const handleOnchangeUsername = (e) => {
    setUsername(e.target.value);
  }  
  const handleOnchangePassword = (e) => {
    setPassword(e.target.value);
  }
  const handleOnchangeConfirm = (e) => {
    setConfirm(e.target.value);
  }
  const onHandleShow = () => {
      
    setShowDialog(true);
   
  }
  const onHandleClose = () => {
      setShowDialog(false);
  }
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,state,
    preGlobalFilteredRows, 
    setGlobalFilter, } =
    useTable({
      columns,
      data,
    },
    useGlobalFilter 
  );
  const RegisterBtnOnClick = (e) => {
    e.preventDefault();
    if (password !== confirm) {
        alert("Password does not match!");
        return;
    }
    if (password === "" || confirm === "") {
        alert("You must fill in username and password!");
    }
    if (username !== "") {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": username,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "accounts/registeradmin", requestOptions)
        .then(response => response.text())
        .then(result => {
            alert("Register successfully, you can login now!");
        })
        .catch(error => {
            alert("Register fail!")
        });
    }
  }
  return (
    <div className="row">
        <div className="col-10">
        <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
        /></div>
        <div className="col-2">
            <button className="btn btn-dark btnEdit w-100"  onClick={() => onHandleShow()}> Create </button>
        </div>
        <table {...getTableProps()} border="1" className="table-data">
          <thead>
              {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                  ))}
              </tr>
              ))}
          </thead>
          <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
              prepareRow(row);
              return (
                  
                  <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                      return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                  
                  </tr>
                  
              );
              })}
          </tbody>
        </table>
        <div>
          <Modal show={showDialog} onHide={onHandleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Register Admin Account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Username </Form.Label>
                        <Form.Control type="text" value={username}  onChange={handleOnchangeUsername}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Password </Form.Label>
                        <Form.Control type="text" value={password}  onChange={handleOnchangePassword}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Confirm </Form.Label>
                        <Form.Control type="text" value={confirm}  onChange={handleOnchangeConfirm}/>
                    </Form.Group>
                    <div className="text-center" >
                        <button className="btn btn-dark btnEdit w-100"  onClick={RegisterBtnOnClick}> Register </button>
                    </div>
                </Form>
            </Modal.Body>
                        
          </Modal>
                </div>
    </div>

  );
}

export default TableAdminAccountPage;