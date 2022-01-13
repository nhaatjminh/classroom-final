
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from "react-router-dom";
import {  Stack, Box } from '@mui/material';
import { Form, Modal, Row, Col  } from 'react-bootstrap';
import { Card, Navbar} from 'react-bootstrap';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as XLSX from 'xlsx';
import AsyncDownloadButton from '../AsyncDownloadButton';

const DetailAssignment = () => {
    let navigate = useNavigate();

    const params = useParams();
    const [topic, setTopic] = useState("");
    const [grade, setGrade] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [finished, setFinished] = useState("");
    const [point, setPoint] = useState("");
    const [role, setRole] = useState();

    //update
    const [show, setShow] = useState(false);
    const [topicUpdate, setTopicUpdate] = useState("");
    const [gradeUpdate, setGradeUpdate] = useState("");
    const [descriptionUpdate, setDescriptionUpdate] = useState("");
    const [minusUpdate, setMinusUpdate] = useState("0");
    const [hourUpdate, setHourUpdate] = useState("0");
    const [dayUpdate, setDayUpdate] = useState("1");
    const [monthUpdate, setMonthUpdate] = useState("1");
    const [yearUpdate, setYearUpdate] = useState("2020");

    // upload file
    const [uploadModalShow, setUploadModalShow] = useState(false);
    const [fileData, setFileData] = useState("student");

    // review -- for student
    const [reviewModalShow, setReviewModalShow] = useState(false);
    const [expectGrade, setExpectGrade] = useState();
    const [explanation, setExplanation] = useState();

    const topicOnChangeHandler = (e) => setTopicUpdate(e.target.value);
    const gradeOnChangeHandler = (e) => setGradeUpdate(e.target.value);
    const descriptionOnChangeHandler = (e) => setDescriptionUpdate(e.target.value);
    const minusOnChangeHandler = (e) => setMinusUpdate(e.target.value);
    const hourOnChangeHandler = (e) => setHourUpdate(e.target.value);
    const dayOnChangeHandler = (e) => setDayUpdate(e.target.value);
    const monthOnChangeHandler = (e) => setMonthUpdate(e.target.value);
    const yearOnChangeHandler = (e) => setYearUpdate(e.target.value);
    const onHandleModalClose = () => setShow(false);
	const onHandleModalShow = () => setShow(true);
    const onHandleUploadModalClose = () => setUploadModalShow(false);
	const onHandleUploadModalShow = () => setUploadModalShow(true);
    const onHandleReviewModalShow = () => setReviewModalShow(true);
    const onHandleReviewModalClose = () => setReviewModalShow(false);
    const expectGradeOnChangeHandler = (e) => setExpectGrade(e.target.value);
    const explanationOnChangeHandler = (e) => setExplanation(e.target.value);

    useEffect(() => {
        getRole();
        getData();
        getGradeForStudent(params.idAss, localStorage.getItem("studentID"));
    }, []);

    // get data
    const getData = () => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "assignment/" + params.id + "/" + params.idAss, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result) {
                setTopic(result.topic);
                setTopicUpdate(result.topic);
                setGrade(result.grade);
                setGradeUpdate(result.grade);
                setDescription(result.description);
                setDescriptionUpdate(result.description);
                setDeadline(result.deadline);
                setFinished(result.finished);
            }
        })
        .catch(error => {
            console.log('error', error);
        })
    }

    //get role
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


    const getNumberOptionForCombobox = (from, to) => {
        let options = [];
        for (let i = from; i <= to; i++) {
            options.push(<option value={i}>{i}</option>);
        }
        return options;
    }
    
    // update assignment
    const updateAssignment = (e) => {
        e.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "topic": topicUpdate,
            "description": descriptionUpdate,
            "deadline": minusUpdate + ":" + hourUpdate + " " + dayUpdate + "-" + monthUpdate + "-" + yearUpdate,
            "grade": gradeUpdate
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "assignment/update/" + params.id + "/" + params.idAss, requestOptions)
        .then(response => response.json())
        .then(result => {
            //onUpdateSuccess();
            alert("Assignment Updated!");
            setTopic(topicUpdate);
            setDescription(descriptionUpdate);
            setGrade(gradeUpdate);
            onHandleModalClose();
        })
        .catch(error => console.log('error', error));
    }

    //delete assignment
    const deleteAssignment = (e) => {
        e.preventDefault();

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "assignment/delete/" + params.id + "/" + params.idAss, requestOptions)
        .then(response =>  {
            return response.text();
        })
        .then(result => {
            alert("Assignment Deleted!");
            let url = ("/classes/detail/" + params.id + "/assignment");
            navigate(url);
        })
        .catch(error => {
            alert("An error occur");
        });
    }

    // upload
    const uploadFile = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "listGrades": fileData
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "grades/uploadGrades/" + params.id + "/" + params.idAss, requestOptions)
        .then(response => response.json())
        .then(result => {
            alert(result.message);
            setUploadModalShow(false)
        })
        .catch(error => console.log('error', error));
    }

    const fileOnChangeHandler = (e) => {
        let file = e.target.files[0];

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => { 
            const bstr = e.target.result;

            const wb = XLSX.read(bstr, {type:'binary'});

            const wsname = wb.SheetNames[0];

            const ws = wb.Sheets[wsname];

            let headers = {};
            let data = [];  

            for(let i in ws) {
                if(i[0] === '!') continue;

                let col = i.substring(0,1);
                let row = parseInt(i.substring(1));
                let value = ws[i].v;

                if(row === 1) {
                    if (value === "Student ID") {
                        headers[col] = "id";
                    } else if (value === "Grade"){
                        headers[col] = "grade";
                    } else {
                        headers[col] = value.toLowerCase();
                    }
                    continue;
                }

                if(!data[row]) data[row]={};
                data[row][headers[col]] = value;
            }

            data.shift();
            data.shift();
            setFileData(Array.from(data));
            uploadFile();
        };
    };

    // get grade for student
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
                }
            })
        .catch(error => console.log('error', error));
    }

    //request review 
    const sendReviewRequest = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
            "assign_id": params.idAss,
            "expect_grade": expectGrade,
            "explanation": explanation,
            "current_grade": point,
            "id_class": params.id
        });
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        
        fetch(process.env.REACT_APP_API_URL + "reviews/create", requestOptions)
            .then(response => response.text())
            .then(result => {
                alert(result.message());
                onHandleReviewModalClose();
            })
            .catch(error => {
                alert("Request fail!");
                onHandleReviewModalClose();
            });
    }

    const onHandleMarkFin = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");
        
        var requestOptions = {
            headers: myHeaders,
            redirect: 'follow'
        };
        
        fetch(process.env.REACT_APP_API_URL + "/markFinalAss/" + params.id + "/" + params.idAss, requestOptions)
            .then(response => { 
                if (response.ok) {
                    alert("Mark success!");
                    setFinished(1);
                } else {
                    alert("Mark fail!");
                }
            }) 
    }

    // url
    const listAssignmentURL = '/classes/detail/' + params.id + "/assignment";
    const detailURL = '/classes/detail/' + params.id;
    const memberURL = '/classes/members/' + params.id;
    const gradesStructure = '/grades/' + params.id;
    const gradeReviews = '/classes/grade-reviews/' + params.id;

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
                <NavLink className="nav-link" to={gradeReviews}>
                    Grade Reviews
                </NavLink>
                </Navbar.Collapse>
            </Navbar>
        
        <Stack alignItems="center">
            <Box sx={{ border: "1px solid #5c5850", borderRadius:2, p:0, margin: 2  }}> 
                <Card variant="outlined" style={{border: "1px solid #5c5850 !important", minWidth: '800px'}}>
                    <CardContent sx={{ mb:0 }}>
                        <Typography gutterBottom variant="h3" color="orangered">
                            {topic}
                        </Typography>
                        <Stack direction="row">
                            {role === 'teacher' ?
                                <Typography gutterBottom>
                                    Point: {grade}
                                </Typography>
                             :
                                <Typography gutterBottom>
                                    Grade: {finished? point:"--"}
                                </Typography>
                             }
                            <Typography gutterBottom align="right" sx={{flexGrow:1}}>
                                Deadline: {deadline}
                            </Typography>
                        </Stack>
    
                        <hr/>
                            <Typography variant="body2" color="text.secondary">
                                {description}
                            </Typography>
                            <hr/>
                    </CardContent>
                    <CardActions sx={{mt:0, mb:1, ml:1}} hidden={role !== 'teacher'}>
                        <Button size="small" variant="contained" color="success" disabled={finished == 1} onClick={onHandleModalShow}>Update</Button>
                        <Button size="small" variant="contained" color="success" disabled={finished == 1} onClick={deleteAssignment}>Delete</Button>
                        <Button size="small" variant="contained" color="success">
                            <AsyncDownloadButton assignId = {params.idAss}/>
                        </Button>
                        <Button size="small" variant="contained" color="success" disabled={finished == 1} onClick={onHandleUploadModalShow}>Upload grades</Button>
                        <Button size="small" variant="contained" color="success" sx={{ml:1}} href="/Template/grades_assignment_template.xlsx">Donwload Template</Button>
                        <Button size="small" variant="contained" color="success" disabled={finished == 1} onClick={onHandleMarkFin}>Mark as Finish</Button>
                    </CardActions>
                    <CardActions sx={{mt:0, mb:1, ml:1}} hidden={role !== 'student'}>
                        <Button size="small" variant="contained" color="success" disabled={finished == 0} onClick={onHandleReviewModalShow}>Request a grade review</Button>
                    </CardActions>
                </Card>
            </Box>

        <Modal show={show} onHide={onHandleModalClose} dialogClassName="modal-70w">
            <Modal.Header closeButton>
            <Modal.Title>Update Assignment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col sm={10}>
                            <Form.Group className="mb-3">
                                <Form.Label> Topic </Form.Label>
                                <Form.Control type="text" defaultValue={topicUpdate} 
                                            onChange={topicOnChangeHandler} />
                            </Form.Group>
                        </Col>
                        <Col sm={2}>
                        <Form.Group className="mb-3">
                            <Form.Label> Grade </Form.Label>
                            <Form.Control type="number" defaultValue={gradeUpdate}
                                        onChange={gradeOnChangeHandler} />
                        </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label> Description </Form.Label>
                        <Form.Control as="textarea" defaultValue={descriptionUpdate}
                                    style={{ height: '100px' }}
                                    onChange={descriptionOnChangeHandler} />
                    </Form.Group>

                    <Row>
                        <Col sm={2}>
                            <Form.Group className="mb-3">
                                <Form.Label> Minus </Form.Label>
                                <Form.Select onChange={minusOnChangeHandler}>
                                    {getNumberOptionForCombobox(0, 60)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={2}>
                            <Form.Group className="mb-3">
                                <Form.Label> Hour </Form.Label>
                                <Form.Select onChange={hourOnChangeHandler}>
                                    {getNumberOptionForCombobox(0, 24)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={1}></Col>
                        <Col sm={2}>
                            <Form.Group className="mb-3">
                                <Form.Label> Day </Form.Label>
                                <Form.Select onChange={dayOnChangeHandler}>
                                    {getNumberOptionForCombobox(1, 31)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={2}>
                            <Form.Group className="mb-3">
                                <Form.Label> Month </Form.Label>
                                <Form.Select onChange={monthOnChangeHandler}>
                                    {getNumberOptionForCombobox(1, 12)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group className="mb-3">
                                <Form.Label> Year </Form.Label>
                                <Form.Select onChange={yearOnChangeHandler}>
                                    {getNumberOptionForCombobox(2020, 2040)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <div className="footer-createAssignBtn text-center">
                    <button className="btn btn-dark btnCreateAssign" onClick={updateAssignment}> Update </button>
                </div>
            </Modal.Footer>
        </Modal>

        <Modal show={uploadModalShow} onHide={onHandleUploadModalClose}>
            <Modal.Header closeButton>
            <Modal.Title> Upload Student List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label> File </Form.Label>
                    <Form.Control type="file" 
                            onChange={fileOnChangeHandler}/>
                </Form.Group>

            </Modal.Body>
            <Modal.Footer>
                <div className="footer-createAssignBtn text-center">
                    <button className="btn btn-dark btnCreateAssign" onClick={uploadFile}> Upload </button>
                    <button className="btn btn-success addClassButton" onClick={onHandleUploadModalClose}> Close </button>
                </div>
            </Modal.Footer>
        </Modal>

        <Modal show={reviewModalShow} onHide={onHandleReviewModalClose} dialogClassName="modal-70w">
                <Modal.Header closeButton>
                <Modal.Title>Request a grade review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col sm={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label> Topic: {topic} </Form.Label>
                                </Form.Group>
                            </Col>
                            <Col sm={4}>
                            <Form.Group className="mb-3">
                                <Form.Label> Expectation grade </Form.Label>
                                <Form.Control type="number"
                                            onChange={expectGradeOnChangeHandler} />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label> Explanation </Form.Label>
                            <Form.Control as="textarea"
                                        style={{ height: '100px' }}
                                        onChange={explanationOnChangeHandler} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="footer-createAssignBtn text-center">
                        <button className="btn btn-dark btnCreateAssign" onClick={sendReviewRequest}> Send Request </button>
                    </div>
                </Modal.Footer>
        </Modal>

        </Stack>

        </div>
    )
}

export default DetailAssignment;