import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from "react-router-dom";
import './index.css'
import Notification from '../Notification';
import { Card } from "@material-ui/core";
import { Button } from "@mui/material";

export default function TopNavBar({ brandName, onLogoutSuccess, setTrigger }) {
	const [name, setName] = React.useState("");
  const [mail, setMail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [serverCode, setServerCode] = React.useState("");
  const [description, setDescription] = React.useState("");
	const [show, setShow] = React.useState(false);
  const [activeModelShow, setActiveModelShow] = React.useState(false);
  const [notiData, setNotiData] = React.useState([]); 
  const [isHiddenNotification, setIsHiddenNotification] = React.useState(true);
  const [url] = React.useState("/profile/" + localStorage.getItem("userId"));
  const [active] = React.useState(localStorage.getItem("mail"));
  const [enterMailStep, setEnterMailStep] = React.useState(true)

	let navigate = useNavigate();
  let location = useLocation();

  const setNoti = () => {
    if (notiData.length > 0) {
      return notiData.map((ele) => <Notification key={ele.id} data={ele}/>)
    }
  }

  const getVerifyCode = async(e) => {
		e.preventDefault();

    if (!mail || mail == "") {
      alert("You must enter your email address!");
      return;
    }
		var myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
		myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "mail": mail
    });

		var requestOptions = {
				method: 'POST',
        body: raw,
				headers: myHeaders,
				redirect: 'follow'
		};

		await fetch(process.env.REACT_APP_API_URL + "sendEmail/getVerifyCode", requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result) {
        console.log(result);
        setServerCode(result);
        setEnterMailStep(false);
        setCode("");
      }
    })
    .catch(error => {
        alert(error);
    })
  };

  const backStep = () => {
    setEnterMailStep(true);
    setMail("");
  } 

  const verifyActiveCode = async(e) => {
		e.preventDefault();

    if (code != serverCode) {
      alert("Wrong code!");
      return;
    }

		var myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
		myHeaders.append("Content-Type", "application/json");

		var raw = JSON.stringify({
      "mail": mail
    });

		var requestOptions = {
				method: 'POST',
        body: raw,
				headers: myHeaders,
				redirect: 'follow'
		};

		await fetch(process.env.REACT_APP_API_URL + "sendEmail/setMail", requestOptions)
    .then(response => response.json())
    .then(result => {
      if (result) {
        alert("Activated!");
        setCode("");
        setServerCode("");
        setMail("");
        onHandleActiveModalClose();
      }
    })
    .catch(error => {
        alert(error);
    })
  };
  
	const onSubmitHandler = async(e) => {
		e.preventDefault();

    if (!name || name === "") {
      alert("Class name cannot be empty!");
      return;
    }

		var myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
		myHeaders.append("Content-Type", "application/json");

		var raw = JSON.stringify({
			"name": name,
      "description": description
		});

		var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
		};

		await fetch(process.env.REACT_APP_API_URL + "classes", requestOptions)
			.then(response => {
					if (response.ok) {
              setTrigger();
							return response.json();
					}

					throw Error(response.status);
			})
			.catch(error => {
					alert(error);
			})
      .finally(() => {
        onHandleModalClose();
      });
	}

  const logout = () => {
    localStorage.removeItem("token");
    onLogoutSuccess();

    if (location.pathname !== "/") {
      navigate("/")
    }
    else {
      window.location.reload()
    }
  }

  React.useEffect(() => {
    var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "notification", requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result) {
            setNotiData(result);
          }
        })
        .catch(error => {
            console.log('error', error);
        });
  }, []);
  
	const nameOnChangeHandler = (e) => setName(e.target.value);
  const descriptionOnChangeHandler = (e) => setDescription(e.target.value);
	const onHandleModalClose = () => setShow(false);
	const onHandleModalShow = () => setShow(true);
  const onHandleProfileOnClick = () => { navigate(url); }
  const onHandleNotificationOnClick = () => { setIsHiddenNotification(!isHiddenNotification) }
  const onHandleGoHome = () => {navigate("/")}

  const codeOnChangeHandler = (e) => setCode(e.target.value);
  const mailOnChangeHandler = (e) => setMail(e.target.value);
	const onHandleActiveModalClose = () => setActiveModelShow(false);
  const onHandleActiveModalShow = () => {
    setActiveModelShow(true);
    setEnterMailStep(true);
    setMail("");
    setCode("");
  }
 
  const isAdmin = localStorage.getItem("isAdmin");
  return (
    <Box className="nav-bar" sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {!isAdmin ?
           <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> : ""}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {brandName}
          </Typography>
          {(active != 'null')? <div></div> : <Button className="btn btn-success" style={{ backgroundColor: 'blue', color: 'white'}} onClick={onHandleActiveModalShow}> Active Mail </Button> }
          {!isAdmin ? <div>  
            <IconButton
                size="large"
                aria-label="home"
                aria-controls="menu-appbar"
                color="inherit"
                onClick={onHandleGoHome}
                className="m-1">
                <HomeIcon />
              </IconButton>
              <IconButton
                size="large"
                aria-label="add classroom"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={onHandleModalShow}
                className="m-1">
                <AddIcon />
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                color="inherit"
                onClick={onHandleProfileOnClick}
                className="m-1">
                <AccountCircle/>
              </IconButton>
              <IconButton
              size="large"
              aria-label="notification"
              aria-controls="menu-appbar"
              color="inherit"
              onClick={onHandleNotificationOnClick}
              className="m-1">
              <NotificationsIcon />
            </IconButton>
              <IconButton
                size="large"
                aria-label="logout"
                aria-controls="menu-appbar"
                color="inherit"
                onClick={logout}
                className="m-1">
                <LogoutIcon/>
              </IconButton>
            </div> : 
            <div>  
              <IconButton
                size="large"
                aria-label="logout"
                aria-controls="menu-appbar"
                color="inherit"
                onClick={logout}
                className="m-1">
                <LogoutIcon/>
              </IconButton>
            </div>}
            
        </Toolbar>
      </AppBar>
      <Card className="notification-container" hidden={isHiddenNotification}>
        {setNoti()}
      </Card>
      <Modal show={show} onHide={onHandleModalClose}>
        <Modal.Header closeButton>
        <Modal.Title>Adding Classroom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
              <div className="addClassInput">
                  <input type="text" className="form-control" placeholder="New class name..." onChange={nameOnChangeHandler} />
              </div>
              <div className="addClassInput">
                  <input type="text" className="form-control" placeholder="Description..." onChange={descriptionOnChangeHandler} />
              </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
        <div className="text-center w-100">
          <button type="submit" className="btn btn-success addClassButton" onClick={onSubmitHandler}> Add Class </button>
          <button className="btn btn-success addClassButton" onClick={onHandleModalClose}> Close </button>
        </div>
        </Modal.Footer>
    </Modal>

    <Modal show={activeModelShow} onHide={onHandleActiveModalClose}>
        <Modal.Header closeButton>
        <Modal.Title>Verify Mail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
              {enterMailStep? 
              <div className="addClassInput">
                  <input type="email" className="form-control" value={mail} placeholder="Email..." onChange={mailOnChangeHandler} />
              </div>
              :
              <div className="addClassInput">
                  <input type="text" className="form-control" value={code} placeholder="Verify Code..." onChange={codeOnChangeHandler} />
              </div>
              }
          </div>
        </Modal.Body>
        <Modal.Footer>
          { enterMailStep?
            <div className="text-center w-100">
              <button className="btn btn-success addClassButton" onClick={getVerifyCode}> Next </button>
            </div>
            : 
            <div className="text-center w-100">
              <button type="button" className="btn btn-success addClassButton" onClick={verifyActiveCode}> Verify </button>
              <button className="btn btn-success addClassButton" onClick={getVerifyCode}> Resend </button>
              <button className="btn btn-success addClassButton" onClick={backStep}> Back </button>
          </div>
          }
        </Modal.Footer>
    </Modal>
    </Box>
  );
}