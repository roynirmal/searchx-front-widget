import React from "react";
import Form from "../components/form/Form";
import constants from "./constants";

import {log} from "../../../utils/Logger";
import {LoggerEventTypes} from "../../../utils/LoggerEventTypes";

import AccountStore from "../../../stores/AccountStore";
import SyncStore from "../../../stores/SyncStore";
import SessionStore from "../../../stores/SessionStore";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.onComplete = this.onComplete.bind(this);
    }

    render() {
        return <Form
            formData={formData()}
            onComplete={this.onComplete}
        />
    }

    ////

    onComplete(data) {
        log(LoggerEventTypes.SURVEY_REGISTER_RESULTS, {
            data: data
        });
        SyncStore.emitSyncSubmit(data);
        const userId = data['userId'].trim();
        AccountStore.clearUserData();
        AccountStore.setUserId(userId);

        const taskParams = {
            groupSize: constants.groupSize,
            topicsSize: constants.topicsSize
        };

        SessionStore.initializeTask(constants.taskId, taskParams, (res) => {
            console.log("here?")
            console.log(res);
            if (res) {
                this.props.history.push('/qhw/session');
            }
        });
    }
}

const formData = function() {
    let pages = [];
    let elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>STUDY DESCRIPTION</h2>"
    });

    elements.push({
        type: "html",
        name: "start",
        html: `
        <h3> <img src ="/img/search.png" width="50" height="50"> Search for information about wildlife extinction!</h3>
        <hr/>

        <p> We want you to search for documents that contain information 
        about <b>wildlife extinction</b>. </p>
        
        <p>More concretely: A few years ago, a debate arose about the conservation of the 
            spotted owl in America, highlighting the U.S. efforts to prevent 
            the extinction of wildlife species. What is not well known is the 
            effort of other countries to prevent the demise of species native 
            to their countries. <b>What other countries have begun efforts to 
            prevent the decline of species native to their countries? A relevant document will specify the country, the involved 
            species, and steps taken to save the species.</b> </p>

        <hr/>

        <p> Our search engine looks similar to a web search engine. You can 
        issue search queries in the search bar and view your recently submitted 
        queries in our <i>Recent queries</i> box. You cannot view the entire 
        document though: please just read the document snippet available for each 
        search result and consider based on the snippet whether the document contains 
        information about the topic of <b>wildlife extinction</b>.
        
        <p>We ask you to search for a minimum of 10 minutes. A timer on the right-hand corner of the
        screen will help you to keep track of time. After 10 minutes, when you are satisfied, you can click on the 
        <span style="background-color: #00A6D3"><font color="white">To Final Test</span></font>
        button to finish your session and go to a final short questionnaire.</p>

        <p>  <img src ="/img/error.png" width="50" height="50"> We have a few important points: </p>
        <ol type="-">
            <li>
                <p>
                <b>Only use the web search interface we provide.</b></br>
                Do not switch browser tabs–-after three tab switches we will cancel your participation.
                </p>
            </li>
            <li>
                <p>
                <b>You cannot interact with the search results. </b></br>
                We ask you to judge the relevance of the document based on the snippet presented.
                </p>
            </li>
            <li> 
                <p>
                Keep your searches on the topic and avoid searches on unrelated topics.
                We will consider off-topic searches, like tomorrow's weather, news on politics, or movie reviews of the Black Widow movie, as off-topic and may cancel your participation.
                </p>
            </li>
        </ol>
        <hr/>
        <p><b>Finally: please read the topic description at the top of this page one more time. It will NOT be available for you on the next screen. Please
        keep it in mind.</b></p>
        `
    });

    pages.push({elements:  elements});

    ////

    elements = [];

    elements.push({
        type: "html",
        name: "topic",
        html: "<h2>Registration</h2>" +
        "<h3>First fill out this basic information about you.</h3>"
    });

    elements.push({
        title: "Insert your assigned Prolific ID here",
        name : "userId",
        type :"text",
        inputType:"text",
        width: 300,
        isRequired: true
    });

    elements.push({
        title: "What is your highest academic degree so far?",
        name: "degree",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "High School or lower"},
            {value: 1, text: "Associate's degree(s) (e.g., AA AE, AFA, AS, ASN)"},
            {value: 2, text: "Bachelor's degree(s) (e.g., BA, BBA, BFA, BS)"},
            {value: 3, text: "Master's degree(s) (e.g., MA, MBA, MFA, MS, MSW)"},
            {value: 4, text: "Specialist degree(s) (e.g., EdS)"},
            {value: 5, text: "Applied or professional doctorate degree(s) (e.g., MD, DDC, DDS, JD, PharmD)"},
            {value: 6, text: "Doctorate degree(s) (e.g., EdD, PhD)"},
            {value: 7, text: "Other"}
        ]
    });

    elements.push({
        title: "For which subject areas do you have a {degree}?",
        visibleIf: "{degree} > 0 and {degree} < 7",
        name : "background",
        type :"text",
        inputType:"text",
        width: 500,
        isRequired: true
    });
    elements.push({
        title: "What is your academic degree and for which subject areas do you have the degree ?",
        visibleIf: "{degree} == 7",
        name : "background",
        type :"text",
        inputType:"text",
        width: 500,
        isRequired: true
    });

    elements.push({
        title: "Are you an English native speaker?",
        name: "english",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "No"},
            {value: 1, text: "Yes"},
        ]
    });
    elements.push({
        html: "<p> Check <a href ='http://www.uefap.com/test/', target='_blank'>this chart </a> to determine your English level. </p>",
        name: "english-chart",
        type: "html",
        visibleIf: "{english} == 0"
    });
    elements.push({
        title: "What is your level of English? ",
        visibleIf: "{english} == 0",
        name : "english-level",
        type: "radiogroup",
        isRequired: true,
        choices: [
            {value: 0, text: "Beginner"},
            {value: 1, text: "Elementary"},
            {value: 2, text: "Intermediate"},
            {value: 3, text: "Upper-intermediate"},
            {value: 4, text: "Advanced"},
            {value: 5, text: "Proficiency"}
        ]
    });

    pages.push({elements:  elements});


    return {
        pages: pages,
        requiredText: "",
        showQuestionNumbers: "off",
        completedHtml: "<h2>Registering user...</h2>"
    }
};

export default Register;
