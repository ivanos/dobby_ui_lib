import Component from "../Component";
import Graph from "./D3Graph";

import ColumnView from "./ColumnView/ColumnView";
import GraphView from "./GraphView/GraphView";

import {setView} from "./actions/mainView";
import mainViewStore, {GRAPH_VIEW, COLUMN_VIEW} from "./stores/mainView";

import {searchAction, searchStore} from "./actions/search";

import React from "react";

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentView: mainViewStore.getInitialState().currentView
        };
    }

    componentDidMount() {
        this.unsubscribe = mainViewStore.listen((state) => {
            this.setState(state);
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        var content = "View is not defined";

        return (
            <div className="main-container">
                <div style={{flex: 1, display: this.state.currentView === GRAPH_VIEW ? "flex" : "none"}}>
                    <GraphView
                        ref="graph"
                        isRunning={this.state.currentView === GRAPH_VIEW}
                    />
                </div>
                <div style={{flex: 1, display: this.state.currentView === COLUMN_VIEW ? "flex" : "none"}}>
                    <ColumnView
                        onSearchResults={(res) => {
                            // TODO: get rid of this
                            this.refs.graph._onSearchSuccess(res);
                        }}
                        onIdentifierSelected={(identifier) => {
                            // TODO: get rid of this
                            this.refs.graph.hoverIdentifier(identifier);
                        }}
                    />
                </div>
            </div>
        )
    }
}


export default Main;
