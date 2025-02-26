import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import memoize from 'memoize-one';
import ReactTooltip from 'react-tooltip';
import { JSONTree } from 'react-json-tree';

import { isAnItem, itemUtil, isAnAttachment, tipsFromSchema, TooltipInfoIconContainer, getNestedProperty } from './../util/object';
import { isPrimitive } from './../util/misc';
import { patchedConsoleInstance as console } from './../util/patched-console';
import { getSchemaForItemType, getItemType, flattenSchemaPropertyToColumnDefinition, getSchemaProperty } from './../util/schema-transforms';
import { PartialList } from './PartialList';

// eslint-disable-next-line no-unused-vars
import { Item } from './../util/typedefs';




/**
 * This file/component is kind of a mess.
 *
 * @module
 * @todo
 * For any major-ish future work, we should replace this with an
 * off-the-shelf NPM JSON-LD renderer (if any) and just wrap it with
 * our own simple 'prop-feeder' component.
 */


/** Contains and toggles visibility/mounting of a Subview. Renders title for the Subview. */
const SubItemTitle = React.memo(function SubItemTitle({ isOpen, title, onToggle, countProperties, content }){
    const iconType = isOpen ? 'icon-minus' : 'icon-plus';
    let showTitle = title;
    let subtitle = null;
    if (typeof title !== 'string' || title.toLowerCase() === 'no title found'){
        showTitle = isOpen ? "Collapse" : "Expand";
    }
    if (content && _.any([content.title, content.display_title, content.name], function(p){ return typeof p === 'string'; })) {
        subtitle = (
            <span className="text-600">
                {
                    typeof content.title === 'string' ? content.title :
                        typeof content.display_title === 'string' ? content.display_title : content.name
                }
            </span>
        );
    }
    return (
        <span className="subitem-toggle">
            <span className="link" onClick={onToggle}>
                <i style={{ 'color':'black', 'paddingRight': 10, 'paddingLeft' : 5 }} className={"icon fas " + iconType}/>
                { showTitle } { subtitle } { countProperties && !isOpen ? <span>({ countProperties })</span> : null }
            </span>
        </span>
    );
});
SubItemTitle.propTypes = {
    'onToggle' : PropTypes.func,
    'isOpen' : PropTypes.bool,
    'title' : PropTypes.string,
    'content' : PropTypes.object
};

export const SubItemListView = React.memo(function SubItemListView(props){
    const { isOpen, content : item, schemas, popLink, excludedKeys, columnDefinitions, termTransformFxn } = props;
    if (!isOpen) return null;
    const passProps = {
        schemas, popLink, termTransformFxn,
        'context' : item,
        'alwaysCollapsibleKeys' : [],
        'excludedKeys' : (
            excludedKeys || _.without(Detail.defaultProps.excludedKeys,
                // Remove
                'lab', 'award', 'description'
            ).concat([
            // Add
                'schema_version', 'uuid'
            ])
        ),
        'columnDefinitions' : columnDefinitions || {},
        'showJSONButton' : false,
        'hideButtons': true
    };
    return (
        <div className="sub-panel data-display panel-body-with-header">
            <div className="key-value sub-descriptions">
                { React.createElement((typeof item.display_title === 'string' ? ItemDetailList : Detail), passProps) }
            </div>
        </div>
    );
});


/**
 * Messiness.
 * @todo refactor or get rid of.
 */
class SubItemTable extends React.Component {

