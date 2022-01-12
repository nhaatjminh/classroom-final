
import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { Card} from 'react-bootstrap';
import './index.css';

const Assignment = ({dataAssignment, role, getTotal}) => {
    const params = useParams();

    const [topic] = useState(dataAssignment.topic);
    const [grade] = useState(dataAssignment.grade);
    const [description] = useState(dataAssignment.description);
    const [point, setPoint] = useState("");

    const getGradeForStudent = (assign_id, student_id) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "grades/get-one-grade/" + assign_id + "/" + student_id, requestOptions)
        .then(response => response.json())
        .then(result =>
            {
                if (result.length > 0) {
                    setPoint(result[0].grade)
                    if (dataAssignment.finished === 1) {
                        getTotal((result[0].grade * dataAssignment.grade /10))
                    }
                }
            })
        .catch(error => console.log('error', error));
    }

    useEffect(() => {
        getGradeForStudent(dataAssignment.id, localStorage.getItem("studentID"));
    }, []);

    const detailURL = "/classes/detail/" + params.id + "/assignment/" + dataAssignment.id;
    return(
    <Card key={dataAssignment.id} className="assignment mx-auto">
        <Card.Header as= "h2" className="head-center"> {topic} </Card.Header>
        <Card.Body>            
            {/* <Card.Title> Abc </Card.Title> */}
            <Card.Text> {description} </Card.Text> 
            {role === 'student' ?
            <Card.Text> Point: {dataAssignment.finished === 1 ? point : "--"}</Card.Text> :
            <Card.Text> Point: {grade} / 10</Card.Text> }
            <Card.Text> {dataAssignment.deadline} </Card.Text> 
        </Card.Body>
        <Card.Footer className="text-center">
            <div className="footer-createAssignBtn text-center">
                <Link to={detailURL}>
                <button className="btn btn-success btnView"> View </button>
                </Link>
            </div>
        </Card.Footer>

    </Card>
    )
};

export default Assignment;