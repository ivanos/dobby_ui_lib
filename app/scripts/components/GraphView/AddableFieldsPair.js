import {Button, Field} from "../Common";

import React from "react";

var AddableFieldsPair = React.createClass({

    _addField() {
        this.props.addField();
    },

    _removeField(index) {
        this.props.removeField(index);
    },

    _keyChanged(index, key) {
        var fields = this.props.fields,
            {value} = fields[index];

        fields[index] = {key, value};
        this.props.onChange(fields);
    },

    _valueChanged(index, value) {
        var fields = this.props.fields,
            {key} = fields[index];

        fields[index] = {key, value:value.split(" ")};
        this.props.onChange(fields);
    },

    render() {
        var fields = this.props.fields.map((field, index) => {
            var {key, value} = field;

            return (
                <div key={index}>
                    <Field onChange={({target: {value}}) => this._keyChanged(index, value)} value={key} />
                    <Field onChange={({target: {value}}) => this._valueChanged(index, value)} value={value.join(" ")} />
                    <Button onClick={() => this._removeField(index)} title="-" />
                </div>
            )
        });
        return (
            <div>
                <div>
                    <p>
                        <span>{this.props.name}</span>
                        <Button onClick={this._addField} title="+" />
                    </p>
                </div>
                <div>
                    {fields}
                </div>
            </div>
        )
    }
});

export default AddableFieldsPair;
