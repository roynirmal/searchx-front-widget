import React from "react";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import IntroStore from "../../../stores/IntroStore";
import constants from "./constants";
import Helpers from "../../../utils/Helpers";

import './Pilot.pcss';
import Timer from "../components/Timer";
import {Link} from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';

const metaInfo = {
};

class TaskDescription2 extends React.Component {

    constructor(props) {
        super(props);
        this.onFinish = this.onFinish.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }

    handleBeforeUnload(e) {
        if (!this.state.finished) {
            const dialogText = 'Leaving this page will quit the task, and cancel your payment. Are you sure?';
            e.returnValue = dialogText;
            return dialogText;
        }
    }

    componentDidMount(){
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        const groupId = AccountStore.getGroupId();
        const task = AccountStore.getTaskData();
        AccountStore.setSessionId(groupId+"-"+ task.topics[1].id);
        log(LoggerEventTypes.TASK_DESCRIPTION_LOAD, metaInfo);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    onFinish(e) {
        log(LoggerEventTypes.TASK_DESCRIPTION_CONTINUE,metaInfo);
        localStorage.setItem("timer-start", Date.now());
        this.props.history.push({
            pathname: '/pilot/session2',
            state: { waited: true }
        });
    }

    render() {
        const task = AccountStore.getTaskData();
    

        let waited = false;
        if (this.props.location.state) {
            waited = this.props.location.state.waited;
        }


        return <div className="Wait waitBox"> 

                <ReactAudioPlayer
                    src="../sound/notification.mp3"
                    autoPlay
                />
            <h3> <strong> Please read your next task description:</strong> </h3>
            
            <p>Imagine you are a reporter for a newspaper. Your editor has just told you to write a story about <font color="#33BEFF"> <strong>{task.topics[1].title}</strong> </font>.</p>
                <p>There's a meeting in an hour, so your editor asks you and your colleagues to spend 10 minutes together and search
                    for <strong>as many useful documents (news articles) as possible</strong>.</p>

                <p>Collect documents according to the following criteria:</p>
                <strong> <font color="#33BEFF">
                <p>{task.topics[1].description}</p>
                </font> </strong>

                <br/>


                <p> SearchX is a specialized search engine for news articles, use it to find relevant articles for the topic. Do not use any other Web search engine. </p>

            <p> You will be redirected once the time is up!</p>
        <Timer start={new Date()} duration={constants.taskDescriptionWait} onFinish={this.onFinish} style={{fontSize: '2em'}} showRemaining={true}/>

        
        </div>
    
    }
}

export default TaskDescription2;