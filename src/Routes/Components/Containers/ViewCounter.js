import React, { Component } from "react";
import "../../datatables/datatables.css";
import { Modal, Button, Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Axios from 'axios';
import { Link } from 'react-router-dom';
// import Userplus from 'react-icons/lib/fa/plus-circle';
import { plusCircle } from 'react-icons-kit/fa/plusCircle'
import { Icon } from "react-icons-kit";
import SweetAlert from 'react-bootstrap-sweetalert';
import CaterorySwitch from './CategorySwitch';
// import Edit from 'react-icons/lib/fa/edit';
// import Close from 'react-icons/lib/fa/close';
import ReactTable from "react-table";
import "react-table/react-table.css";
import Header from "../Headers/Header";
import { Grid, Row, Col } from "react-bootstrap";
import Tabs from "../extra/Tabs";
import { pencil } from "react-icons-kit/icomoon/pencil";
const API_URL = process.env.REACT_APP_API_URL;
//const token = sessionStorage.getItem('token');

class ManageCategory extends Component {
    constructor(props) {
        super(props)
        this.handleCounterChange = this.handleCounterChange.bind(this)
        this.handleCounterSubmit = this.handleCounterSubmit.bind(this)
        this.handleShowNew = this.handleShowNew.bind(this);
        this.handleCloseNew = this.handleCloseNew.bind(this);
        this.handleCounter = this.handleCounter.bind(this);
        this.closeCounter = this.closeCounter.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.editCounterChange = this.editCounterChange.bind(this)
        this.handleEditCounterSubmit = this.handleEditCounterSubmit.bind(this)
        this.handleNoteChange = this.handleNoteChange.bind(this)
        this.handleNoteSubmit = this.handleNoteSubmit.bind(this)
        this.hadleNoteShow = this.hadleNoteShow.bind(this)
        this.editNoteChange = this.editNoteChange.bind(this)
        this.handleEditNoteSumbit = this.handleEditNoteSumbit.bind(this)


        this.state = {
            showCounter: false,
            editModal: false,
            editNoteModal: false,
            searchnote: '',
            show: false,
            showNew: false,
            countername: {
                value: '',
                valid: false
            },
            notename: {
                value: '',
                valid: false
            },
            search: '',
            counterResult: [],
            noteResult: [],
            counter_id: "",
            note_id: "",
            editcounter: {
                value: '',
                valid: false
            },
            editnote: {
                value: '',
                valid: false
            },
            alert_message: "",
            alert_state_success: false,
            alert_state_warning: false,
            alert_state_danger: false,
            tab: "counter"
        }
    }

    componentDidMount() {
        this.getCounter()
        this.getNote()

    }

    getCounter = async () => {
        let responseResult = await Axios.get(API_URL + '/hms/admin/get-counter')
        this.setState({
            counterResult: responseResult.data
        })
    }


    handleShowNew = () => {
        this.setState({ showNew: true })
    }
    handleCloseNew = () => {
        this.setState({ showCounter: false });
    }

    handleClose() {
        this.setState({ editModal: false });
    }

    handEditCounterClose = () => {
        this.setState({ editModal: false });
    }

    hadnleEditModalClose = () => {
        this.setState({ editNoteModal: false });
    }

    hadnleEditModalCloseButton = () => {
        this.setState({ editNoteModal: false });
    }

    handleAddNoteClose = () => {
        this.setState({
            showNew: false,
            notename: {
                value: '',
                valid: false
            },
        });
    }
    handleAddNoteCloseButton = () => {
        this.setState({
            showNew: false,
            notename: {
                value: '',
                valid: false
            },
        });
    }

    handleCounterChange = (e) => {
        let valid = false
        let value = e.target.value;
        switch (e.target.id) {
            case 'countername':

                if (/^[A-Za-z]+$/.test(value)) {
                    valid = true;
                } else {
                    valid = false;
                }
                break;
            default: valid = false;
        }
        this.setState({
            [e.target.id]: {
                value,
                valid
            }
        });

    }

    handleCounterSubmit = async (e) => {

        let cname = this.state.countername.value

        try {
            let result = await Axios.post(API_URL + '/hms/admin/add-kitchen-counter', { data: cname })

            if (result.status === 200) {
                this.setState({
                    alert_message: "Counter Information added successfully.!",
                    alert_state_success: true,
                    showCounter: false,
                    countername: {
                        value: '',
                        valid: false
                    },
                })
                this.getCounter();

            }
        } catch (error) {
            if (error.response.status === 409) {
                this.setState({
                    alert_message: "The Record is already been existed.!",
                    alert_state_warning: true,
                    showCounter: false,
                    countername: {
                        value: '',
                        valid: false
                    },
                })
                this.getCounter();
            } else {
                if (error.response.status === 500) {
                    this.setState({
                        alert_message: "oops something went wrong.!",
                        alert_state_danger: true,
                        showCounter: false,
                        countername: {
                            value: '',
                            valid: false
                        },
                    })
                }
            }
        }
    }

    handleShow = async (id) => {

        this.setState({
            editModal: true,
        })
        let responseResult = await Axios.get(API_URL + '/hms/admin/get-counter-by-id/' + id)
        this.setState({
            editcounter: {
                value: responseResult.data[0].counter_name,
                valid: true
            },
            counter_id: id

        })

    }

    editCounterChange = (e) => {
        let valid = false
        let value = e.target.value;
        switch (e.target.id) {
            case 'editcounter':
                if (/^[A-Za-z]+$/.test(value)) {
                    valid = true;
                } else {
                    valid = false;
                }
                break;
            default: valid = false;
        }
        this.setState({
            [e.target.id]: {
                value,
                valid
            }
        });

    }

    handleEditCounterSubmit = async () => {
        let new_counter_name = this.state.editcounter.value
        let id = this.state.counter_id
        try {
            let result = await Axios.put(API_URL + '/hms/admin/update-counter/' + id, { data: new_counter_name })
            if (result) {
                if (result.status === 200) {
                    this.setState({
                        alert_message: "Counter Information updated successfully.!",
                        alert_state_success: true,
                        editCounter: false
                    })
                    this.getCounter();
                }
            }
        } catch (error) {
            if (error.response.status === 409) {
                this.setState({
                    alert_message: "The Record is already been existed.!",
                    alert_state_warning: true,
                    editModal: false
                })
                this.getCounter();
            } else {
                if (error.response.status === 500) {
                    this.setState({
                        alert_message: "oops something went wrong.!",
                        alert_state_danger: true,
                        editModal: false
                    })
                }
            }
        }
    }


    /* note api end point calls */

    handleNoteChange = (e) => {

        let valid = false
        let value = e.target.value;
        switch (e.target.id) {

            case 'notename':
                if (value.length > 0) {
                    valid = true;
                } else {
                    valid = false;
                }
                break;
            default: valid = false;
        }
        this.setState({
            [e.target.id]: {
                value,
                valid
            }
        });

    }
    handleNoteSubmit = async (e) => {

        let note_name = this.state.notename.value

        try {
            let result = await Axios.post(API_URL + '/hms/admin/add-note', { data: note_name })

            if (result.status === 200) {
                this.setState({
                    alert_message: "Counter Information added successfully.!",
                    alert_state_success: true,
                    showNew: false,
                    notename: {
                        value: '',
                        valid: false
                    },
                })
                this.getNote();

            }
        } catch (error) {
            if (error.response.status === 409) {
                this.setState({
                    alert_message: "The Record is already been existed.!",
                    alert_state_warning: true,
                    showNew: false,
                    notename: {
                        value: '',
                        valid: false
                    },
                })
                this.getNote();
            } else {
                if (error.response.status === 500) {
                    this.setState({
                        alert_message: "oops something went wrong.!",
                        alert_state_danger: true,
                        showNew: false,
                        notename: {
                            value: '',
                            valid: false
                        },
                    })
                }
            }
        }
    }

    /**get the note details */
    getNote = async () => {
        let responseResult = await Axios.get(API_URL + '/hms/admin/get-note')

        this.setState({
            noteResult: responseResult.data
        })
    }

    hadleNoteShow = async (id) => {
        await this.setState({
            editNoteModal: true,
        })
        let responseResult = await Axios.get(API_URL + '/hms/admin/get-note-by-id/' + id)
        this.setState({
            editnote: {
                value: responseResult.data[0].note_name,
                valid: true
            },
            note_id: id

        })
    }
    editNoteChange = (e) => {
        let valid = false
        let value = e.target.value;
        switch (e.target.id) {
            case 'editnote':
                if (value.length>0) {
                    valid = true;
                } else {
                    valid = false;
                }
                break;
            default: valid = false;
        }
        this.setState({
            [e.target.id]: {
                value,
                valid
            }
        });
    }

    handleEditNoteSumbit = async () => {
        let new_note_name = this.state.editnote.value
        let id = this.state.note_id
        try {
            let result = await Axios.put(API_URL + '/hms/admin/update-note/' + id, { data: new_note_name })
            if (result) {
                if (result.status === 200) {
                    this.setState({
                        alert_message: "Counter Information updated successfully.!",
                        alert_state_success: true,
                        editNoteModal: false,
                        notename: {
                            value: '',
                            valid: false
                        },
                    })
                    this.getNote();
                }
            }
        } catch (error) {
            if (error.response.status === 409) {
                this.setState({
                    alert_message: "The Record is already been existed.!",
                    alert_state_warning: true,
                    editNoteModal: false,
                    notename: {
                        value: '',
                        valid: false
                    },
                })
                this.getNote();
            } else {
                if (error.response.status === 500) {
                    this.setState({
                        alert_message: "oops something went wrong.!",
                        alert_state_danger: true,
                        editNoteModal: false,
                        notename: {
                            value: '',
                            valid: false
                        },
                    })
                }
            }
        }
    }
    /* end note api end points*/
    handleClick = (name) => {
        this.setState({
            tab: name
        })
    }
    getClass(name) {
        return this.state.tab === name ? ' active' : ""
    }

    closeCounter() {
        this.setState({
            showCounter: false
        })
    }
    handleCounter() {
        this.setState({
            showCounter: true
        })
    }
    render() {
        let data = this.state.counterResult
        let data1 = this.state.noteResult;
        let formIsValid = true;
        let formIsValid1 = true;
        let formIsValid2 = true;
        let formIsValid3 = true;
        formIsValid = formIsValid && this.state.countername.valid;
        formIsValid1 = formIsValid1 && this.state.editcounter.valid;
        formIsValid2 = formIsValid2 && this.state.notename.valid;
        formIsValid3 = formIsValid3 && this.state.editnote.valid;
        if (this.state.search) {
            data = data.filter(row => {
                return row.counter_name.toLowerCase().includes(this.state.search.toLowerCase())

            })
        }

        if (this.state.searchnote) {
            console.log(this.state.searchnote)
            data1 = data1.filter(row => {
                return row.note_name.toLowerCase().includes(this.state.searchnote.toLowerCase())

            })
        }
        return (
            // <div>

            <div className="App">
                <Grid fluid>
                    <Row className="headerRow">
                        <Header />
                    </Row>
                    <Row>
                        {/* <Tabs /> */}
                        <div>
                            {/* <div style={{ display: "flex" }}>
                    <div onClick={() => this.handleClick("counter")} className={`counter-tab` + this.getClass("counter")}>Counter</div>
                    <div onClick={() => this.handleClick("note")} className={`counter-tab` + this.getClass("note")}>Note</div>
                </div>
                <div className={`counter-div` + this.getClass("counter")}>
                    <div className="content">
                        <SweetAlert success show={this.state.alert_state_success} onConfirm={() => {
                            this.setState({
                                alert_state_success: false
                            })
                        }}>
                            {this.state.alert_message}
                        </SweetAlert>
                        <SweetAlert warning show={this.state.alert_state_warning} onConfirm={() => {
                            this.setState({
                                alert_state_warning: false
                            })
                        }} >
                            {this.state.alert_message}
                        </SweetAlert>
                        <SweetAlert danger show={this.state.alert_state_danger} onConfirm={() => {
                            this.setState({
                                alert_state_danger: false
                            })
                        }} >
                            {this.state.alert_message}
                        </SweetAlert>
                        <div className="container-fluid tables">
                            <Panel bsStyle="info">
                                <Panel.Heading>
                                    <Panel.Title componentClass="h3">Counter Details
                                <Icon icon={plusCircle} className="alignRight fonts" onClick={this.handleCounter} />
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Body>
                                    <div className="row" style={{ height: '20px' }}>
                                        <div className="col-md-8"></div>
                                        <div className="col-md-4 col-sm-6 col-xs-12" >
                                            <span>Search: </span>
                                            <input
                                                className="search"
                                                value={this.state.search}
                                                onChange={e => this.setState({ search: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="row" style={{ marginTop: '35px', height: '0px' }}>
                                        <div className="col-xs-12">
                                            <ReactTable
                                                data={data}
                                                columns={[{
                                                    Header: '',
                                                    columns: [{
                                                        Header: 'Counter Name',
                                                        id: 'counter_name',
                                                        accessor: 'counter_name',
                                                        className: 'cellAlign',
                                                    },

                                                    ]
                                                },
                                                {

                                                    columns: [{
                                                        Header: 'Edit',
                                                        accessor: 'counter_id',
                                                        className: 'cellAlign',
                                                        filterable: false,
                                                        Cell: props => <div>
                                                            <button className='btn btn-info' style={{ float: 'unset' }} onClick={() => this.handleShow(props.value)}>
                                                                edit
                                                            </button>
                                                        </div>,
                                                        width: 80
                                                    },
                                                    ]
                                                }]}
                                                defaultPageSize={10}
                                                pageSizeOptions={[10, 20, 25, 50, 100]}
                                                style={{
                                                    height: "70vh"
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Panel.Body>
                            </Panel>
                        </div>
                        <Modal show={this.state.editModal} onHide={this.handEditCounterClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Item Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">
                                    <div className="col-md-6">
                                        <FormGroup validationState={this.state.editcounter.valid ? 'success' : 'error'} >
                                            <ControlLabel>
                                                Counter Name <span className="text-danger">*</span>
                                            </ControlLabel>
                                            <FormControl
                                                type="text"
                                                id="editcounter"
                                                name="editcounter"
                                                required
                                                maxLength={20}
                                                value={this.state.editcounter.value}
                                                placeholder="Enter the counter name"
                                                onChange={this.editCounterChange}
                                            />
                                            <FormControl.Feedback />
                                        </FormGroup>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button bsStyle="success" disabled={!formIsValid1} onClick={this.handleEditCounterSubmit}>Update</Button>
                                <Button bsStyle="warning" onClick={this.handEditCounterClose}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={this.state.showCounter} onHide={this.closeCounter}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Counter Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">

                                    <div className="col-md-6">
                                        <FormGroup validationState={this.state.countername.valid ? 'success' : 'error'}>
                                            <ControlLabel>
                                                Counter Name <span className="text-danger">*</span>
                                            </ControlLabel>
                                            <FormControl
                                                type="text"
                                                id="countername"
                                                name="countername"
                                                maxLength={20}
                                                required
                                                value={this.state.countername.value}
                                                placeholder="Enter Counter Name"
                                                onChange={this.handleCounterChange.bind(this)}
                                            />
                                            <FormControl.Feedback />
                                        </FormGroup>
                                    </div>

                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button bsStyle="success" disabled={!formIsValid} onClick={this.handleCounterSubmit}>Add</Button>
                                <Button bsStyle="warning" onClick={this.handleCloseNew}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div> */}

                            {/*************note details component******************************* */}

                            <div style={{ display: "flex" }}>
                                <div style={{width:"50px"}}>
                                    <Tabs />
                                </div>
                                <div style={{width:"calc(100vw - 60px)"}} className={`counter-div` + this.getClass("note")}>
                                    <div className="content">
                                        <SweetAlert success show={this.state.alert_state_success} onConfirm={() => {
                                            this.setState({
                                                alert_state_success: false
                                            })
                                        }} >
                                            {this.state.alert_message}
                                        </SweetAlert>
                                        <SweetAlert warning show={this.state.alert_state_warning} onConfirm={() => {
                                            this.setState({
                                                alert_state_warning: false
                                            })
                                        }} >
                                            {this.state.alert_message}
                                        </SweetAlert>
                                        <SweetAlert danger show={this.state.alert_state_danger} onConfirm={() => {
                                            this.setState({
                                                alert_state_danger: false
                                            })
                                        }} >
                                            {this.state.alert_message}
                                        </SweetAlert>
                                        <div className="container-fluid tables">
                                            <Panel bsStyle="info">
                                                <Panel.Heading>
                                                    <Panel.Title  onClick={this.handleShowNew} componentClass="h3"> Add Note
                                                     <Icon icon={plusCircle} className="alignRight fonts" />
                                                    </Panel.Title>
                                                </Panel.Heading>
                                                <Panel.Body>
                                                    <div className="row" style={{ height: '20px' }}>
                                                        <div className="col-md-8"></div>
                                                        <div className="col-md-4 col-sm-6 col-xs-12" >
                                                            <span>search note: </span>
                                                            <input
                                                                className="search"
                                                                value={this.state.searchnote}
                                                                onChange={e => this.setState({ searchnote: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{ marginTop: '35px', height: '0px' }}>
                                                        <div className="col-xs-12">
                                                            <ReactTable
                                                                data={data1}
                                                                columns={[{
                                                                    Header: '',
                                                                    columns: [{
                                                                        Header: 'Note Name',
                                                                        id: 'note_name',
                                                                        accessor: 'note_name',
                                                                        className: 'cellAlign',
                                                                    },

                                                                    ]
                                                                },
                                                                {

                                                                    columns: [{
                                                                        Header: 'Edit',
                                                                        accessor: 'note_id',
                                                                        className: 'cellAlign',
                                                                        filterable: false,
                                                                        Cell: props => <div>
                                                                            <Icon icon={pencil} className='btn btn-info' style={{ float: 'unset' }} onClick={() => this.hadleNoteShow(props.value)}>
                                                                                {/* <Edit /> */} edit
                                                                     </Icon>
                                                                        </div>,
                                                                        width: 80
                                                                    },
                                                                    ]
                                                                }]}
                                                                defaultPageSize={10}
                                                                pageSizeOptions={[10, 20, 25, 50, 100]}
                                                                style={{
                                                                    height: "70vh"
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Panel.Body>
                                            </Panel>
                                        </div>
                                        <Modal show={this.state.editNoteModal} onHide={this.hadnleEditModalClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Edit Note Details</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <FormGroup validationState={this.state.editnote.valid ? 'success' : 'error'} >
                                                            <ControlLabel>
                                                                Note Name <span className="text-danger">*</span>
                                                            </ControlLabel>
                                                            <FormControl
                                                                type="text"
                                                                id="editnote"
                                                                name="editnote"
                                                                required
                                                                maxLength={20}
                                                                value={this.state.editnote.value}
                                                                placeholder="Enter the Note name"
                                                                onChange={this.editNoteChange}
                                                            />
                                                            <FormControl.Feedback />
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button bsStyle="success" disabled={!formIsValid3} onClick={this.handleEditNoteSumbit}>Update</Button>
                                                <Button bsStyle="warning" onClick={this.hadnleEditModalCloseButton}>Close</Button>
                                            </Modal.Footer>
                                        </Modal>
                                        <Modal show={this.state.showNew} onHide={this.handleAddNoteClose}>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Add Note Details</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="row">

                                                    <div className="col-md-6">
                                                        <FormGroup validationState={this.state.notename.valid ? 'success' : 'error'}>
                                                            <ControlLabel>
                                                                Note Name <span className="text-danger">*</span>
                                                            </ControlLabel>
                                                            <FormControl
                                                                type="text"
                                                                id="notename"
                                                                name="notename"
                                                                maxLength={20}
                                                                required
                                                                value={this.state.notename.value}
                                                                placeholder="Enter Note Name"
                                                                onChange={this.handleNoteChange.bind(this)}
                                                            />
                                                            <FormControl.Feedback />
                                                        </FormGroup>
                                                    </div>

                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button bsStyle="success" disabled={!formIsValid2} onClick={this.handleNoteSubmit}>Add</Button>
                                                <Button bsStyle="warning" onClick={this.handleAddNoteCloseButton}>Close</Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default ManageCategory;
