import React, { useState, useEffect } from "react";
import {  Navbar, Card } from 'react-bootstrap';
import { NavLink, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import './index.css';

const DetailReview = () => {
    const params = useParams();
    const listAssignmentURL = '/classes/detail/' + params.idClass + "/assignment";
    const detailURL = '/classes/detail/' + params.idClass;
    const memberURL = '/classes/members/' + params.idClass;
    const gradesStructure = '/grades/' + params.idClass;
    const gradeReviews = '/classes/grade-reviews/' + params.idClass;

    const [role, setRole] = useState();
    const [data, setData] = useState({
        id: null,
        assign_id: null,
        topic: null,
        student_id: null,
        current_grade: null,
        expect_grade: null,
        explanation: null
    });
    const [update_grade, setUpdateGrade] = useState('');
    const [done, setDone] = useState(0);
    const [listCmt, setListCmt] = useState([]);
    const [cmtContent, setCmtContent] = useState('');
    const [name, setName] = useState('');
    
    const getRole = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "classId": params.idClass
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "accounts/role/" + localStorage.getItem("userId"), requestOptions)
        .then(response => response.json())
        .then(result => {
            setRole(result[0].role)

        })
        .catch(error => console.log('error', error));
    }

    const getData = () => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "reviews/detail/" + params.idReview, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result) {
                setData({
                    id: result[0].id,
                    assign_id: result[0].assign_id,
                    topic: result[0].topic,
                    student_id: result[0].student_id,
                    current_grade: result[0].current_grade,
                    expect_grade: result[0].expect_grade,
                    explanation: result[0].explanation
                });
                if (result[0].done) {
                    setDone(result[0].done)
                }
                if (result[0].update_grade) {
                    setUpdateGrade(result[0].update_grade);
                }
            }
        })
        .catch(error => {
            console.log('error', error);
        })
    }

    const getCmts = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        
        fetch(process.env.REACT_APP_API_URL + "reviews/comments/" + params.idReview, requestOptions)
          .then(response => response.json())
          .then(result => {
              setListCmt(result);
          })
          .catch(error => console.log('error', error));
    }

    const RenderCmts = (id, name, content) => {
        return (
            <ListItem key={id} alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar><PersonIcon/></Avatar>
                </ListItemAvatar>
                <ListItemText
                primary={
                    <h6>{name}</h6>
                } 
                secondary={
                    <React.Fragment>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        {content}
                    </Typography>
                    </React.Fragment>
                }
                />
            </ListItem>
        )
    }

    const getUserInfo = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        
        fetch(process.env.REACT_APP_API_URL + "accounts/detail/" + localStorage.getItem("userId"), requestOptions)
          .then(response => response.json())
          .then(result => {
              setName(result.account[0].name);
          })
          .catch(error => console.log('error', error));
    }

    useEffect(() => {
        getRole();
        getData();
        getCmts();
        getUserInfo();   
    }, [params.id]);

    const updateGrade = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "update_grade": update_grade,
            "studentId": data.student_id,
            "assignment_id": data.assign_id
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "reviews/update/" + params.idClass + "/" + params.idReview, requestOptions)
        .then(response => response.text())
        .then(result => {
            alert("Update grade successfully!")
        })
        .catch(error => {
            alert("Update fail!")
        });
    }

    const addCmt = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
          "review_id": params.idReview,
          "content": cmtContent,
          "role": role
        });

        let id = 0;
        if (listCmt.length > 0) {
            id = listCmt.at(-1).id + 1
        }
        var newCmt = {
            id: id,
            name: name,
            content: cmtContent
        }
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch(process.env.REACT_APP_API_URL + "reviews/addCmt", requestOptions)
          .then(response => response.json())
          .then(result => {
            var newList = listCmt.slice();
            newList.push(newCmt);
            setListCmt(newList);
            setCmtContent('');
            })
          .catch(error => console.log('error', error));
    }

    const markFinal = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify({
          "id_review": params.idReview,
          "studentId": data.student_id,
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch(process.env.REACT_APP_API_URL + "reviews/markFinal/" + params.idClass, requestOptions)
          .then(response => response.json())
          .then(result => {
            alert("Mark final done!")
            setDone(1);
            })
          .catch(error => console.log('error', error));
    }

    const onChangeHandler = (e) => setUpdateGrade(e.target.value);
    const onCmtChangeHandler = (e) => setCmtContent(e.target.value);

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
            <Card className="review mx-auto">
                <Card.Header as= "h2" className="head-center"> Grade Review {data.id} {done === 1 ? "(Finalized)" : ""} </Card.Header>
                <Card.Body>            
                    {/* <Card.Title> Abc </Card.Title> */}
                    <Card.Text> Grade composition: {data.topic} </Card.Text> 
                    <Card.Text> Student ID: {data.student_id} </Card.Text>
                    <Card.Text> Current grade: {data.current_grade} </Card.Text>
                    <Card.Text> Expect grade: {data.expect_grade} </Card.Text>
                    <Card.Text> Explanation: {data.explanation} </Card.Text>
                    
                    {role === 'teacher' ? 
                    <div>
                    <TextField
                            id="outlined-number"
                            label="Update grade"
                            type="number"
                            className="inputGrade "
                            value={update_grade}
                            onChange={onChangeHandler}
                            InputProps={{
                                inputProps: { 
                                    max: 10, min: 0,
                                }
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                    />
                    <button className="btn btn-success btnUpdate"
                        hidden={done === 1}
                        onClick={updateGrade}>
                        Update grade
                    </button>
                    </div>
                    : 
                    <Card.Text> Update grade: {update_grade ? update_grade : "--"} </Card.Text>}
                    

                </Card.Body>
                <Card.Footer className="text-center" hidden={!(role === 'teacher') || done === 1}>
                    <div className="footer-viewBtn text-center">
                        
                    </div>
                    <div className="footer-viewBtn text-center">
                        <button className="btn btn-success btnView" 
                        onClick={markFinal}>
                        Mark as final
                        </button>
                    </div>
                </Card.Footer>
                <hr/>
                <div className="cmtLabel">Comments</div>
                {/* <Typography className="" >Comments</Typography> */}
                <Card.Body>
                    {listCmt.map((ele) => RenderCmts(ele.id, ele.name, ele.content))}
                    
                    <hr/>
                    <Box sx={{ '& > :not(style)': { m: 1 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <Input
                            id="input-with-icon-adornment"
                            fullWidth
                            placeholder="Add a comment"
                            onChange={onCmtChangeHandler}
                            value={cmtContent}
                            endAdornment={
                                <InputAdornment position="end">
                                    <SendIcon type="button" onClick={addCmt} edge="end"/>
                                </InputAdornment>
                            }
                            />
                        </Box>
                    </Box>
                </Card.Body>

            </Card>
            
        </div>
    )
}

export default DetailReview;