/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Select.style';

/**
 * Select component
 * @class Select
 */
class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectValue: ''
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { selectValue } = state;
        const { selectedOption, options } = props;
        const tempData = [];
        const selectedFilter = options.reduce((selectedFilter, option) => {
            if (option && option.id === selectedOption) {
                tempData.push(option.id);
            }

            return tempData;
        }, 0);

        if (!selectValue) return { selectValue: selectedFilter[0] };

        return null;
    }

    /**
     * Handle Sort key change
     * @param {Object} option
     * @return {void}
     */
    onGetKey(key) {
        const { onGetKey } = this.props;

        this.setState({ selectValue: key });
        onGetKey(key);
    }

    /**
     * Render items for desktop dropdown
     * @returns {void}
     */
    renderItems() {
        const { options } = this.props;

        return options.map(option => (
            <li
              key={ option.value }
              role="presentation"
              onClick={ () => this.onGetSortKey(option.value) }
              onKeyPress={ () => this.onGetSortKey(option.value) }
            >
            {option.label}
            </li>
        ));
    }

    /**
     * Render select options
     * @returns {void}
     */
    renderOptions() {
        const { options } = this.props;

        return options.map(option => (
            <option
              key={ option.value }
              value={ option.value }
              tabIndex={ 0 }
            >
                { option.label }
            </option>
        ));
    }

    render() {
        // TODO add select as possible child type name in form component
        const { selectedOption, formRef } = this.props;

        return (
            <div block="Select" elem="Container">
                <div block="Select" elem="Wrapper">
                    <div block="Select" elem="Current">
                        <select
                          block="Select"
                          elem="Form"
                          ref={ formRef }
                          value={ selectedOption }
                          onChange={ e => this.onGetSortKey(e.target.value) }
                        >
                            { this.renderOptions() }
                        </select>
                        <div block="Select" elem="Arrow" />
                    </div>
                    <ul block="Select" elem="Elements" role="presentation">
                        { this.renderItems() }
                    </ul>
                </div>
            </div>
        );
    }
}

Select.propTypes = {
    onGetKey: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string
        })
    ).isRequired,
    formRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]).isRequired
};

Select.defaultProps = {
    formRef: null
};

export default Select;