    /**
     * This code could look better.
     * Essentially, checks each property in first object of param 'list' and if no values fail a rough validation wherein there must be no too-deeply nested objects or lists, returns true.
     *
     * @param {Object[]} list - List of objects
     * @returns {boolean} True if a table would be good for showing these items.
     */
    static shouldUseTable(list, schemas){
        if (!Array.isArray(list)) return false;
        if (list.length < 1) return false;

        let schemaForType;

        if (_.any(list, function(x){ return typeof x === 'undefined'; })) return false;
        if (!_.all(list, function(x){ return typeof x === 'object' && x; })) return false;
        if (_.all(list, function(x){ return Array.isArray(x); })) return false; //multi-dim array??
        if (_.any(list, function(x){
            if (!Array.isArray(x['@type'])){
                {/* return true; // No @type so we can't get 'columns' from schemas. */}
            } else {
                schemaForType = getSchemaForItemType(x['@type'][0], schemas);
                if (!schemaForType || !schemaForType.columns) return true; // No columns on this Item type's schema. Skip.
            }
        })) return false;
        
        /**
         * The reduce function below creates an object containing the keys and
         * values of each item by extending the returned accumulator object [m]
         */
        const objectWithAllItemKeys = _.reduce(list, function(m, v){
            // clone the new item [v] in [list] and its keys
            let v2 = _.clone(v);
            let valKeys = _.keys(v2);
            
            // Add keys and values from v2 into accumulator variable [m]
            for (let i = 0; i < valKeys.length; i++) {

                const valKey = valKeys[i];

                if (Array.isArray(v2[valKey])){
                   // Concatenate value in [v2] into value in [m]
                   if (!Array.isArray(m[valKey])) {
                    m[valKey] = [m[valKey]].concat(v2[valKey]);
                  } else { // m[valKey] is already an array
                    m[valKey] = (m[valKey] || []).concat(v2[valKey]);
                  }
                   delete v2[valKey];
                } else if (v2[valKey] && typeof v2[valKey] === 'object') {
                     // Extend value in [m] with value in [v2]
                    if (typeof m[valKey] === 'object') {
                        m[valKey] = _.extend(m[valKey] || {}, v2[valKey]);
                    }
                    else {
                        m[valKey] = [ m[valKey], v2[valKey] ];
                    }
                    delete v2[valKey];
                }
            }

            return _.extend(m, v2);
        }, {});

        var rootKeys = _.keys(objectWithAllItemKeys);
        var embeddedKeys, i, j, k, embeddedListItem, embeddedListItemKeys;


        for (i = 0; i < rootKeys.length; i++){

            if (Array.isArray(objectWithAllItemKeys[rootKeys[i]])) {

                var listObjects = _.filter(objectWithAllItemKeys[rootKeys[i]], function(v){
                    if (!v || (v && typeof v === 'object')) return true;
                    return false;
                });

                if (listObjects.length === 0) continue; // List of strings or values only. Continue.
                var listNotItems = _.filter(listObjects, function(v){ return !isAnItem(v); });

                if (listNotItems.length === 0) continue; // List of Items that can be rendered as links. Continue.

                // Else, we have list of Objects. Assert that each sub-object has only strings, numbers, or Item (object with link), or list of such -- no other sub-objects.
                for (k = 0; k < listNotItems.length; k++){
                    embeddedListItem = listNotItems[k];
                    embeddedListItemKeys = _.keys(embeddedListItem);

                    for (j = 0; j < embeddedListItemKeys.length; j++){
                        if (typeof embeddedListItem[embeddedListItemKeys[j]] === 'string' || typeof embeddedListItem[embeddedListItemKeys[j]] === 'number'){
                            continue;
                        }
                        if (isAnItem(embeddedListItem[embeddedListItemKeys[j]])){
                            continue;
                        }
                        if (
                            Array.isArray(embeddedListItem[embeddedListItemKeys[j]]) &&
                            _.filter(embeddedListItem[embeddedListItemKeys[j]], function(v){
                                if (typeof v === 'string' || typeof v === 'number') return false;
                                return true;
                            }).length === 0
                        ){
                            continue;
                        }
                        return false;
                    }
                }
            }

            if (!Array.isArray(objectWithAllItemKeys[rootKeys[i]]) && objectWithAllItemKeys[rootKeys[i]] && typeof objectWithAllItemKeys[rootKeys[i]] === 'object') {
                // Embedded object 1 level deep. Will flatten upwards if passes checks:
                // example: (sub-object) {..., 'stringProp' : 'stringVal', 'meta' : {'argument_name' : 'x', 'argument_type' : 'y'}, ...} ===> (columns) 'stringProp', 'meta.argument_name', 'meta.argument_type'
                if (isAnItem(objectWithAllItemKeys[rootKeys[i]])){
                    // This embedded object is an.... ITEM! Skip rest of checks for this property, we're ok with just drawing link to Item.
                    continue;
                }
                embeddedKeys = _.keys(objectWithAllItemKeys[rootKeys[i]]);

                if (embeddedKeys.length > 5) return false; // 5 properties to flatten up feels like a good limit. Lets render objects with more than that as lists or own table (not flattened up to another 1).
                // Run some checks against the embedded object's properties. Ensure all nested lists contain plain strings or numbers, as will flatten to simple comma-delimited list.
                for (j = 0; j < embeddedKeys.length; j++){

                    if (typeof objectWithAllItemKeys[ rootKeys[i] ][ embeddedKeys[j] ] === 'string' || typeof objectWithAllItemKeys[ rootKeys[i] ][ embeddedKeys[j] ] === 'number') continue;
                    // Ensure if property on embedded object's is an array, that is a simple array of strings or numbers - no objects. Will be converted to comma-delimited list.
                    if ( Array.isArray(  objectWithAllItemKeys[ rootKeys[i] ][ embeddedKeys[j] ]  ) ){
                        if (
                            objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]].length < 4 &&
                            _.filter(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]], function(v){
                                if (typeof v === 'string' || typeof v === 'number') { return false; }
                                else if (v && typeof v === 'object' && _.keys(v).length < 2) { return false; }
                                else { return true; }
                            }).length === 0
                            //(typeof objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]][0] === 'string' || typeof objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]][0] === 'number')
                        ) {
                            continue;
                        } else {
                            return false;
                        }
                    }

