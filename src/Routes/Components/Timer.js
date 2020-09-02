import React from 'react';
import moment from 'moment-timezone';

class Timer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            cout:moment().diff(moment(this.props.ordertime), 'minutes') + ' ' + 'Minute Ago'
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            let ctime = moment(ctime).format('YYYY-MM-DD HH:mm:ss');
            this.setState({ cout:moment(ctime).diff(moment(this.props.ordertime), 'minutes') + ' ' + 'Minute Ago'})
        }, 1000);
    }
    componentWillUnmount() {
    clearInterval(this.interval);
    }

    render(){
        return(
            <b {...this.props}>{this.state.cout}</b>
        )
    }
}

export default Timer;