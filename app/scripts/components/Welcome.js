import React, { Component } from 'react';

import Identifier from "../model/Identifier";

import { Button, Field } from './Common';

import { setRootIdentifiers, setScreen, MAIN_SCREEN } from './actions/application';

class Welcome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            names: 'PH4/VH1/OFS1'
        }
    }

    render() {
        return (
            <div className="card">
                <h1>Dobby</h1>
                <p>Graph Visualizer Tool</p>
                <Field
                    type="text"
                    placeholder="Identifier name"
                    onChange={(e) => this.setState({names: e.target.value})}
                    value={this.state.names}
                />
                <Button title="Select" onClick={() => this.onIdentifierSelect()} />
            </div>

        );
    }

    onIdentifierSelect(names) {
        Promise.all(this.state.names.split(' ').map((name) => {
            return Identifier.find(name)
                .catch(() => Promise.resolve());
        })).then((identifiers) => {
                setRootIdentifiers(identifiers);
                setScreen(MAIN_SCREEN);
            }, (error) => {
                //this.$error.show();
                //this.$error.text(error);
            });
    }
}

export default Welcome;
