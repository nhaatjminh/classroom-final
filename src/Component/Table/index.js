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
function Table({ columns, data, uploadData }) {
  const [studentID, setStudentID] = useState("");
  const [accountID, setAccountID] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const onHandleShow = (id) => {
    setAccountID(id);
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(process.env.REACT_APP_API_URL + "accounts/detail/" + id , requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.status);
    })
    .then(result => {
      setStudentID(result.account[0].studentID);
	    setName(result.account[0].name);
      setAddress(result.account[0].address);
      setPhone(result.account[0].phone);
      setShowDialog(true);
    })
    .catch(error => {
      console.log('error', error)
    });
  }
  const onHandleClose = () => {
      setShowDialog(false);
  }
	const nameOnChangeHandler = (e) => setName(e.target.value);
  const addressOnChangeHandler = (e) => setAddress(e.target.value);
  const phoneOnChangeHandler = (e) => setPhone(e.target.value);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,state,
    preGlobalFilteredRows, 
    setGlobalFilter, } =
    useTable({
      columns,
      data,
    },
    useGlobalFilter 
  );
  const lockAccount = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(process.env.REACT_APP_API_URL + "accounts/lock/" + id , requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.status);
    })
    .then(result => {
      uploadData();
    })
    .catch(error => {
      console.log('error', error)
    });
  }
  const onClickRemove = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(process.env.REACT_APP_API_URL + "accounts/remove/" + id , requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.status);
    })
    .then(result => {
      uploadData();
    })
    .catch(error => {
      console.log('error', error)
    });
  }
  const saveBtnOnClick = (e) => {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "studentID": studentID,
        "name": name,
        "address": address,
        "phone": phone
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(process.env.REACT_APP_API_URL + "accounts/update/"+ accountID, requestOptions)
    .then(response =>  {
        return response.text();
    })
    .then(result => {
        uploadData();
        onHandleClose();
        alert("Updated!");
    })
    .catch(error => {
        alert("An error occur");
    });
  }
  return (
    <div className="row">
        <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
        />
        <table {...getTableProps()} border="1" className="table-data">
          <thead>
              {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                  ))}
                  <th >Action</th>
              </tr>
              ))}
          </thead>
          <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
              prepareRow(row);
              return (
                  
                  <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    if (row.values.username !== "root")
                      return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                  { row.values.username !== "root" ? 
                  <td className="action">
                      <button onClick={() => onHandleShow(row.values.id)} className="white-btn">Edit</button>
                      {data[i].ban === 1 ? 
                      <button onClick={() => lockAccount(row.values.id)} className="black-btn">Unlock</button>:
                      <button onClick={() => lockAccount(row.values.id)} className="black-btn">Lock</button>}
                      <button onClick={() => onClickRemove(row.values.id)} className="white-btn">Remove</button>
                  </td>: ""}
                  
                  </tr>
                  
              );
              })}
          </tbody>
        </table>
        <div>
          <Modal show={showDialog} onHide={onHandleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Fullname </Form.Label>
                        <Form.Control type="text" value={name}  onChange={nameOnChangeHandler}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Address </Form.Label>
                        <Form.Control type="text" value={address}  onChange={addressOnChangeHandler}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Numberphone </Form.Label>
                        <Form.Control type="text" value={phone}  onChange={phoneOnChangeHandler}/>
                    </Form.Group>
                    <div className="text-center" >
                        <button className="btn btn-dark btnEdit"  onClick={saveBtnOnClick}> SAVE </button>
                    </div>
                </Form>
            </Modal.Body>
                        
          </Modal>
                </div>
    </div>

  );
}

export default Table;