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
function TableMappingID({ columns, data, uploadData }) {
  const [studentID, setStudentID] = useState("");
  const [accountID, setAccountID] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const onHandleShow = (id) => {
    setAccountID(id);
    setShowDialog(true);
    
    setAccountID(id);
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
  
  const studentIDOnChangeHandler = (e) => setStudentID(e.target.value);
  
  const unmapBtn = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "studentID": studentID,
        "accountID": id
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    fetch(process.env.REACT_APP_API_URL + "accounts/mapping", requestOptions)
    .then(response =>  {
        if (!response.ok) alert("StudentID existed");
        else alert("Updated!");
        return response.text();
    })
    .then(result => {
        uploadData();
        onHandleClose();
        setStudentID('');
        
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
                      {!data[i].studentID ? 
                      
                      <button onClick={() => onHandleShow(row.values.id)} className="white-btn">Map</button>:
                      <button onClick={() => unmapBtn(row.values.id)} className="black-btn">Unmap</button>}
                  </td>: ""}
                  
                  </tr>
                  
              );
              })}
          </tbody>
        </table>
        <div>
          <Modal show={showDialog} onHide={onHandleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Mapping StudentID</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Student ID </Form.Label>
                        <Form.Control type="text" value={studentID}  onChange={studentIDOnChangeHandler} />
                    </Form.Group>
                    <div className="text-center" >
                        <button type="button" onClick={() => unmapBtn(accountID)} className="btn btn-dark btnEdit"> SAVE </button>
                    </div>
                </Form>
            </Modal.Body>
                        
          </Modal>
                </div>
    </div>

  );
}

export default TableMappingID;