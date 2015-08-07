import AddableFieldsPair from "./AddableFieldsPair";
import {Button, Field} from "../Common/Common";

const fieldPairs = [{
    name: "Match Identifiers Metadata",
    paramsKey: "match_metadata"
}, {
    paramsKey: "match_links",
    name: "Match Links Metadata"
}, {
    paramsKey: "match_terminal",
    name: "Match Identifiers Metadata"
}];


var SearchMenu = React.createClass({

    getInitialState() {
        return {
            params: {
                max_depth: 1,
                results_filter: [],
                match_metadata: [],
                match_links: [],
                match_terminal: []
            }
        }
    },

    paramsChanged(paramsKey, value) {
        var params = this.state.params;

        params[paramsKey] = value;

        this.setState({params});
    },

    _addField(key) {
        var params = this.state.params;

        params[key].push({key: "", value: []});

        this.setState({params})
    },

    _removeField(key, index) {
        var fields = this.state.params[key];
        fields.splice(index, 1);
        this.setState({fields});
    },

    _normaliseValues(params) {
        var {max_depth, results_filter, ...toNormalise} = params;

        Object.keys(toNormalise).map((key) => {
            toNormalise[key] = toNormalise[key].reduce((obj, val) => {
                obj[val.key] = val.value;
            }, {});
        });

        return {max_depth, results_filter, ...toNormalise};
    },

    _onSubmit(event) {
        event.preventDefault();
        console.log(this.state.params);
        this.props.onSubmit(this._normaliseValues(this.state.params));
    },

    render() {
        var {x: left=50000, y: top=50000} = this.props.position || {};

        var fields = fieldPairs.map(({paramsKey, name}) => {
            return (
                <AddableFieldsPair
                    fields={this.state.params[paramsKey]}
                    addField={() => this._addField(paramsKey)}
                    removeField={(index) => this._removeField(paramsKey, index)}
                    onChange={(fields) => this.paramsChanged(paramsKey, fields)}
                    name={name}
                    />
            )
        });

        return (
            <div className="card menu" style={{position: "fixed", top, left}}>
                <form onSubmit={this._onSubmit} onChange={(fields) => console.log(fields)}>
                    <div>Search for Identifiers</div>
                    <div>
                        <p>
                            <span>Max Depth </span>
                            <Field
                                type="number"
                                onChange={({target: {value}}) => this.paramsChanged("max_depth", parseInt(value, 10))}
                                value={this.state.params.max_depth}
                                />
                        </p>
                    </div>
                    <div>
                        <p>
                            <span>Filter Metadata</span>
                            <Field
                                onChange={({target: {value}}) => this.paramsChanged("results_filter", value.split(" "))}
                                value={this.state.params.results_filter.join(" ")}
                                />
                        </p>
                    </div>
                    {fields}
                    <Button type="submit" onClick={this._onSubmit} title="Search" />
                </form>
            </div>
        )
    }
});

export default SearchMenu;
