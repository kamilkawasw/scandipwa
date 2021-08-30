/* eslint-disable spaced-comment */
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

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Field from 'Component/PureForm/Field';
import { FIELD_TYPE } from 'Component/PureForm/Field/Field.config';
import FieldGroup from 'Component/PureForm/FieldGroup';
import {
    getBundleOption, getMaxQuantity, getMinQuantity, getProductInStock
} from 'Util/Product/Extract';
import { bundleOptionToLabel, getEncodedBundleUid } from 'Util/Product/Transform';
import { VALIDATION_INPUT_TYPE_NUMBER } from 'Util/Validator/Config';

export class BundleOption extends PureComponent {
    static propTypes = {
        uid: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        quantity: PropTypes.array.isRequired,
        setQuantity: PropTypes.func.isRequired,
        isRequired: PropTypes.bool.isRequired,
        options: PropTypes.arrayOf(PropTypes.object).isRequired,
        currencyCode: PropTypes.string.isRequired,
        activeSelectUid: PropTypes.string.isRequired,
        setActiveSelectUid: PropTypes.func.isRequired,
        getDropdownOptions: PropTypes.func.isRequired,
        updateSelectedValues: PropTypes.func.isRequired
    };

    renderMap = {
        [FIELD_TYPE.checkbox]: this.renderCheckBoxValues.bind(this),
        [FIELD_TYPE.multi]: this.renderCheckBoxValues.bind(this),
        [FIELD_TYPE.radio]: this.renderRadioValues.bind(this),
        [FIELD_TYPE.select]: this.renderSelectValue.bind(this)
    };

    componentDidMount() {
        const { updateSelectedValues } = this.props;
        updateSelectedValues();
    }

    //#refion ERROR
    // eslint-disable-next-line no-magic-numbers
    getError(quantity, stock, min = -1, max = 999, value) {
        if (!value) {
            return true;
        } if (quantity < min) {
            return __('Min quantity %s!', min);
        } if (quantity > max) {
            return __('Max quantity %s!', max);
        } if (!stock) {
            return __('Product is out of stock!');
        }

        return true;
    }
    //#endregion

    //#region QUANTITY CHANGE
    setQuantity(uid, quantity) {
        const { setQuantity } = this.props;
        setQuantity(uid, quantity);
    }

    renderQuantityChange(uid, quantity, product = null) {
        const min = !product ? 1 : getMinQuantity(product);
        // eslint-disable-next-line no-magic-numbers
        const max = !product ? 9999 : getMaxQuantity(product);
        // eslint-disable-next-line no-nested-ternary
        const rangedQty = quantity < min ? min : quantity > max ? max : quantity;

        if (rangedQty !== quantity) {
            this.setQuantity(uid, rangedQty);
        }

        return (
            <Field
              type={ FIELD_TYPE.number }
              attr={ {
                  id: `item_qty_${uid}`,
                  name: `item_qty_${uid}`,
                  defaultValue: rangedQty,
                  value: rangedQty,
                  min,
                  max
              } }
              validationRule={ {
                  inputType: VALIDATION_INPUT_TYPE_NUMBER.numeric,
                  isRequired: true,
                  range: {
                      min,
                      max
                  }
              } }
              events={ { onChange: this.setQuantity.bind(this, uid) } }
              validateOn={ ['onChange'] }
            />
        );
    }
    //#endregion

    //#region CHECKBOXES
    renderCheckBox = (option) => {
        const {
            uid,
            can_change_quantity: canChangeQuantity,
            product,
            quantity: defaultQuantity = 1
        } = option;

        const {
            updateSelectedValues,
            quantity: { [uid]: quantity = defaultQuantity }
        } = this.props;

        const label = this.getLabel(option);
        const min = getMinQuantity(product);
        const max = getMaxQuantity(product);
        const stock = getProductInStock(product);

        return (
            <div block="ProductBundleItem" elem="Checkbox" mods={ { customQuantity: canChangeQuantity } } key={ uid }>
                <Field
                  type={ FIELD_TYPE.checkbox }
                  label={ label }
                  attr={ {
                      id: `option-${ uid }`,
                      value: canChangeQuantity ? getEncodedBundleUid(uid, quantity) : uid,
                      name: `option-${ uid }`
                  } }
                  events={ {
                      onChange: updateSelectedValues
                  } }
                  validationRule={ {
                      match: this.getError.bind(this, quantity, stock, min, max)
                  } }
                  validateOn={ ['onChange'] }
                />
                { canChangeQuantity && this.renderQuantityChange(uid, quantity, product) }
            </div>
        );
    };

