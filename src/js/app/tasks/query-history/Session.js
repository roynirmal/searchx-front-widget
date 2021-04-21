import React from "react";
import {Link} from "react-router-dom";
import SyncStore from "../../../stores/SyncStore";
import TaskedSession from "../components/session/TaskedSession";
import Collapsible from "react-collapsible";
import constants from "./constants";
import {log} from '../../../utils/Logger';
import {LoggerEventTypes} from '../../../utils/LoggerEventTypes';
import AccountStore from "../../../stores/AccountStore";
import IntroStore from "../../../stores/IntroStore";
import Alert from "react-s-alert";

class Session extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            start: false,
            finished: false,
        };

        this.onFinish = this.onFinish.bind(this);
        this.onSwitchPage = this.onSwitchPage.bind(this);
    }

    componentDidMount() {
        let td = "<h3> Your task </h3><p> We want you to search and find \
        relevant documents for the topic <b>Wildlife Extinction</b> in this \
        task. </p>A brief description of the topic and what we mean by \
        relevant document will  be shown on the right side of your screen. \
        Read it carefully and then you can use our search engine to search\
         for relevant documents.</p>";
        const variant = localStorage.getItem('variant');
        const tip_location = `.QueryHistory .${variant}`
        const introSteps = [
            {
                element: '.Task',
                intro: 'Please take a minute to read your task description.',
                position: 'left'
            },
            {
                element: '.TaskDescription',
                intro: td
            },
            {
                element: '.SearchHeader',
                intro: 'We want you to use our custom web search system\
                SearchX to learn about the information need mentioned in the \
                task description. Once you are satisfied with the results you\
                 obtained press the Next button to submit the documents you \
                 found most useful for the corresponding information need.',
                position: 'bottom-middle-aligned'
            },
            {
                element: '.SearchHeader .form',
                intro: 'Use SearchX to search for  documents that are \
                relevant to the topic'
            },
            {
                element: tip_location,
                intro: 'The query history shows your past search queries.',
                position: 'top'
            },
            {
                element: '.SearchResults',
                intro: 'Save a resource that is useful by clicking on the \
                yellow flag',
                position: 'top'
            }
        ];     
        IntroStore.startIntro(introSteps, () => {
            const start = localStorage.getItem("timer-start") || Date.now();
            localStorage.setItem("timer-start", start);
            this.setState({
                start: start
                });

        });

    }

    

    render() {
        const task = AccountStore.getTask();
        console.log(task.data.topics);
        const sessionNum = localStorage.getItem("session-num") || 0;

        const timer = (
            <div style={{marginTop: '10px', textAlign: 'center'}}>                
                <Link className={"btn btn-primary" } to={"/QHWPostTest/posttest"} role="button">
                        Finish
                </Link>
            </div>
        );
        const metaInfo = {
            session: localStorage.getItem("session-num") || 0,

        };
        let handleTaskOpen = () => {
            log(LoggerEventTypes.TASK_OPEN, metaInfo);
        };

        let handleTaskClose = () => {
            log(LoggerEventTypes.TASK_CLOSE, metaInfo);
        };

        const taskDescription = (
            <Collapsible trigger="Your Task" open transitionTime={3} onOpen={handleTaskOpen} onClose={handleTaskClose} >
                <p>
                        We require to find relevant documents regarding the following information need:
                </p>

                <p ><b><i>"{ task.data.topics[1].description }"</i></b></p> 
                <hr/>

                <p>
                    After you are satisfied with your found documents, click the Finish button above to submit the documents which you found to be most resourceful for this particular information need.
                </p>


            </Collapsible>
        );

        return (
            <div>
                <TaskedSession 
                timer= {timer} 
                taskDescription={taskDescription} 
                onSwitchPage={this.onSwitchPage}
                lastSession={false} 
                firstSession={false}/>
            </div>
        )
    }

    ////

    onFinish() {
        // if (localStorage.session ==1):
        let sessionNum = localStorage.getItem("session-num") || 0;
        
        sessionNum++ 

        localStorage.setItem("session-num", sessionNum);
        this.setState({finished: true})
    }
    
    onLeave() {
        log(LoggerEventTypes.SEARCH_EXIT, {
            step : "session",
            state : this.state
        });

        SyncStore.emitSyncLeave();
        AccountStore.clearUserData();
    }
    onSwitchPage() {
        let switchTabs = localStorage.getItem("switch-tabs-session") || 0;
        switchTabs++;
        localStorage.setItem("switch-tabs-session", switchTabs);
        log(LoggerEventTypes.TAB_CHANGE, {
            step: "sessions",
            switch: switchTabs
        });
        if (switchTabs >= constants.switchPageLimit) {
            this.onLeave();
            localStorage.setItem("invalid-user",1);
            this.props.history.push('/disq');
            localStorage.removeItem("switch-tabs-session");

            Alert.error('You have been disqualified from the study.', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        } else {
            Alert.error('We have noticed that you have tried to change to a different window/tab. Please, use SearchX only for your learning about the given topic!', {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });

            Alert.warning(`Remember that more than ${constants.switchPageLimit} tab changes result in a disqualification. So far you have changed tabs ${switchTabs} time(s)`, {
                position: 'top-right',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        }
    }
}



export default Session;