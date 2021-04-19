import './Search.pcss';
import React from 'react';

import {log} from '../../utils/Logger';
import {LoggerEventTypes} from '../../utils/LoggerEventTypes';
import PropTypes from "prop-types";
import SearchHeaderContainer from './header/SearchHeaderContainer';
import SearchResultsContainer from "./results/SearchResultsContainer";
import QueryHistoryContainer from "./features/queryhistory/QueryHistoryContainer";
import BookmarkContainer from "./features/bookmark/BookmarkContainer";
import Chat from "./features/chat/Chat";
import config from "../../config";
import MobileDetect from 'mobile-detect';
import Alert from "react-s-alert";
import AccountStore from "../../stores/AccountStore"

class Search extends React.Component {
    constructor(props) {
        super(props);


        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.checkDevice = this.checkDevice.bind(this);
    }
    checkDevice()  {
        const md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile() !== null) {
            
            console.log("I am here");
            // return (<div/>)
            Alert.warning('SearchX is optimized for desktop browsing.', {
                position: 'top',
                effect: 'scale',
                beep: true,
                timeout: "none"
            });
        }
    };
    componentDidMount() {
        // if (this.props.firstSession && config.interface.chat && this.props.collaborative) {
        //     sessionStorage.clear();
        //     Chat();
        // };
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        if (window.hasOwnProperty('LogUI')) {
            this.startLogUI();
        }
    }

    startLogUI() {
        let configurationObject = {
            logUIConfiguration: {
                endpoint: 'ws://logui.ewi.tudelft.nl/ws/endpoint/',
                authorisationToken: 'eyJ0eXBlIjoibG9nVUktYXV0aG9yaXNhdGlvbi1vYmplY3QiLCJhcHBsaWNhdGlvbklEIjoiNjg2OGRkZDEtODNhYy00NTJlLTk2ZDEtNjJkZDg5OWJlNTUzIiwiZmxpZ2h0SUQiOiI0NWJlNGFkNS0yNDQ0LTRlOTItYTA0My05ZmQ0YmZhYWI4ZmUifQ:1lYafK:1cG6yM47tk2vv1hSuhuAsxVYZbDGDBvenrjpvbPKjwI',
                verbose: true,

                browserEvents: {
                    blockEventBubbling: true,
                    eventsWhileScrolling: true,
                    URLChanges: true,
                    contextMenu: true,
                    pageFocus: true,
                    trackCursor: false,
                    cursorUpdateFrequency: 2000,
                    cursorLeavingPage: true,
                    pageResize: true,
                }
            },
            applicationSpecificData: {
                userId: AccountStore.getUserId(),
                groupId: AccountStore.getGroupId(),
            },
            trackingConfiguration: {
                'qhw-hover': {
                    selector: '.QueryHistory .tl',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'QHW_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'QHW_MOUSE_LEAVE',
                        }
                    },
                },

                'qhw-hover-item': {
                    selector: '.QueryHistory .tl .list .item span a',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'QHW_ITEM_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'QHW_ITEM_MOUSE_LEAVE',
                        }
                    },
                }
            },
        };

        window.LogUI.init(configurationObject);
        console.log(this.props);
    }

    componentWillUnmount() {
        if (this.props.lastSession && config.interface.chat && this.props.collaborative) {
            const messages = document.querySelector(".chat-content").innerHTML;
            log(LoggerEventTypes.CHAT_ARCHIVE, {
                messages: messages
            });

            const element = document.querySelector("#conversejs");
            element.parentElement.removeChild(element);
        };
        document.removeEventListener('visibilitychange', this.handleVisibilityChange, this.checkDevice);

        if (window.hasOwnProperty('LogUI')) {
            if (window.LogUI.isActive()) {
                window.LogUI.stop();
            }
        }
    }

    render() {
       
        return (
            <div className="Search">
                {this.checkDevice()}
                <SearchHeaderContainer timer={this.props.timer} statusbar={this.props.statusbar} showAccountInfo={this.props.showAccountInfo}/>

                <div className="Content">
                <QueryHistoryContainer collaborative={this.props.collaborative}/>
                    <div className="Main">
                        <div className="SearchResultsContainer">
                            <SearchResultsContainer/>
                        </div>
                    </div>

                    {/* <div className="Side"> */}
                        {/* <QueryHistoryContainer collaborative={this.props.collaborative}/> */}
                        {/* <BookmarkContainer collaborative={this.props.collaborative}/> */}
                    {/* </div> */}

                    {this.props.taskDescription && (
                        <div className="Side">
                            {this.props.taskDescription}
                        </div>
                    )}
                </div>
               
                <Chat/>
                <div className="text-center">
                    <p className="Footer">
                        SearchX is optimized for desktop browsing. Read more about <a href="/about" target="_blank">SearchX</a>.
                    </p>
                </div>
            </div>
        )
    }
    handleVisibilityChange() {
        if (document.hidden) {
        
            
            this.props.onSwitchPage();
        }
    }
}
Search.propTypes = {
    onSwitchPage: PropTypes.func
};


Search.defaultProps = {
    collaborative: true,
    showAccountInfo: true,
    firstSession: true,
    lastSession: true,
    onSwitchPage: () => {},
};

export default Search;