    renderCheckBoxValues(options) {
        const { isRequired } = this.props;

        return (
            <FieldGroup
              validationRule={ {
                  isRequired,
                  selector: '[type="checkbox"]'
              } }
              validateOn={ ['onChange'] }
            >
                { options.map(this.renderCheckBox) }
            </FieldGroup>
        );
    }
    //#endregion

    //#region RADIO
    renderRadio = (name, option) => {
        const {
            uid,
            can_change_quantity: canChangeQuantity,
            quantity: defaultQuantity = 1,
            product
        } = option;

        const {
            updateSelectedValues,
            quantity: { [uid]: quantity = defaultQuantity }
        } = this.props;

        const label = this.getLabel(option);
        const stock = getProductInStock(product);

        return (
            <div block="ProductBundleItem" elem="Radio" mods={ { customQuantity: canChangeQuantity } } key={ uid }>
                <Field
                  type={ FIELD_TYPE.radio }
                  label={ label }
                  attr={ {
                      id: `option-${ uid }`,
                      value: canChangeQuantity ? getEncodedBundleUid(uid, quantity) : uid,
                      name: `option-${ name }`
                  } }
                  events={ {
                      onChange: updateSelectedValues
                  } }
                  validationRule={ {
                      match: this.getError.bind(this, quantity, stock)
                  } }
                  validateOn={ ['onChange'] }
                />
                { canChangeQuantity && this.renderQuantityChange(uid, quantity, product) }
            </div>
        );
    };

    renderRadioValues(options) {
        const { isRequired, uid } = this.props;

        return (
            <FieldGroup
              validationRule={ {
                  isRequired,
                  selector: '[type="radio"]'
              } }
              validateOn={ ['onChange'] }
            >
                { options.map((option) => this.renderRadio(uid, option)) }
            </FieldGroup>
        );
    }
    //#endregion

    //#region SELECT
    updateSelect(...args) {
        const { updateSelectedValues, setActiveSelectUid } = this.props;
        const { value } = args[args.length - 1] || {};
        setActiveSelectUid(value);
        updateSelectedValues();
    }

    renderSelectValue() {
        const {
            getDropdownOptions,
            isRequired,
            uid,
            activeSelectUid,
            options
        } = this.props;

        const activeOption = getBundleOption(activeSelectUid, options);

        const {
            uid: optionUid,
            quantity: defaultQuantity = 1,
            can_change_quantity: canChangeQuantity = false,
            product = {}
        } = activeOption || {};

        const {
            quantity: { [optionUid]: quantity = defaultQuantity }
        } = this.props;

        const stock = !Object.keys(product).length ? true : getProductInStock(product);
        const min = getMinQuantity(product);
        const max = getMaxQuantity(product);

        return (
            <div block="ProductBundleItem" elem="DropdownWrapper" mods={ { customQuantity: canChangeQuantity } }>
                <Field
                  type={ FIELD_TYPE.select }
                  attr={ {
                      id: `bundle-options-dropdown-${ uid }`,
                      name: `bundle-options-dropdown-${ uid }`,
                      selectPlaceholder: __('Select product...')
                  } }
                  mix={ { block: 'ProductBundleItem', elem: 'Select' } }
                  options={ getDropdownOptions() }
                  events={ {
                      onChange: this.updateSelect.bind(this)
                  } }
                  validationRule={ {
                      isRequired,
                      match: this.getError.bind(this, quantity, stock, min, max)
                  } }
                  validateOn={ ['onChange'] }
                />
                { canChangeQuantity && this.renderQuantityChange(optionUid, quantity, product) }
            </div>
        );
    }
    //#endregion

    //#region TITLE
    renderOptionGroupTitle(title) {
        const { isRequired } = this.props;

        return (
            <div block="ProductBundleItem" elem="Heading">
                { title }
                { isRequired && <strong block="ProductBundleItem" elem="Required"> *</strong> }
            </div>
        );
    }

    getLabel(option) {
        const { currencyCode } = this.props;
        const {
            baseLabel,
            priceLabel
        } = bundleOptionToLabel(option, currencyCode);

        return (
            <>
                { baseLabel }
                <strong>{ ` ${priceLabel}` }</strong>
            </>
        );
    }
    //#endregion

    render() {
        const { title, options, type } = this.props;
        const render = this.renderMap[type];

        if (!render) {
            return null;
        }

        return (
            <div block="ProductBundleItem" elem="Wrapper">
                { title && this.renderOptionGroupTitle(title) }
                { options && render(options) }
            </div>
        );
    }
}

export default BundleOption;
