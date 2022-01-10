import React, { useState, useEffect } from "react";
import {  Navbar, Card } from 'react-bootstrap';
import { NavLink, useParams, Link } from "react-router-dom";
import './index.css'

const ListReview = () => {
    const params = useParams();
    const listAssignmentURL = '/classes/detail/' + params.id + "/assignment";
    const detailURL = '/classes/detail/' + params.id;
    const memberURL = '/classes/members/' + params.id;
    const gradesStructure = '/grades/' + params.id;

    const [role, setRole] = useState();
    const [listReview, setListReview] = useState([]);
    
    const getRole = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "classId": params.id
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };

        await fetch(process.env.REACT_APP_API_URL + "accounts/role/" + localStorage.getItem("userId"), requestOptions)
        .then(response => response.json())
        .then(result => {
            setRole(result[0].role)

        })
        .catch(error => console.log('error', error));
    }

    useEffect(() => {
        getRole();
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "reviews/getReviews/" + params.id, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result) {
                setListReview(result);
                console.log(result);
            }
        })
        .catch(error => {
            console.log('error', error);
        })
    }, [params.id]);

    const RenderAReview = (id, student_id, assignment, done) => {
        const detailURL = '/classes/grade-reviews/detail/' + params.id + '/' + id
        return(
            <Card key={id} className="review mx-auto">
                <Card.Header as= "h2" className="head-center"> Grade Review {id} {done === 1 ? "(Finalized)" : ""}</Card.Header>
                <Card.Body>            
                    {/* <Card.Title> Abc </Card.Title> */}
                    <Card.Text> Grade composition: {assignment} </Card.Text> 
                    <Card.Text> Student ID: {student_id} </Card.Text>
                </Card.Body>
                <Card.Footer className="text-center">
                    <div className="footer-viewBtn text-center">
                        
                        <Link to={detailURL}> 
                        <button className="btn btn-success btnView">View</button>
                        </Link>
                    </div>
                </Card.Footer>

            </Card>
        )
    }


    return (
        <div>
            <Navbar bg="dark" variant="dark">
                    
                    {/* <button className="btn btn-success backbtn" onClick={this.props.backToList}> Back </button> */}
                <Navbar.Toggle /> 
                <Navbar.Collapse className="justify-content-end">
                <NavLink className="nav-link" to={detailURL} >
                    Detail
                </NavLink>
                <NavLink className="nav-link" to={memberURL}>
                    Member
                </NavLink>
                <NavLink className="nav-link" to={listAssignmentURL}>
                    Assignment
                </NavLink>
                <NavLink className="nav-link" to={gradesStructure} hidden={!(role === 'teacher')}>
                    Grades Management
                </NavLink>
                <NavLink className="nav-link" to='#'>
                    Grade Reviews
                </NavLink>
                </Navbar.Collapse>
            </Navbar>
            {listReview.map((row) => (
                RenderAReview(row.id, row.student_id, row.topic, row.done)
            ))}
            
        </div>
    )
}

export default ListReview;