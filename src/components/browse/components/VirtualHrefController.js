'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { load as ajaxLoad } from './../../util/ajax';
import { navigate } from './../../util/navigate';
import { getTermFacetStatus } from './../../util/search-filters';
import { patchedConsoleInstance as console } from './../../util/patched-console';
import { generateNextHref } from './FacetList';

// eslint-disable-next-line no-unused-vars
import { SearchResponse, Item, ColumnDefinition, URLParts } from './../../util/typedefs';



/**
 * Accepts and parses the `href` from Redux / App.
 * Passes `href` downstream to descendant components,
 * as well as onFilter and onClearFilters functions which
 * navigate to new href.
 */
export class VirtualHrefController extends React.PureComponent {

    static defaultProps = {
        "initialHref" : "/search/?type=Item"
    };

    constructor(props){
        super(props);
        this.onFilter = this.onFilter.bind(this);
        this.onClearFilters = this.onClearFilters.bind(this);
        this.getTermStatus = this.getTermStatus.bind(this);

        this.state = {
            "virtualHref" : props.searchHref,
            "isInitialContextLoading" : true,
            "virtualContext" : null
        };
    }

    virtualNavigate(nextHref, navOpts, callback){
        let scopedRequest;

        this.setState({ "isInitialContextLoading" : true }, ()=>{

            const onLoadResponse = (nextContext) => {
                const { total } = nextContext;
                if (scopedRequest !== this.currRequest) {
                    console.warn("This is no longer the current request");
                    return false;
                }
                if (typeof total !== "number") {
                    throw new Error("Did not get back a search response");
                }
                this.setState({
                    virtualContext: nextContext,
                    isInitialContextLoading: false,
                    virtualHref: nextHref
                }, ()=>{
                    if (typeof callback === "function"){
                        callback(nextContext);
                    }
                });
            };

            scopedRequest = this.currRequest = ajaxLoad(nextHref, onLoadResponse, "GET", onLoadResponse);
        });

        return scopedRequest;
    }

    onFilter(facet, term, callback){
        const { virtualHref, virtualContext : { filters: virtualContextFilters } } = this.state;

        return this.virtualNavigate(
            generateNextHref(virtualHref, virtualContextFilters, facet, term),
            { 'dontScrollToTop' : true },
            typeof callback === "function" ? callback : null
        );
    }

    onClearFilters(callback = null){
        const { virtualContext : { clear_filters : clearFiltersURL = null } } = this.state;

        if (!clearFiltersURL) {
            console.error("No Clear Filters URL");
            return;
        }

        this.virtualNavigate(clearFiltersURL, {}, typeof callback === 'function' ? callback : null);
    }

    getTermStatus(term, facet){
        const { virtualContext : { filters: virtualContextFilters } } = this.state;
        return getTermFacetStatus(term, facet, virtualContextFilters);
    }

    render(){
        const { children, facets: propFacets, ...passProps } = this.props;
        const {
            virtualHref: href,
            virtualContext: context,
            isInitialContextLoading
        } = this.state;

        const propsToPass = {
            ...passProps,
            href, context, isInitialContextLoading,
            // Allow facets=null to mean no facets shown. facets=undefined means to default to context.facets.
            facets: propFacets === null ? null : facets || context.facets || null,
            navigate: this.virtualNavigate,
            onFilter: this.onFilter,
            onClearFilters: this.onClearFilters,
            getTermStatus: this.getTermStatus,
        };

        return React.Children.map(children, function(child){
            return React.cloneElement(child, propsToPass);
        });
    }
}
