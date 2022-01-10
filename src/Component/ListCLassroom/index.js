
import React, { useState } from 'react';
import './index.css';
import Classroom from '../Classroom';
import { Modal } from 'react-bootstrap';

const ListClassRoom = ({setTrigger, reloadTrigger}) => {
	const [inviteCode, setInviteCode] = React.useState("");
    const [arrayClassRoom, setArrayClassRoom] = useState([]);
    const [showJoinModel, setShowJoinModel] = React.useState(false);
    
    const listClassRoom = (listCls) => {
        return listCls.map((ele) => <Classroom key={ele.id} dataClass={ele}/>)
    }

    const acceptInviteCode = async(e) => {
        e.preventDefault();

        if (!inviteCode || inviteCode === "") {
            alert("Invite code cannot be empty!");
            return;
        } 

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "inviteCode": inviteCode
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch(process.env.REACT_APP_API_URL + "classes/acceptInviteCode", requestOptions)
        .then(response => response.json())
        .then(result => {
            alert(result);
            setTrigger();
        })
        .catch(error => {
            alert('error', error);
        });
    }

    React.useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_API_URL + "classes", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result) {
                setArrayClassRoom(result);
            }
        })
        .catch(error => {
            alert('error', error);
        });
    }, [reloadTrigger]);

    const onHandleJoinModalClose = () => setShowJoinModel(false);
	const onHandleJoinModalShow = () => setShowJoinModel(true);
	const codeOnChangeHandler = (e) => setInviteCode(e.target.value);         

    return (
        <div>
            <div className="align-right">
                <button className="btn btn-success" onClick={onHandleJoinModalShow}> Join Class </button>
            </div>
            <div className="p-3 pt-0 align-left">
                <div>
                    {listClassRoom(arrayClassRoom)}
                </div>
            </div>

            <Modal show={showJoinModel} onHide={onHandleJoinModalClose} >
                <Modal.Header>
                <Modal.Title>Join Classroom</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className='text-center'>
                    <label> Invite Code</label>
                    <div className="joinClassInput">
                        <input type="text" className="form-control" placeholder="Code..." onChange={codeOnChangeHandler} />
                    </div>
                </div>
                </Modal.Body>
                <Modal.Footer>
                <div className="text-center w-100">
                    <button type="button" className="btn btn-success addClassButton" onClick={acceptInviteCode}> Join </button>
                    <button className="btn btn-success addClassButton" onClick={onHandleJoinModalClose}> Close </button>
                </div>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default ListClassRoom;