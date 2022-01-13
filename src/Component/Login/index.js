import React, {useState} from "react";
import {Link} from 'react-router-dom'
import {Avatar, Button, Grid, Paper, TextField, Typography} from '@material-ui/core'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ListClassRoom from "../ListCLassroom";

import './index.css';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import AdminPage from "../AdminPage";
const Login = ({onLoginSuccess, setTrigger, reloadTrigger}) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    //const [showDialog, setShowDialog] = useState(false);
    const [isLogin, setIsLogin] = useState(localStorage.getItem("token") != null)

    const paperStyle = {
        padding: 20,
        height: '70vh',
        width: 300,
        margin: "20px auto"
    }
    const [isAdmin, setIsAdmin] = useState(false);
    const avatarStyle = {
        backgroundColor: '#1bbd7e'
    }

    const buttonStyle = {
        margin: '10px 0'
    }

    const handleOnchangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleOnchangePassword = (e) => {
        setPassword(e.target.value);
    }

    const responseFacebook = response => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id_token": response.accessToken
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };

        fetch(process.env.REACT_APP_API_URL + "auth/facebook-sign-in", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw Error(response.status);
            })
            .then(result => {
                localStorage.setItem("token", result.token);
                localStorage.setItem("userId", result.user.id);
                localStorage.setItem("studentID", result.user.studentID);
                if (!result.user.id || result.user.id != "") {
                    localStorage.setItem("", result.user.email);
                } else {
                    localStorage.setItem("mail", result.user.email);
                }

                setIsLogin(true);

                onLoginSuccess();
            })
            .catch(error => {
                console.log('error', error)
            });
    }

    const onSuccessGoogle = response => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id_token": response.tokenId
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };

        fetch(process.env.REACT_APP_API_URL + "auth/google-sign-in", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw Error(response.status);
            })
            .then(result => {
                localStorage.setItem("token", result.token);
                localStorage.setItem("userId", result.user.id);
                localStorage.setItem("studentID", result.user.studentID);
                if (!result.user.id || result.user.id != "") {
                    localStorage.setItem("", result.user.email);
                } else {
                    localStorage.setItem("mail", result.user.email);
                }

                setIsLogin(true);

                onLoginSuccess();
            })
            .catch(error => {
                console.log('error', error)
            });
    }
    
    const login = async () => {
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

        await fetch(process.env.REACT_APP_API_URL + "login", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw Error(response.status);
            })
            .then(result => {
                
                if (result.message) {
                    alert("Account Banned");
                }
                else if (result.type === 'admin') {
                    localStorage.setItem("isAdmin", true);
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("userId", result.user.id);
                    if (!result.user.id || result.user.id != "") {
                        localStorage.setItem("", result.user.email);
                    } else {
                        localStorage.setItem("mail", result.user.email);
                    }

                    setIsLogin(true);
                    setIsAdmin(true);
                    
                    onLoginSuccess();                  
                }
                else {
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("userId", result.user.id);
                    localStorage.setItem("studentID", result.user.studentID);
                    if (!result.user.id || result.user.id != "") {
                        localStorage.setItem("", result.user.email);
                    } else {
                        localStorage.setItem("mail", result.user.email);
                    }

                    setIsLogin(true);
                    
                    onLoginSuccess();
                }

                console.log(localStorage.getItem("mail"));
            })
            .catch(error => {
                alert("Incorrect username or password!");
            });
    }

    const onLogoutSuccess = () => {
        setIsLogin(false);
        setIsAdmin(false);
        localStorage.removeItem("isAdmin");
        window.location.pathname ='/'; 
        // window.location.reload();
        localStorage.clear();
    }
    const PostData = async (tokenLink, tokenAccount) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        await fetch(process.env.REACT_APP_API_URL + "classes/acceptlink/" + tokenLink + "/" + tokenAccount, requestOptions)
        .then(response => {
            response.json(); 
            localStorage.removeItem("tokenLink");
            
            window.location.pathname ='/';
            
        })
        .catch(error => {
            console.log('error', error);
        });
    }
    const AcceptClass = () => {
        let tokenLink = localStorage.getItem("tokenLink");
        if (tokenLink && isLogin) {
            let tokenAccount = localStorage.getItem("token")
            PostData(tokenLink, tokenAccount);
        }
    }
    AcceptClass();
    if (isAdmin) {
        console.log("ok");
        return (
            <AdminPage  onLogoutSuccess={onLogoutSuccess}/>
        )
    }
    else {
        return (
            <div>
            { isLogin ?
            
            <ListClassRoom key={isLogin} onLogoutSuccess={onLogoutSuccess} setTrigger={setTrigger} reloadTrigger={reloadTrigger}/> :

            <Grid>
                <Paper elevation={10} style ={paperStyle}>
                    <Grid align='center'>
                        <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
                        <h2>Sign In</h2>
                    </Grid>
                    <TextField name='username' label='Username' placeholder='Enter username' fullWidth required onChange={handleOnchangeUsername}/>
                    <TextField name='password' label='Password' placeholder='Enter password' type='password' fullWidth required onChange={handleOnchangePassword}/>
                    <Button type='button' style={buttonStyle} color='primary' variant='contained' fullWidth onClick={login}>Sign In</Button>
                    <Typography>
                        Don't have an account?
                        <Link to="/register"> Sign Up
                        </Link>
                    </Typography>
                    <Typography type="button" style={{color: "blue"}}>
                        Forgot password?
                    </Typography>
                    <FacebookLogin
                        appId="842222179779996"
                        fields="name,picture,email"
                        autoLoad = {false}
                        cssClass="btnFacebook"
                        textButton = "Sign In with Facebook"                                                                
                        callback={responseFacebook} />
                    <br></br>
                    < GoogleLogin
                        clientId="176406720657-kvkukhtjlamdlv6cnc1vg8qanluodo33.apps.googleusercontent.com"
                        buttonText="Sign In with Google"
                        onSuccess={onSuccessGoogle}
                        isSignedIn={false}
                        className="btnGoogle"
                    />
                </Paper>
                {/* <Modal show={showDialog} onHide={onHandleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Forgot password</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={onSubmitHandler}>
                                <strong style={{ fontSize: 17 }}> Send invitation by email </strong>
                                <div className='d-flex mt-2'>
                                    <FormControl style={{width: "20%", margin: 5, marginTop: 12}}>
                                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                                        <Select sx={{ height: "40px"}}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={roleInvite}
                                            label="Role"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={"student"}>Student</MenuItem>
                                            <MenuItem value={"teacher"}>Teacher</MenuItem>
                                        </Select>
                                    </FormControl>
                                        <div className='pt-2' style={{ flexGrow: 1, margin: 5 }} >
                                            <input type="text" style={{ height:40 }} name="name" className="form-control" placeholder="Email..." onChange={onChangeHandler} />
                                        </div>
                                        <div className='pt-2' style={{ margin: 5 }} >
                                            <button type="submit" className="btn btn-success"> <SendIcon/> </button>
                                        </div>
                                </div>
                            </form>
                        </Modal.Body>
                        
                    </Modal> */}
            </Grid>
            
            }
            
            </div>
        );
    }
}

export default Login;