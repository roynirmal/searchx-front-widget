import React from "react";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SearchStore from "../../search/SearchStore";
import SyncStore from "../../../stores/SyncStore";
import IntroStore from "../../../stores/IntroStore";
import constants from "./constants";
import Helpers from "../../../utils/Helpers";

import './Pilot.pcss';
import Timer from "../components/Timer";
import {Link} from 'react-router-dom';
import ReactAudioPlayer from 'react-audio-player';
import {Prompt} from "react-router";

const metaInfo = {
};

class TaskDescription1 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            finished: false
        };
        this.onFinish = this.onFinish.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }

    handleBeforeUnload(e) {
        if (!this.state.finished) {
            const dialogText = 'Leaving this page will quit the task. Are you sure?';
            e.returnValue = dialogText;
            return dialogText;
        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        const task = AccountStore.getTaskData();
        const groupId = AccountStore.getGroupId();
        AccountStore.setSessionId(groupId+"-"+ task.topics[0].id + "-" + SearchStore.getVariant() );
        log(LoggerEventTypes.TASK_DESCRIPTION_LOAD,metaInfo);
    }


    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    onFinish(e) {
        this.setState({finished: true});
        log(LoggerEventTypes.TASK_DESCRIPTION_CONTINUE,metaInfo);
        this.props.history.push({
            pathname: '/pilot/session1',
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

            <Prompt
                when={!this.state.finished}
                message='Leaving this page will quit the task. Are you sure?'
            />
            <ReactAudioPlayer
                    src="../sound/notification.mp3"
                    play
            />

            <h3> Please read your task description:</h3>
            
            <p>Imagine you are a reporter for a newspaper. Your editor has just told you to write a story about <font color="#33BEFF"> <strong>{task.topics[0].title}</strong> </font>.</p>
                <p>There's a meeting in an hour, so your editor asks you and your colleagues to spend 10 minutes together and search
                    for <strong>as many useful documents (news articles) as possible</strong>.</p>

                <p>Collect documents according to the following criteria:</p>
                <strong> <font color="#33BEFF">
                <p>{task.topics[0].description}</p>
                </font> </strong>

                <br/>


                <p> SearchX is a specialized search engine for news articles, use it to find relevant articles for the topic. Do not use any other Web search engine. </p>

            <p> You will be redirected once the time is up!</p>
            <Timer start={new Date()} duration={constants.taskDescriptionWait} onFinish={this.onFinish} style={{fontSize: '2em'}} showRemaining={true}/>
         

        
        </div>
    
    }
}

export default TaskDescription1;