import React, { Component } from "react";
import { ToastContainer, toast,Slide,Bounce,Zoom, Flip} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {kotAdd} from '../../../kotAdd';

class NotificationContainer extends Component{
     componentWillMount()
    {
        kotAdd((err, message) => {
            if(message === null)
            {

            }
            else
            {
                if(message.message === 'waiter requested')
                {
                    let msg = 'Table No.'+message.table_number+' requested waiter. Please Inform waiter '+message.employee_name;
                    this.notify(msg)
                }
                else if(message.message === 'Bill Requested')
                {
                    let msg = 'Table No.'+message.table_number+' requested Bill.';
                    this.notify(msg)
                }
                  else if(message.message === 'orderd'){
                //   this.get();
                }
                else
                {

                }

            }
        })
        // this.get();
    }
  
    notify(message){
        const Msg = ({ closeToast }) => (
            <div style={{fontSize:'16px'}}>
                {message}<br/>
                <button className='btn btn-default' onClick={closeToast}>OK</button>
            </div>
        )
        toast.info(<Msg/>)
    }
    render(){
        return(
            <div>
                <ToastContainer autoClose={false} newestOnTop={true} transition={Bounce}/>                
            </div>
        )
    }
}

export default NotificationContainer;