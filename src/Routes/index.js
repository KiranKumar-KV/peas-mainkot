import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./Components/assets/css/index.css";
import HomeItemSelect from "./Components/Containers/HomeItemSelect";
// import HomeItemSelectTakeaway from "./Components/Containers/HomeItemSelectTakeaway";
import TakeoutItemSelect from "./Components/Containers/TakeoutItemSelect";
import FoodMenu from "./Components/Containers/FoodMenu";
import OrderView from "./Components/Containers/Orderview";
import MenuView from "./Components/Containers/menuItemView";
import Dashboard from "./Components/Containers/HomeContents";
import MenuCreate from "./Components/Containers/AddMenuContainer";
import ManualEntry from "./Components/Containers/Manualentry";
import ManageCategory from "./Components/Containers/ViewCounter";
import HotelRooms from "./Components/Rooms/HCBody";
import RoomItemSelect from  "./Components/Rooms/RoomItemSelect";
import NotificationContainer from './Components/Containers/NotificationContainer';
import Expense from './Components/Containers/Expense';
import Login from "./Login";
import { ToastContainer, toast,Slide,Bounce,Zoom, Flip} from 'react-toastify';

import ChangeShift from "./Components/Containers/ChangeShift";
import DenominationCheck from './Components/Containers/DenominationCheck';
import DenominationReentry from './Components/Containers/DenominationReentry';
import RecoveryDenomination from './Components/Containers/RecoveryDenomination';

import 'react-toastify/dist/ReactToastify.css';

export default () => (
    <div>
    <BrowserRouter basename='/mainkot'>
        <Switch>
            <Route path="/" exact component={Login}/>
            <Route path="/home" 
            exact   render={(props) => <Dashboard type={'home'}{...props} isAuthed={true} />}/>
            <Route path="/roomitemselect" exact component={RoomItemSelect}/>
            <Route path="/itemselect"  exact component={HomeItemSelect}/>
            <Route path="/takeouts" 
             exact   render={(props) => <Dashboard type={'takeaway'}{...props} isAuthed={true} />}/>

            <Route path="/foodmenu" exact component={FoodMenu}/>
            <Route path="/orders" exact component={OrderView}/>
            <Route path="/menu" exact component={MenuView}/>
            <Route path="/menucreate" exact component={MenuCreate}/>
            <Route path="/barinventory" exact component={ManualEntry}/>
            <Route path="/hotelrooms" exact component={HotelRooms}/>
            <Route path="/note" exact component={ManageCategory}/>
            <Route path="/expense" exact component={Expense}/>

            <Route path='/changeshift' exact component  = {ChangeShift}/>
            <Route path='/denominationCheck' exact component = {DenominationCheck}/>
            <Route path='/denominationReentry' exact component = {DenominationReentry}/>
            <Route path='/recovery' exact component = {RecoveryDenomination}/>
        </Switch>
    </BrowserRouter>
        <NotificationContainer/>
                {/* <ToastContainer autoClose={false} newestOnTop={true} transition={Bounce}/> */}
    </div>
);
