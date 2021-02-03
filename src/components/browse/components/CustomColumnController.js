'use strict';
// @flow

import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import _ from 'underscore';
import ReactTooltip from 'react-tooltip';
import { Checkbox } from './../../forms/components/Checkbox';
import { listToObj } from './../../util/object';

/**
 * This component stores an object of `hiddenColumns` in state which contains field names as keys and booleans as values.
 * This, along with functions `addHiddenColumn(field: string)` and `removeHiddenColumn(field: string)`, are passed down to
 * this component instance's child component instances.
 *
 * @todo Rename to something better maybe.
 *
 * @prop {Object.<boolean>} [defaultHiddenColumns] - Initial hidden columns state object, if any.
 */
export class CustomColumnController extends React.Component {

    static filterOutHiddenCols(columnDefinitions, hiddenColumns = null, filterColumnFxn = null){
        if (hiddenColumns || typeof filterColumnFxn === "function"){
            return columnDefinitions.filter(function(colDef, i, a){
                if (hiddenColumns && hiddenColumns[colDef.field] === true) {
                    return false;
                }
                if (typeof filterColumnFxn === "function") {
                    return filterColumnFxn(colDef, i, a);
                }
                return true;
            });
        }
        return columnDefinitions;
    }

    static propTypes = {
        "children" : PropTypes.instanceOf(React.Component),
        "columnDefinitions" : PropTypes.arrayOf(PropTypes.shape({
            'field' : PropTypes.string
        })),
        "defaultHiddenColumns" : PropTypes.array
    };

    constructor(props){
        super(props);
        //this.getResetWidths = this.getResetWidths.bind(this);
        this.setColumnWidths = this.setColumnWidths.bind(this);
        this.addHiddenColumn = this.addHiddenColumn.bind(this);
        this.removeHiddenColumn = this.removeHiddenColumn.bind(this);
        this.memoized = {
            hiddenColsListToObj: memoize(listToObj),
            filterOutStateHiddenCols: memoize(CustomColumnController.filterOutHiddenCols),
            filterOutPropHiddenCols: memoize(CustomColumnController.filterOutHiddenCols)
        };
        this.state = {
            'hiddenColumns' : props.defaultHiddenColumns ? { ...props.defaultHiddenColumns } : {},
            'columnWidths' : {}
        };
    }

    componentDidUpdate(pastProps, pastState){
        const { defaultHiddenColumns } = this.props;
        const { hiddenColumns } = this.state;
        if (pastProps.defaultHiddenColumns !== defaultHiddenColumns){
            this.setState({ "hiddenColumns" : _.clone(defaultHiddenColumns || {}) }); // Reset state.hiddenColumns.
            return;
        }
        if (hiddenColumns !== pastState.hiddenColumns) {
            setTimeout(ReactTooltip.rebuild, 0);
        }
    }

    setColumnWidths(columnWidths){
        this.setState({ columnWidths });
    }

    addHiddenColumn(field){
        this.setState(function(currState){
            if (currState.hiddenColumns[field] === true){
                return null;
            }
            var hiddenColumns = _.clone(currState.hiddenColumns);
            hiddenColumns[field] = true;
            return { hiddenColumns };
        });
    }

    removeHiddenColumn(field){
        this.setState(function(currState){
            if (currState.hiddenColumns[field] === false){
                return null;
            }
            var hiddenColumns = _.clone(currState.hiddenColumns);
            hiddenColumns[field] = false;
            return { hiddenColumns };
        });
    }

