import React, {useEffect,useState} from "react";
import { useTable, useGlobalFilter, useAsyncDebounce  } from "react-table";
import "./index.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Modal, Form } from "react-bootstrap"
import { Card} from 'react-bootstrap';
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
function TableManageClass({ columns, data, uploadData }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow,state,
    preGlobalFilteredRows, 
    setGlobalFilter, } =
    useTable({
      columns,
      data,
    },
    useGlobalFilter 
  );
  const [detailClass, setDetailClass] = useState({
    creator: "",
    description: "",
    id: -1,
    name: "",
    timeCreate: "",
    linkInvite: ""
  });
  
  const [showDialog, setShowDialog] = useState(false);
  const [assignment, setAssignment] = useState([]);
  const getListAssignment = (id) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(process.env.REACT_APP_API_URL + "assignment/" + id, requestOptions)
    .then(response => response.json())
    .then(result => {
        setAssignment(result);
    })
    .catch(error => {
        console.log('error', error);
    })
  }
  const GetDetailClass = async (id) => {
    getListAssignment(id);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    await fetch(process.env.REACT_APP_API_URL + "classes/detail/" + id, requestOptions)
    .then(response => response.json())
    .then(result => {
      setDetailClass({
            creator: result.creator,
            description: result.description,
            id: result.id,
            name: result.name,
            timeCreate: result.timeCreate
        })
    })
    .catch(error => {
        console.log('error', error);
    });
  }
  const onHandleShow = (id) => {
    GetDetailClass(id);
    setShowDialog(true);
  }
  const onHandleClose = () => {
      setShowDialog(false);
  }
  const renderGradeStructure = () => {
    let gradestructure = [];
    for (let index = 0; index < assignment.length; index++) {
        gradestructure.push(<Card.Text> {assignment[index].topic} : {assignment[index].grade}đ </Card.Text>)
    }
    return gradestructure;
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
                  <td className="action">
                      <button onClick={() => onHandleShow(row.values.id)} className="black-btn">Detail</button>
                  </td>
                  </tr>
                  
              );
              })}
          </tbody>
        </table>
        <div>
          <Modal show={showDialog} onHide={onHandleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Detail Class</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> ID </Form.Label>
                        <Form.Control type="text" value={detailClass.id} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Name </Form.Label>
                        <Form.Control type="text" value={detailClass.name}  disabled/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> Description </Form.Label>
                        <Form.Control type="text" value={detailClass.description}  disabled/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label> ID Creator </Form.Label>
                        <Form.Control type="text" value={detailClass.creator}  disabled/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Card className="w-100">
                            <Card.Header as= "h5" className="text-center">Grades Structure</Card.Header>
                            <Card.Body>            
                                {assignment.length > 0 ?
                                renderGradeStructure(): ""}   
                            </Card.Body>
                            <Card.Footer className="text-center">
                            </Card.Footer>
                        </Card>
                    </Form.Group>
                </Form>
            </Modal.Body>
                        
          </Modal>
                </div>
    </div>

  );
}

export default TableManageClass;