import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { SearchSelectionMenu } from './SearchSelectionMenu';

import { valueTransforms } from './../../util';


export class SearchAsYouTypeLocal extends React.PureComponent {

    static getRegexQuery(value, filterMethod) {
        switch (filterMethod) {
            case "includes":
                return valueTransforms.escapeRegExp(value.toLowerCase());
            case "startsWith":
            default:
                return "^" + valueTransforms.escapeRegExp(value.toLowerCase()) + "(.+)?$";
        }
    }

    static filterOptions(currTextValue, allResults = [], filterMethod = "startsWith"){
        const regexQuery = SearchAsYouTypeLocal.getRegexQuery(currTextValue, filterMethod);
        return allResults.filter(function(optStr){
            return !!(optStr.toLowerCase().match(regexQuery));
        });
    }

    constructor(props) {
        super(props);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.onDropdownSelect = this.onDropdownSelect.bind(this);

        this.state = {
            currentTextValue : props.initializeWithValue ? (props.value || "") : ""
        };

        this.memoized = {
            filterOptions : memoize(SearchAsYouTypeLocal.filterOptions)
        };
    }

    onTextInputChange(evt){
        const { onChange, allowCustomValue = false } = this.props;
        const { value = null } = evt.target;
        if (allowCustomValue) {
            onChange(value);
        }
        this.setState({ currentTextValue: value });
        return false;
    }

    onDropdownSelect(eventKey, evt){
        const { onChange } = this.props;
        onChange(eventKey);
    }

    render() {
        const {
            searchList,
            filterMethod = "startsWith",
            optionsHeader: propOptionsHeader,
            allowCustomValue,
            ...passProps
        } = this.props;
        const { currentTextValue } = this.state;
        let filteredOptions;
        let optionsHeader = propOptionsHeader;

        if (!Array.isArray(searchList)){
            // Likely, schemas are not yet loaded?
            filteredOptions = [];
            optionsHeader = (
                <div className="text-center py-2">
                    <i className="icon icon-spin icon-circle-notch fas"/>
                </div>
            );
        } else {
            filteredOptions = this.memoized.filterOptions(currentTextValue, searchList, filterMethod);
            if (filteredOptions.length === 0) {
                optionsHeader = (
                    <React.Fragment>
                        <em className="d-block text-center px-4 py-1">
                            { allowCustomValue ? "Adding new entry" : "No results found" }
                        </em>
                        { optionsHeader }
                    </React.Fragment>
                );
            }
        }

        return (
            <SearchSelectionMenu {...passProps} {...{ optionsHeader, currentTextValue }}
                options={filteredOptions}
                onTextInputChange={this.onTextInputChange}
                onDropdownSelect={this.onDropdownSelect}/>
        );
    }
}
SearchAsYouTypeLocal.propTypes = {
    searchList : PropTypes.arrayOf(PropTypes.string).isRequired,
    value : PropTypes.string,
    onChange : PropTypes.func.isRequired,
    filterMethod : PropTypes.string, // "startsWith", "includes" (can add more in future if necessary) -- defaults to startsWith
    allowCustomValue: PropTypes.bool,
    initializeWithValue: PropTypes.bool
};


