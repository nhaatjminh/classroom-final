import { Route, Routes } from 'react-router';
import React, { useState } from 'react'
import './App.css';
import Login from './Component/Login';
import Register from './Component/Register';
import DetailClass from './Component/DetailClass'
import AcceptLink from './Component/AcceptLink'
import MembersList from './Component/Members';
import TopNavBar from './Component/AppBar';
import Profile from './Component/Profile';
import ListAssignment from './Component/ListAssignment'
import Grades from './Component/Grades';
import AdminPage from './Component/AdminPage';
import MappingIDPage from './Component/MappingIDPage';
import ListReview from './Component/ListReview';
import DetailReview from './Component/Review';
import ManageClassAdminPage from './Component/ManageClassAdminPage';
import AdminAccountPage from './Component/AdminAccountPage';
import DetailAssignment from './Component/DetailAssignment';

function App() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("token") != null);
  const [reloadTrigger, setReloadTrigger] = React.useState(false);

  const onLogoutSuccess = () => {
    setIsLogin(false);
    localStorage.clear();
  }
  const onLoginSuccess = () => {
    setIsLogin(true);
  }

  const setTrigger = () => {
    setReloadTrigger(!reloadTrigger);
  }

  return  (
    <div>
      { isLogin ? <TopNavBar brandName={""} onLogoutSuccess={onLogoutSuccess} setTrigger={setTrigger}></TopNavBar> : 
      <div></div>}
    <Routes>
      <Route path='/' element={<Login onLoginSuccess={onLoginSuccess} setTrigger={setTrigger} reloadTrigger={reloadTrigger}/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/classes/detail/:id' element={<DetailClass/>}/>
      <Route path='/classes/detail/:id/assignment' element={<ListAssignment/>}/>
      <Route path='/classes/detail/:id/assignment/:idAss' element={<DetailAssignment/>}/>
      <Route path='/classes/members/:id' element={<MembersList/>}/>
      <Route path='/classes/acceptlink/:tokenlink' element={<AcceptLink/>}/>
      <Route path='/profile/:id' element={<Profile/>}/>
      <Route path='/grades/:id' element={<Grades/>}/>
      <Route path='/classes/grade-reviews/:id' element={<ListReview/>}/>
      <Route path='/classes/grade-reviews/detail/:idClass/:idReview' element={<DetailReview/>}/>
      <Route path='/admin' element={<AdminPage/>}/>
      <Route path='/mapID' element={<MappingIDPage/>}/>
      <Route path='/manageclass' element={<ManageClassAdminPage/>}/>
      <Route path='/adminaccount' element={<AdminAccountPage/>}/>
    </Routes>
    </div>
  );
}

export default App;