                    // Ensure that if is not an array, it is a simple string or number (not another embedded object).
                    if (
                        !Array.isArray(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]]) &&
                        objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]] &&
                        typeof objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]] === 'object'
                    ) { // Embedded object 2 levels deep. No thx we don't want any 'meta.argument_mapping.argument_type' -length column names. Unless it's an Item for which we can just render link for.
                        if (isAnItem(objectWithAllItemKeys[rootKeys[i]][embeddedKeys[j]])) continue;
                        return false;
                    }
                }
            }
        }

        const excludedKeys = ['principals_allowed', '@type', 'uuid'];
        var reminderKeys = _.difference(_.keys(objectWithAllItemKeys), excludedKeys);
        if (reminderKeys.length <= 2) {
            return false;
        }

        return true;
    }

    /**
     * check whether the list is a multi dimensional array
     * @param {*} list - array to be checked
     * @param {*} validationFunc - function to validate items in the array, if any fails then return false
     * @returns boolean
     */
    static isMultiDimArray(list, validationFunc) {
        if (!Array.isArray(list)) return false;
        if (list.length < 1) return false;
        if (!_.all(list, function (x) { return Array.isArray(x) && x.length > 0; })) return false;
        if (!_.all(list, function (x) { return x.length === list[0].length; })) return false;
        if (validationFunc && typeof validationFunc === 'function') {
            if (_.any(list, function (x) {
                if (_.any(x, function (item) { return !validationFunc(item); })) {
                    return true;
                }
            })) return false;
        }

        return true;
    }

    static getColumnKeys(items, columnDefinitions, schemas){
        const objectWithAllItemKeys = _.reduce(items, function(m, v){
            return _.extend(m, v);
        }, {});
        //var schemas = this.props.schemas || Schemas.get();
        //var tips = schemas ? tipsFromSchema(schemas, context) : {};
        //if (typeof this.props.keyTitleDescriptionMap === 'object' && this.props.keyTitleDescriptionMap){
        //    _.extend(tips, this.props.keyTitleDescriptionMap);
        //}

        // Property columns to push to front (common across all objects)
        const rootKeys = _.keys(objectWithAllItemKeys);
        let columnKeys = [];

        // Use schema columns
        if (typeof objectWithAllItemKeys.display_title === 'string' && Array.isArray(objectWithAllItemKeys['@type'])){

            var columnKeysFromSchema = _.keys(
                getSchemaForItemType(
                    getItemType(objectWithAllItemKeys), schemas
                ).columns
            );

            columnKeys = rootKeys.filter(function(k){
                if (k === 'display_title' || k === '@id' || k === 'accession') return true;
                if (columnKeysFromSchema.indexOf(k) > -1) return true;
                return false;
            }).map(function(k){
                return { 'key' : k };
            });

        } else {
            // Gather, flatten up from Object.
            for (var i = 0; i < rootKeys.length; i++){
                if (typeof objectWithAllItemKeys[rootKeys[i]] === 'string' || typeof objectWithAllItemKeys[rootKeys[i]] === 'number' || typeof objectWithAllItemKeys[rootKeys[i]] === 'boolean' || Array.isArray(objectWithAllItemKeys[rootKeys[i]])) {
                    if (  Array.isArray(objectWithAllItemKeys[rootKeys[i]]) && objectWithAllItemKeys[rootKeys[i]][0] && typeof objectWithAllItemKeys[rootKeys[i]][0] === 'object' && typeof objectWithAllItemKeys[rootKeys[i]][0].display_title !== 'string' ) {
                        columnKeys.push({
                            'key' : rootKeys[i],
                            'childKeys' : _.keys(
                                _.reduce(items, function(m1,v1){
                                    return _.extend(
                                        m1,
                                        _.reduce(v1[rootKeys[i]], function(m2,v2) {
                                            return _.extend(m2, v2);
                                        }, {})
                                    );
                                }, {})
                            )
                        });
                    } else {
                        columnKeys.push({ 'key' : rootKeys[i] });
                    }
                } else if (objectWithAllItemKeys[rootKeys[i]] && typeof objectWithAllItemKeys[rootKeys[i]] === 'object'){
                    const itemAtID = typeof objectWithAllItemKeys[rootKeys[i]].display_title === 'string' && itemUtil.atId(objectWithAllItemKeys[rootKeys[i]]);
                    if (itemAtID) {
                        columnKeys.push({ 'key' : rootKeys[i] }); // Keep single key if is an Item, we'll make it into a link.
                    } else { // Flatten up, otherwise.
                        columnKeys = columnKeys.concat(
                            _.keys(objectWithAllItemKeys[rootKeys[i]]).map(function(embeddedKey){
                                return { 'key' : rootKeys[i] + '.' + embeddedKey };
                            })
                        );
                    }
                }
            }

        }

        return columnKeys.filter((k)=>{
            if (columnDefinitions){
                if (columnDefinitions[k.key]){
                    if (typeof columnDefinitions[k.key].hide === 'boolean' && columnDefinitions[k.key].hide) return false;
                    if (typeof columnDefinitions[k.key].hide === 'function'){
                        return !(columnDefinitions[k.key].hide(objectWithAllItemKeys));
                    }
                }
            }
            return true;
        }).sort(function(a,b){
            if (['title', 'display_title', 'accession'].indexOf(a.key) > -1) return -5;
            if (['title', 'display_title', 'accession'].indexOf(b.key) > -1) return 5;
            if (['name', 'workflow_argument_name'].indexOf(a.key) > -1) return -4;
            if (['name', 'workflow_argument_name'].indexOf(b.key) > -1) return 4;
            if (['step', 'step_argument_name'].indexOf(a.key) > -1) return -3;
            if (['step', 'step_argument_name'].indexOf(b.key) > -1) return 3;
            if (['value'].indexOf(a.key) > -1) return -2;
            if (['value'].indexOf(b.key) > -1) return 2;
            return 0;
        }).sort(function(a,b){
            // Push columns with child/embedded object lists to the end.
            if (Array.isArray(a.childKeys)) return 1;
            if (Array.isArray(b.childKeys)) return -1;
            return 0;
        });
    }


    static jsonify(val, key){
        let newVal;
        try {
            newVal = JSON.stringify(val);
            if (_.keys(val).length > 1){
                console.error("ERROR: Value for table cell is not a string, number, or JSX element.\nKey: " + key + '; Value: ' + newVal);
            }
            newVal = <code>{ newVal.length <= 25 ? newVal : newVal.slice(0,25) + '...' }</code>;
        } catch (e){
            console.error(e, val);
            newVal = <em>{'{obj}'}</em>;
        }
        return newVal;
    }

    static getAttachmentTitle(val, fallbackTitle){
        if (typeof val === 'string') {
            const split_item = val.split('/');
            const attach_title = decodeURIComponent(split_item[split_item.length - 1]);
            return attach_title || fallbackTitle;
        }

        return fallbackTitle;
    }

    constructor(props){
        super(props);
        this.state = { 'mounted' : false };
    }

    componentDidMount(){
        this.setState({ 'mounted' : true });
    }

    render(){
        const { items, columnDefinitions, parentKey, atType, schemas, termTransformFxn } = this.props;
        const { mounted } = this.state;
        let columnKeys = SubItemTable.getColumnKeys(items, columnDefinitions, schemas);

        // If is an Item, grab properties for it.
        let tipsFromSchemaRes = null;
        if (items[0] && items[0].display_title){
            tipsFromSchemaRes = tipsFromSchema(schemas, items[0]);
            columnKeys = columnKeys.filter(function(k){
                if (k === '@id') return false;
                return true;
            });
        }

        // TODO: Get rid of this.
        var subListKeyWidths = this.subListKeyWidths;
        if (!subListKeyWidths){
            subListKeyWidths = this.subListKeyWidths = !mounted || !this.subListKeyRefs ? null : (function(refObj){
                const keys = _.keys(refObj);
                const widthObj = {};
                for (var i = 0; i < keys.length; i++){
                    widthObj[keys[i]] = _.object(_.pairs(refObj[keys[i]]).map(function(refSet){
                        //var colKey = refSet[1].getAttribute('data-key');
                        var colRows = Array.from(document.getElementsByClassName('child-column-' + keys[i] + '.' + refSet[0]));
                        var maxWidth = Math.max(
                            _.reduce(colRows, function(m,v){ return Math.max(m,v.offsetWidth); }, 0),
                            refSet[1].offsetWidth + 10
                        );
                        return [ refSet[0], maxWidth /*refSet[1].offsetWidth*/ ];
                    }));
                }
                return widthObj;
            })(this.subListKeyRefs);
        }

        const rowData = _.map(items, function(item){
            return _.map(columnKeys, (colKeyContainer, colKeyIndex)=>{
                const colKey = colKeyContainer.key;
                const value = getNestedProperty(item, colKey);

                if (!value && value !== 0) {
                    return { 'value' : '-', 'key' : colKey };
                }
                if (typeof columnDefinitions[parentKey + '.' + colKey] !== 'undefined'){
                    if (typeof columnDefinitions[parentKey + '.' + colKey].render === 'function'){
                        return {
                            'value' : columnDefinitions[parentKey + '.' + colKey].render(value, item, colKeyIndex, items),
                            'colKey' : colKey
                        };
                    }
                }
                if (Array.isArray(value)) {
                    if (_.all(value, function(v){ return typeof v === 'string'; })){
                        return { 'value' : value.map(function(v){ return termTransformFxn(colKey, v); }).join(', '), 'key' : colKey };
                    }
                    /**
                     * Catch the case where the childKeys array is not provided in colKeyContainer. This means they are objects,
                     * and the colKeyContainer contains one field called "key", which, in the case of the secondary file
                     * formats, says "secondary_file_formats"
                     */
                    if (_.any(value, function(v){ return typeof v === 'object' && v; }) && colKeyContainer.childKeys == null) {
                        const links = value.map((link, i) => (<span key={i}><a href={itemUtil.atId(link)} className="link-underline-hover">{ link.display_title }</a></span>));
                        return { 'value' : <div className="d-flex flex-column">{links}</div>, 'key' : colKey };
                    }


                    if (_.any(value, function(v){ return typeof v === 'object' && v; }) && Array.isArray(colKeyContainer.childKeys)){ // Embedded list of objects.
                        const allKeys = colKeyContainer.childKeys; //_.keys(  _.reduce(value, function(m,v){ return _.extend(m,v); }, {})   );
                        return {
                            'value' : _.map(value, function(embeddedRow, i){
                                return (
                                    <div style={{ whiteSpace: "nowrap" }} className="text-start child-list-row" key={colKey + '--row-' + i}>
                                        <div className="d-inline-block child-list-row-number">{ i + 1 }.</div>
                                        { allKeys.map((k, j)=>{
                                            var renderedSubVal;// = Schemas.Term.toName(k, embeddedRow[k]);
                                            if (typeof columnDefinitions[parentKey + '.' + colKey + '.' + k] !== 'undefined'){
                                                if (typeof columnDefinitions[parentKey + '.' + colKey + '.' + k].render === 'function'){
                                                    renderedSubVal = columnDefinitions[parentKey + '.' + colKey + '.' + k].render(embeddedRow[k], embeddedRow, colKeyIndex, value);
                                                }
                                            }
                                            if (!renderedSubVal && embeddedRow[k] && typeof embeddedRow[k] === 'object' && !isAnItem(embeddedRow[k])){
                                                renderedSubVal = <code>{ JSON.stringify(embeddedRow[k]) }</code>;
                                            }
                                            if (!renderedSubVal) {
                                                renderedSubVal = isAnItem(embeddedRow[k]) ?
                                                    <a href={itemUtil.atId(embeddedRow[k])} className="link-underline-hover">{ itemUtil.getTitleStringFromContext(embeddedRow[k]) }</a>
                                                    :
                                                    termTransformFxn(k, embeddedRow[k]);
                                            }
                                            return (
                                                <div
                                                    key={colKey + '.' + k + '--row-' + i}
                                                    className={"d-inline-block child-column-" + colKey + '.' + k}
                                                    style={{ width : !subListKeyWidths ? null : ((subListKeyWidths[colKey] || {})[k] || null) }}
                                                >
                                                    { renderedSubVal }
                                                </div>
                                            );
                                        }) }
                                    </div>
                                );
                            }),
                            'className' : 'child-list-row-container',
                            'key' : colKey
                        };
                    }
                }
                if (isAnItem(value)) {
                    return { 'value' : <a href={itemUtil.atId(value)} className="link-underline-hover">{ value.display_title }</a>, 'key' : colKey };
                }
                if (typeof value === 'string' && value.length < 25) {
                    return { 'value' : termTransformFxn(colKey, value), 'className' : 'no-word-break', 'key' : colKey };
                }
                return { 'value' : termTransformFxn(colKey, value), 'key' : colKey };
            });
        });

        // Get property of parent key which has items.properties : { ..these_keys.. }
        const parentKeySchemaProperty = getSchemaProperty(parentKey, schemas, {}, atType);

        const keyTitleDescriptionMap = _.extend(
            {},
            // We have list of sub-embedded Items or sub-embedded objects which have separate 'get properties from schema' funcs (== tipsFromSchema || parentKeySchemaProperty).
            flattenSchemaPropertyToColumnDefinition(tipsFromSchema || parentKeySchemaProperty, 0, schemas),
            columnDefinitions
        );

        const subListKeyRefs = this.subListKeyRefs = {};

        return (
            <div className="detail-embedded-table-container">
                <table className="detail-embedded-table">
                    <thead>
                        <tr>
                            {
                                [<th key="rowNumber" style={{ minWidth: 36, maxWidth : 36, width: 36 }}>#</th>].concat(columnKeys.map((colKeyContainer, colIndex)=>{
                                    //var tips = tipsFromSchema(Schemas.get(), context) || {};
                                    const colKey = colKeyContainer.key;
                                    const title = (
                                        (keyTitleDescriptionMap[parentKey + '.' + colKey] && keyTitleDescriptionMap[parentKey + '.' + colKey].title) ||
                                        (keyTitleDescriptionMap[colKey] && keyTitleDescriptionMap[colKey].title) ||
                                        colKey
                                    );
                                    const tooltip = (
                                        (keyTitleDescriptionMap[parentKey + '.' + colKey] && keyTitleDescriptionMap[parentKey + '.' + colKey].description) ||
                                        (keyTitleDescriptionMap[colKey] && keyTitleDescriptionMap[colKey].description) ||
                                        null
                                    );
                                    const hasChildren = Array.isArray(colKeyContainer.childKeys) && colKeyContainer.childKeys.length > 0;
                                    return (
                                        <th key={"header-for-" + colKey} className={hasChildren ? 'has-children' : null}>
                                            <TooltipInfoIconContainer title={title} tooltip={tooltip}/>
                                            {
                                                hasChildren ? (()=>{
                                                    //var subKeyTitleDescriptionMap = (((this.props.keyTitleDescriptionMap || {})[this.props.parentKey] || {}).items || {}).properties || {};
                                                    //var subKeyTitleDescriptionMap = keyTitleDescriptionMap[this.props.parentKey + '.' + colKey] || keyTitleDescriptionMap[colKey] || {};
                                                    const subKeyTitleDescriptionMap = (( (keyTitleDescriptionMap[parentKey + '.' + colKey] || keyTitleDescriptionMap[colKey]) || {}).items || {}).properties || {};
                                                    subListKeyRefs[colKey] = {};
                                                    return (
                                                        <div style={{ whiteSpace: "nowrap" }} className="sub-list-keys-header">
                                                            {
                                                                [<div key="sub-header-rowNumber" className="d-inline-block child-list-row-number">&nbsp;</div>].concat(colKeyContainer.childKeys.map((ck)=>
                                                                    <div key={"sub-header-for-" + colKey + '.' + ck} className="d-inline-block" data-key={colKey + '.' + ck} ref={function(r){
                                                                        if (r) subListKeyRefs[colKey][ck] = r;
                                                                    }} style={{ 'width' : !subListKeyWidths ? null : ((subListKeyWidths[colKey] || {})[ck] || null) }}>
                                                                        <TooltipInfoIconContainer
                                                                            title={(keyTitleDescriptionMap[parentKey + '.' + colKey + '.' + ck] || subKeyTitleDescriptionMap[ck] || {}).title || ck}
                                                                            tooltip={(keyTitleDescriptionMap[parentKey + '.' + colKey + '.' + ck] || subKeyTitleDescriptionMap[ck] || {}).description || null}
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    );
                                                })()
                                                    : null
                                            }
                                        </th>
                                    );
                                }))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            _.map(rowData, function(row,i){
                                const rowAtId = _.find(row, (elem) => elem.key === '@id');
                                const rowAtIdValue = rowAtId ? rowAtId.value : null;
                                return (
                                    <tr key={"row-" + i}>
                                        {
                                            [<td key="rowNumber">{ i + 1 }.</td>]
                                                .concat(row.map(function(colVal, j){
                                                    let { value: val, className } = colVal;
                                                    if (typeof val === 'boolean'){
                                                        val = <code>{ val ? 'True' : 'False' }</code>;
                                                    }
                                                    if (colVal.key === '@id' && val.slice(0,1) === '/') {
                                                        val = <a href={val} className="link-underline-hover">{ val }</a>;
                                                    }
                                                    if (val && typeof val === 'object' && !React.isValidElement(val) && !Array.isArray(val)) {
                                                        if (isAnItem(val)) {
                                                            val = <a href={itemUtil.atId(val)} className="link-underline-hover">{val.display_title}</a>;
                                                        } else if (isAnAttachment(val) && (val.href.charAt(0) === '/' || rowAtIdValue)) {
                                                            const attachmentTitle = SubItemTable.getAttachmentTitle(val.href, 'attached_file');
                                                            const attachmentHref = val.href.charAt(0) === '/' ? val.href : rowAtIdValue + val.href;
                                                            val = <a href={attachmentHref} className="link-underline-hover" target="_blank" rel="noreferrer noopener">{attachmentTitle}</a>;
                                                        } else {
                                                            val = SubItemTable.jsonify(val, columnKeys[j].key);
                                                        }
                                                    }
                                                    if (Array.isArray(val) && val.length > 0 && !_.all(val, React.isValidElement)) {
                                                        const renderAsList = val.length > 1;
                                                        val = _.map(val, function (v, i) {
                                                            let item = null;
                                                            if (isAnItem(v)) {
                                                                item = <a href={itemUtil.atId(v)} className="link-underline-hover">{v.display_title}</a>;
                                                            } else if (isAnAttachment(v) && (val.href.charAt(0) === '/' || rowAtIdValue)) {
                                                                const attachmentTitle = SubItemTable.getAttachmentTitle(v.href, 'attached_file');
                                                                const attachmentHref = val.href.charAt(0) === '/' ? val.href : rowAtIdValue + val.href;
                                                                val = <a href={attachmentHref} className="link-underline-hover" target="_blank" rel="noreferrer noopener">{attachmentTitle}</a>;
                                                            } else {
                                                                item = SubItemTable.jsonify(v, columnKeys[j].key + ':' + i);
                                                            }
                                                            return renderAsList ? <li key={i}>{item}</li> : item;
                                                        });
                                                        if (renderAsList) {
                                                            val = <ol>{val}</ol>;
                                                            className += ' text-start';
                                                        }
                                                    }
                                                    return (
                                                        <td key={("column-for-" + columnKeys[j].key)} className={className || null}>
                                                            { val }
                                                        </td>
                                                    );
                                                }))
                                        }
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }

}


class DetailRow extends React.PureComponent {

    constructor(props){
        super(props);
        this.handleToggle = this.handleToggle.bind(this);
        this.state = { 'isOpen' : false };
    }

    /**
     * Handler for rendered title element. Toggles visiblity of Subview.
     *
     * @param {React.SyntheticEvent} e - Mouse click event. Its preventDefault() method is called.
     * @returns {void}
     */
    handleToggle(e){
        e.preventDefault();
        this.setState(function({ isOpen }){
            return { 'isOpen' : !isOpen };
        });
    }

    render(){
        const { label, labelNumber, item, popLink, itemType, columnDefinitions, className, schemas, termTransformFxn, "data-key": key } = this.props;
        const { isOpen } = this.state;
        let value = Detail.formValue(item, popLink, key, itemType, columnDefinitions, 0, schemas, termTransformFxn);
        let labelToShow = label;

        if (labelNumber) {
            labelToShow = (
                <span>
                    <span className={"label-number right d-inline-block" + (isOpen ? ' active' : '')}><span className="number-icon text-200">#</span> { labelNumber }</span>
                    { label }
                </span>
            );
        }

        // For Input Arguments in MetaWorkflows that do not display as tables, 
        // replace number with argument name
        if (this.props.itemType === "MetaWorkflow" && this.props['data-key'] === "input" && value.type !== SubItemTable) {
            labelToShow = (
                <span>
                    <span className={"label-number right d-inline-block" + (isOpen ? ' active' : '')}><span className="number-icon text-200"></span> { item.argument_name }</span>
                    { label }
                </span>
            );
        }

        if (value.type === SubItemTitle) {
            // What we have here is an embedded object of some sort. Lets override its 'isOpen' & 'onToggle' functions.
            value = React.cloneElement(value, { 'onToggle' : this.handleToggle, 'isOpen' : isOpen });

            return (
                <div>
                    <PartialList.Row field={key} label={labelToShow} className={(className || '') + (isOpen ? ' open' : '')}>{ value }</PartialList.Row>
                    <SubItemListView {...{ popLink, schemas, isOpen, termTransformFxn }} content={item}
                        columnDefinitions={value.props.columnDefinitions || columnDefinitions} // Recursively pass these down
                    />
                </div>
            );
        }

        if (value.type === "ol" && value.props.children[0] && value.props.children[0].type === "li" &&
            value.props.children[0].props.children && value.props.children[0].props.children.type === SubItemTitle) {
            // What we have here is a list of embedded objects. Render them out recursively and adjust some styles.
            return (
                <div className="array-group" data-length={item.length}>
                    { React.Children.map(value.props.children, (c, i)=>
                        <DetailRow {...this.props} label={i === 0 ? labelToShow : <span className="dim-duplicate">{ labelToShow }</span>} labelNumber={i + 1} item={item[i]}
                            className={("array-group-row item-index-" + i) + (i === item.length - 1 ? ' last-item' : '') + (i === 0 ? ' first-item' : '')} />
                    ) }
                </div>
            );
        }
        // Default / Pass-Thru
        return <PartialList.Row label={labelToShow} field={key} className={(className || '') + (isOpen ? ' open' : '')}>{ value }</PartialList.Row>;
    }

}


/**
 * The list of properties contained within ItemDetailList.
 * Isolated to allow use without existing in ItemDetailList parent.
 *
 * @class Detail
 * @type {Component}
 */
export class Detail extends React.PureComponent {

    /**
     * Formats the correct display for each metadata field.
     *
     * @param {Object} tips - Mapping of field property names (1 level deep) to schema properties.
     * @param {string} key - Key to use to get 'description' for tooltip from the 'tips' param.
     * @param {boolean} [includeTooltip=false] - If false, skips adding tooltip to output JSX.
     * @returns {JSX.Element} <div> element with a tooltip and info-circle icon.
     */
    static formKey(tips, key, includeTooltip = true){
        var tooltip = null, title = null;
        if (tips[key]){
            var info = tips[key];
            if (info.title)         title = info.title;
            if (!includeTooltip)    return title;
            if (info.description)   tooltip = info.description;
        }

        return <TooltipInfoIconContainer title={title || key} tooltip={tooltip} />;
    }

    /**
    * Recursively render keys/values included in a provided item.
    * Wraps URLs/paths in link elements. Sub-panels for objects.
    *
    * @todo cleanup, probably not have as a static func.
    *
    * @param {Item} item - JSON of an Item.
    * @param {boolean} [popLink=false] - Whether to open child links in new window.
    * @param {string} keyPrefix - Not sure. Key to use to get value with?
    * @param {string} atType - Current type of Item.
    * @param {ColumnDefinition[]} columnDefinitions - List of column definitions to use for SubItemTable.
    * @param {number} depth - Current recursive depth.
    * @returns {JSX.Element}
    */
    static formValue(
        item,
        popLink = false,
        keyPrefix = '', // rename to 'field'?
        atType = 'ExperimentSet',
        columnDefinitions,
        depth = 0,
        schemas = null,
        termTransformFxn = function(field, term){ return term; }
    ) {
        if (item === null){
            return <span>No Value</span>;
        } else if (Array.isArray(item)) {

            if (SubItemTable.shouldUseTable(item, schemas)) {
                return <SubItemTable {...{ popLink, columnDefinitions, schemas, atType, termTransformFxn }} items={item} parentKey={keyPrefix} />;
            } else if (SubItemTable.isMultiDimArray(item, isPrimitive)) {
                item = _.zip(...item);
                return (
                    <ol>
                        {item.map(function (it, i) { return <li key={i}>{JSON.stringify(it, null, 1)}</li>; })}
                    </ol>
                );
            }

            return (
                <ol>
                    {   item.length === 0 ? <li><em>None</em></li>
                        :
                        // Recursively render sub-items by calling [formValue]
                        item.map(function(it, i){
                            return <li key={i}>{ Detail.formValue(it, popLink, keyPrefix, atType, columnDefinitions, depth + 1, schemas) }</li>;
                        })
                    }
                </ol>
            );
        } else if (typeof item === 'object' && item !== null) {
            const linkElement = itemUtil.generateLink(item, true, 'display_title', { 'target' : (popLink ? '_blank' : null) }, true);

            // if the following is true, we have an embedded Item. Link to it.
            if (linkElement){
                return linkElement;
            } else { // it must be an embedded sub-object (not Item)
                const releventProperties = _.object(
                    _.map(_.filter(_.pairs(columnDefinitions), function(c){ return c[0].indexOf(keyPrefix + '.') === 0; }), function(c){ c[0] = c[0].replace(keyPrefix + '.', ''); return c; })
                );
                return (
                    <SubItemTitle schemas={schemas} content={item}
                        key={keyPrefix} countProperties={_.keys(item).length}
                        popLink={popLink} columnDefinitions={releventProperties} />
                );
            }
        } else if (typeof item === 'string'){

            if (keyPrefix === '@id'){
                return <a key={item} href={item} className="link-underline-hover" target={popLink ? "_blank" : null} rel="noreferrer noopener">{item}</a>;
            }

            if(item.charAt(0) === '/' && item.indexOf('@@download') > -1){
                // This is a download link. Format appropriately
                const attach_title = SubItemTable.getAttachmentTitle(item);
                return <a key={item} href={item} className="link-underline-hover" target="_blank" download rel="noreferrer noopener">{ attach_title || item }</a>;
            } else if (item.charAt(0) === '/') {
                if (popLink) return <a key={item} href={item} className="link-underline-hover" target="_blank" rel="noreferrer noopener">{ item }</a>;
                else return <a key={item} href={item} className="link-underline-hover">{ item }</a>;
            } else {
                // TODO: more comprehensive regexp url validator needed, look at: https://stackoverflow.com/a/5717133
                // Is a URL. Check if we should render it as a link/uri.
                const schemaProperty = getSchemaProperty(keyPrefix, schemas || {}, atType);
                const schemaPropertyFormat = (schemaProperty && typeof schemaProperty.format === 'string' && schemaProperty.format.toLowerCase()) || null;
                if (schemaPropertyFormat && ['uri','url'].indexOf(schemaPropertyFormat) > -1 && item.slice(0,4) === 'http') {
                    return <a key={item} href={item} className="link-underline-hover" target="_blank" rel="noreferrer noopener">{ item }</a>;
                } else {
                    return <span>{ termTransformFxn(keyPrefix, item) }</span>;
                }
            }
        } else if (typeof item === 'number'){
            return <span>{ termTransformFxn(keyPrefix, item) }</span>;
        } else if (typeof item === 'boolean'){
            return <span style={{ 'textTransform' : 'capitalize' }}>{ (item + '') }</span>;
        }
        return(<span>{ item }</span>); // Fallback
    }

    static SubItemTitle = SubItemTitle;

    static propTypes = {
        'context' : PropTypes.object.isRequired,
        'columnDefinitions' : PropTypes.object
    };

    /** For the most part, these are 4DN-specific and overriden as needed in CGAP portal. */
    static defaultProps = {
        'excludedKeys' : [
            '@context', 'actions', 'principals_allowed',
            // Visible elsewhere on page
            'lab', 'award', 'description',
            '@id', 'display_title',
            'aggregated-items'
        ],
        'stickyKeys' : [
            'display_title', 'title',
            // Experiment Set
            'experimentset_type', 'date_released',
            // Experiment
            'experiment_type', 'experiment_summary', 'experiment_sets', 'files', 'filesets',
            'protocol', 'biosample', 'digestion_enzyme', 'digestion_temperature',
            'digestion_time', 'ligation_temperature', 'ligation_time', 'ligation_volume',
            'tagging_method',
            // Experiment Type
            'experiment_category', 'assay_classification', 'assay_subclassification',
            'assay_subclass_short', 'sop', 'reference_pubs', 'raw_file_types',
            'controlled_term', 'other_protocols', 'other_tags',
            // Biosample
            'biosource','biosource_summary','biosample_protocols','modifications_summary',
            'treatments_summary',
            // File
            'filename', 'file_type', 'file_format', 'href', 'notes', 'flowcell_details',
            // Lab
            'awards', 'address1', 'address2', 'city', 'country', 'institute_name', 'state',
            // Award
            'end_date', 'project', 'uri', 'ID',
            // Document
            'attachment',
            // Things to go at bottom consistently
            'aliases',
        ],
        'alwaysCollapsibleKeys' : [
            '@type',
            'accession',
            'schema_version',
            'uuid',
            'replicate_exps',
            'status',
            'external_references',
            'date_created',
            'last_modified',
            'submitted_by',
            'project_release',
            'short_attribution',
            'validation-errors'
        ],
        'open' : null,
        'columnDefinitionMap' : {
            '@id' : {
                'title' : 'Link',
                'description' : 'Link to Item'
            },
            'subscriptions.url' : {
                'render' : function(value){
                    var fullUrl = '/search/' + value;
                    return <a href={fullUrl} className="link-underline-hover">View Results</a>;
                },
                'title' : "Link",
                'description' : "Link to results matching subscription query."
            },
            'subscriptions.title' : {
                'title' : "Subscription",
                'description' : "Title of Subscription"
            },
            'experiment_sets.experimentset_type' : {
                'title' : "Type",
                'description' : "Experiment Set Type"
            },
            'display_title' : {
                'title' : "Title",
                'description' : "Title of Item",
                'hide' : function(valueProbe){
                    if (!valueProbe || !valueProbe.display_title) return true;
                    if (valueProbe.accession && valueProbe.accession === valueProbe.display_title) return true;
                    return false;
                }
            },
            'email' : {
                'title' : "E-Mail",
                'render' : function(value){
                    if (typeof value === 'string' && value.indexOf('@') > -1) {
                        return <a href={'mailto:' + value} className="link-underline-hover">{ value }</a>;
                    }
                    return value;
                }
            }
        },
        'termTransformFxn' : function(field, term){ return term; }
    };

    static columnDefinitions(context, schemas, columnDefinitionMap){
        var colDefsFromSchema = flattenSchemaPropertyToColumnDefinition(schemas ? tipsFromSchema(schemas, context) : {}, 0, schemas);
        return _.extend(colDefsFromSchema, columnDefinitionMap || {}); // { <property> : { 'title' : ..., 'description' : ... } }
    }

    static generatedKeysLists(context, excludedKeys, stickyKeys, alwaysCollapsibleKeys){
        const sortKeys = _.difference(_.keys(context).sort(), excludedKeys.sort());

        // Sort applicable persistent keys by original persistent keys sort order.
        const stickyKeysObj = _.object(
            _.intersection(sortKeys, stickyKeys.slice(0).sort()).map(function(key){
                return [key, true];
            })
        );
        var orderedStickyKeys = [];
        stickyKeys.forEach(function (key) {
            if (stickyKeysObj[key] === true) orderedStickyKeys.push(key);
        });

        var extraKeys = _.difference(sortKeys, stickyKeys.slice(0).sort());
        var collapsibleKeys = _.intersection(extraKeys.sort(), alwaysCollapsibleKeys.slice(0).sort());
        extraKeys = _.difference(extraKeys, collapsibleKeys);

        return {
            'persistentKeys' : orderedStickyKeys.concat(extraKeys),
            'collapsibleKeys' : collapsibleKeys
        };
    }

    constructor(props){
        super(props);
        this.renderDetailRow = this.renderDetailRow.bind(this);
        this.memoized = {
            columnDefinitions: memoize(Detail.columnDefinitions),
            generatedKeysLists: memoize(Detail.generatedKeysLists)
        };
    }

    renderDetailRow(key, idx){
        const { context, popLink, schemas, columnDefinitions, termTransformFxn } = this.props;
        const colDefs = this.memoized.columnDefinitions(context, schemas, columnDefinitions);

        return (
            <DetailRow key={key} label={Detail.formKey(colDefs, key)} item={context[key]} popLink={popLink}
                data-key={key} itemType={context['@type'] && context['@type'][0]} columnDefinitions={colDefs}
                termTransformFxn={termTransformFxn} schemas={schemas} />
        );
    }

    render(){
        const { context, excludedKeys, stickyKeys, alwaysCollapsibleKeys, open } = this.props;
        const { persistentKeys, collapsibleKeys } = this.memoized.generatedKeysLists(context, excludedKeys, stickyKeys, alwaysCollapsibleKeys);
        return (
            <div className="overflow-hidden">
                <PartialList persistent={_.map(persistentKeys, this.renderDetailRow)} collapsible={ _.map(collapsibleKeys, this.renderDetailRow)} open={open} />
            </div>
        );
    }

}


const ToggleJSONButton = React.memo(function ToggleJSONButton({ onClick, showingJSON, className }){
    return (
        <div className="d-grid gap-1">
            <button type="button" className="btn btn-outline-secondary" onClick={onClick}>
                {showingJSON ?
                    <React.Fragment><i className="icon fas icon-fw icon-list" /> View as List</React.Fragment>
                    :
                    <React.Fragment><i className="icon fas icon-fw icon-code" /> View as JSON</React.Fragment>
                }
            </button>
        </div>
    );
});

const SeeMoreRowsButton = React.memo(function SeeMoreRowsButton({ onClick, collapsed, className }){
    return (
        <div className="d-grid gap-1">
            <button type="button" className="btn btn-outline-secondary" onClick={onClick}>
                {collapsed ? "See advanced information" : "Hide"}
            </button>
        </div>
    );
});


/**
 * A list of properties which belong to Item shown by ItemView.
 * Shows 'persistentKeys' fields & values stickied near top of list,
 * 'excludedKeys' never, and 'hiddenKeys' only when "See More Info" button is clicked.
 *
 * @class
 * @type {Component}
 */
export class ItemDetailList extends React.PureComponent {

    static Detail = Detail;

    static getTabObject(props){
        return {
            tab : <span><i className="icon fas icon-list icon-fw"/> Details</span>,
            key : 'details',
            content : (
                <div>
                    <h3 className="tab-section-title">
                        <span>Details</span>
                    </h3>
                    <hr className="tab-section-title-horiz-divider mb-05"/>
                    <ItemDetailList {...props} />
                </div>
            )
        };
    }

    static defaultProps = {
        'showJSONButton' : true,
        'hideButtons': false,
        'columnDefinitionMap' : Detail.defaultProps.columnDefinitionMap
    };

    constructor(props){
        super(props);
        this.handleToggleJSON = this.handleToggleJSON.bind(this);
        this.handleToggleCollapsed = this.handleToggleCollapsed.bind(this);
        this.state = {
            'collapsed' : true,
            'showingJSON' : false
        };
    }

    handleToggleJSON(){
        this.setState(function({ showingJSON }){
            return { "showingJSON" : !showingJSON };
        });
    }

    handleToggleCollapsed(){
        this.setState(function({ collapsed }){
            return { "collapsed" : !collapsed };
        });
    }

    componentDidMount(){
        ReactTooltip.rebuild();
    }

    componentDidUpdate(pastProps, pastState){
        if (this.state.showingJSON === false && pastState.showingJSON === true){
            ReactTooltip.rebuild();
        }
    }

    render(){
        const {
            keyTitleDescriptionMap, columnDefinitionMap, minHeight, context,
            collapsed : propCollapsed, hideButtons, showJSONButton
        } = this.props;
        const { showingJSON, collapsed } = this.state;
        let body;

        if (showingJSON){
            body = (
                <React.Fragment>
                    <div className="json-tree-wrapper">
                        <JSONTree data={context} />
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-12 col-sm-6">
                            <ToggleJSONButton onClick={this.handleToggleJSON} showingJSON={showingJSON} />
                        </div>
                    </div>
                </React.Fragment>
            );
        } else {
            const colDefs = _.extend(
                {},
                columnDefinitionMap || {},
                keyTitleDescriptionMap || {},
            );
            let isCollapsed;
            if (typeof propCollapsed === 'boolean') isCollapsed = propCollapsed;
            else isCollapsed = collapsed;
            let buttonsRow;
            if (hideButtons) {
                buttonsRow = null;
            } else if (!showJSONButton){
                buttonsRow = (
                    <div className="row">
                        <div className="col-12">
                            <SeeMoreRowsButton onClick={this.handleToggleCollapsed} collapsed={collapsed}/>
                        </div>
                    </div>
                );
            } else {
                buttonsRow = (
                    <div className="row">
                        <div className="col-6">
                            <SeeMoreRowsButton onClick={this.handleToggleCollapsed} collapsed={collapsed}/>
                        </div>
                        <div className="col-6">
                            <ToggleJSONButton onClick={this.handleToggleJSON} showingJSON={showingJSON} />
                        </div>
                    </div>
                );
            }

            body = (
                <React.Fragment>
                    <Detail {...this.props} open={!isCollapsed} columnDefinitions={colDefs}/>
                    { buttonsRow }
                </React.Fragment>
            );

        }

        return (
            <div className="item-page-detail" style={typeof minHeight === 'number' ? { minHeight } : null}>
                { body }
            </div>
        );
    }

}
