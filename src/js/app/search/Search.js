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
                // Form and query box
                'query-box-hoverin': {
                    selector: 'form input',
                    event: 'mouseenter',
                    name: 'QUERY_BOX_MOUSE_ENTER',
                },

                'query-box-focus': {
                    selector: 'form input',
                    event: 'focus',
                    name: 'QUERY_BOX_FOCUS',
                },

                'query-box-blur': {
                    selector: 'form input',
                    event: 'blur',
                    name: 'QUERY_BOX_BLUR',
                },

                'query-box-keypress': {
                    selector: 'form input',
                    event: 'keyup',
                    name: 'QUERY_BOX_KEY',
                    metadata: [
                        {
                            nameForLog: 'QUERY_STRING',
                            sourcer: 'elementProperty',
                            lookFor: 'value',
                        }
                    ]
                },

                'form-submission': {
                    selector: 'form',
                    event: 'formSubmission',
                    name: 'FORM_SUBMISSION',
                    properties: {
                        includeValues: [
                            {
                                nameForLog: 'submittedQuery',
                                sourcer: 'elementProperty',
                                selector: 'form input',
                                lookFor: 'value',
                            }
                        ]
                    }
                },

                // QHW box hover in/out
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

                // QHW previous query hover in/out
                'qhw-hover-item': {
                    selector: '.QueryHistory * .list .item .text a',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'QHW_QUERY_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'QHW_QUERY_MOUSE_LEAVE',
                        }
                    },
                    metadata: [
                        {
                            nameForLog: 'QUERY',
                            sourcer: 'elementAttribute',
                            lookFor: 'data-query',
                        }
                    ]
                },

                // QHW previous query click
                'qhw-click-item': {
                    selector: '.QueryHistory * .list .item .text a',
                    event: 'click',
                    name: 'QHW_QUERY_CLICK',
                },

                // QHW scrolling
                'qhw-scrolling': {
                    selector: '.QueryHistory *',
                    event: 'scrollable',
                    properties: {
                        scrollStart: {
                            name: 'QHW_SCROLL_START',
                        },
                        scrollEnd: {
                            name: 'QHW_SCROLL_END',
                        },
                    },
                },

                // Search result hover in/out
                'result-hover': {
                    selector: '.SearchResults .list > div div.SearchResult',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'RESULT_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'RESULT_MOUSE_LEAVE',
                        }
                    },
                    metadata: [
                        {
                            nameForLog: 'ID',
                            sourcer: 'elementAttribute',
                            lookFor: 'data-id',
                        },
                        {
                            nameForLog: 'COLLECTION_ID',
                            sourcer: 'elementAttribute',
                            lookFor: 'data-collectionid',
                        },
                        {
                            nameForLog: 'RANK',
                            sourcer: 'elementAttribute',
                            lookFor: 'data-rank',
                        }
                    ]
                },

                // Search result click
                'result-click': {
                    selector: '.SearchResults .list > div div.SearchResult div div h2 a',
                    event: 'click',
                    name: 'RESULT_CLICK',
                },
                
                // Rating hover in/out
                'result-rating-hover': {
                    selector: '.SearchResults .list > div div.SearchResult div span.rating',
                    event: 'mouseHover',
                    properties: {
                        mouseenter: {
                            name: 'RESULT_RATING_MOUSE_ENTER',
                        },
                        mouseleave: {
                            name: 'RESULT_RATING_MOUSE_LEAVE',
                        }
                    },
                },


            },
        };

        window.LogUI.init(configurationObject);
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
       localStorage.setItem("variant", "ur")
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