    render(){
        const {
            children,
            hiddenColumns: alwaysHiddenColsList = [],
            columnDefinitions: allColumnDefinitions,
            filterColumnFxn,
            ...remainingProps
        } = this.props;
        const { hiddenColumns, columnWidths } = this.state;
        if (!React.isValidElement(children)){
            throw new Error('CustomColumnController expects props.children to be a valid React component instance.');
        }

        const alwaysHiddenCols = Array.isArray(alwaysHiddenColsList) ? this.memoized.hiddenColsListToObj(alwaysHiddenColsList) : null;
        const columnDefinitions = this.memoized.filterOutPropHiddenCols(allColumnDefinitions, alwaysHiddenCols, filterColumnFxn);
        const visibleColumnDefinitions = this.memoized.filterOutStateHiddenCols(columnDefinitions, hiddenColumns);

        const propsToPass = {
            ...remainingProps,
            hiddenColumns,
            columnDefinitions,
            visibleColumnDefinitions,
            columnWidths,
            'setColumnWidths': this.setColumnWidths,
            'addHiddenColumn': this.addHiddenColumn,
            'removeHiddenColumn': this.removeHiddenColumn
        };

        return React.Children.map(children, function(child){
            return React.cloneElement(child, propsToPass);
        });
    }

}

export class CustomColumnSelector extends React.PureComponent {

    /**
     * Extends `props.columnDefinitions` (Object[]) with property `hiddenState` (boolean)
     * according to internal state of `hiddenColumns` (Object.<boolean>).
     *
     * Sorts columns according to order and remove the display_title option, as well.
     *
     * @returns {Object[]} Copy of columnDefintions with `hiddenState` added.
     */
    static columnDefinitionsWithHiddenState(columnDefinitions, hiddenColumns) {
        return _.sortBy(
            columnDefinitions.filter(function(c){
                return c.field !== 'display_title'; // Should always remain visible.
            }),
            'order'
        ).map(function(colDef){
            return { ...colDef, 'hiddenState': hiddenColumns[colDef.field] === true };
        });
    }

    constructor(props){
        super(props);
        this.handleOptionVisibilityChange = _.throttle(this.handleOptionVisibilityChange.bind(this), 300);
        this.memoized = {
            columnDefinitionsWithHiddenState: memoize(CustomColumnSelector.columnDefinitionsWithHiddenState)
        };
    }

    handleOptionVisibilityChange(evt){
        evt.stopPropagation();
        const field = evt.target.value;
        const { hiddenColumns, removeHiddenColumn, addHiddenColumn } = this.props;
        setTimeout(function(){
            if (hiddenColumns[field] === true){
                removeHiddenColumn(field);
            } else {
                addHiddenColumn(field);
            }
        }, 0);
    }

    render(){
        const { columnDefinitions, hiddenColumns } = this.props;
        return (
            <div className="row clearfix">
                { this.memoized.columnDefinitionsWithHiddenState(columnDefinitions, hiddenColumns).map((colDef, idx, all) =>
                    <ColumnOption {...colDef} key={colDef.field || idx} allColumns={all} index={idx} handleOptionVisibilityChange={this.handleOptionVisibilityChange} />
                ) }
            </div>
        );
    }

}
CustomColumnSelector.propTypes = {
    'hiddenColumns'         : PropTypes.object.isRequired,
    'addHiddenColumn'       : PropTypes.func.isRequired,
    'removeHiddenColumn'    : PropTypes.func.isRequired
};

const ColumnOption = React.memo(function ColumnOption(props){
    const { hiddenState, allColumns, field, title, description, index, handleOptionVisibilityChange } = props;
    const checked = !hiddenState;
    const sameTitleColExists = _.any(allColumns.slice(0,index).concat(allColumns.slice(index + 1)), { title });
    const className = "clickable" + (checked ? ' is-active' : '');
    let showDescription = description;

    if (sameTitleColExists){
        if (!description){
            showDescription = '<i class="icon icon-fw fas icon-code">&nbsp;</i><em class="text-300">' + field + '</em>';
        } else {
            showDescription += '<br/><i class="icon icon-fw fas icon-code">&nbsp;</i><em class="text-300">' + field + '</em>';
        }
    }

    return (
        <div className="col-12 col-sm-6 col-lg-3 column-option" key={field} data-tip={showDescription} data-html>
            {/*
            <label className="row" style={{ alignItems: "center" }}>
                <input type="checkbox">

                </input>
            </label>

            <input type="checkbox">

            </input>
            */}
            <Checkbox {...{ className, checked }} value={field} onChange={handleOptionVisibilityChange}>
                { title }
            </Checkbox>
        </div>
    );
});
