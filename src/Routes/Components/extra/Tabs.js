import React, { Component } from "react";
import { Col } from "react-bootstrap";
import Tab from "./Tab";
import { th } from "react-icons-kit/fa/th";
import { listUl } from "react-icons-kit/fa/listUl";
import { bell } from "react-icons-kit/fa/bell";
import {table} from 'react-icons-kit/icomoon/table'
import {ic_restaurant_menu} from 'react-icons-kit/md/ic_restaurant_menu'
import { cutlery } from "react-icons-kit/fa/cutlery";
import {ic_playlist_add} from 'react-icons-kit/md/ic_playlist_add'
import {ic_add_circle_outline} from 'react-icons-kit/md/ic_add_circle_outline'
import {archive} from 'react-icons-kit/feather/archive';
import {glass} from 'react-icons-kit/fa/glass'
import {bed} from 'react-icons-kit/fa/bed';
import {pencil} from 'react-icons-kit/icomoon/pencil';
import {rupee} from 'react-icons-kit/fa/rupee'
import {ic_account_balance_wallet} from 'react-icons-kit/md/ic_account_balance_wallet'
import {wallet} from 'react-icons-kit/entypo/wallet'
export default class Tabs extends Component {
    render() {
        return (
            <div>
                <Col sm={1} className="tabSidebar">
                    <div className="tabSegments">
                    
                        <Tab label={th} path="home" name="home"/>
                        <Tab label={cutlery} path="takeouts" name="order takeout"/>
                        <Tab label={listUl} path="foodmenu" name="item available or not"/>
                        <Tab label={table} path="orders" name="old order"/>
                        {/* <label className="tabfonts">Orders</label> */}
                        <Tab label={ic_restaurant_menu} path="menu" name="menu selection"/>
                        {/* <label className="tabfonts">Edit Menu</label> */}
                        <Tab label={ic_add_circle_outline} path="menucreate" name="menu division"/>
                        <Tab label={glass} path="barinventory" name="bar inventory"/>
                        {/* <label className="tabfonts">New Menu</label> */}
                        {<Tab label={pencil} path="note" name="add note"/> }
                        {<Tab label={bed} path="hotelrooms" name="order to room"/> }
                        {<Tab label={wallet} path="expense" name="expense"/>}
                        {/* <Tab label={bell} path="notifications" /> */}

                    </div>
                </Col>
            </div>
        );
    }
}
