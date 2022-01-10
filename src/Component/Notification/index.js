
import React from 'react';
import {Link} from 'react-router-dom';

export default function Notification (data) {
    return( 
        <Link to={data.data.link}>
        <div className="noti">       
            <div> <span className="name">{data.data.name}</span> {data.data.content} </div>
            <div className='time'> {data.data.time} </div>  
        </div>
        </Link>

    )
}