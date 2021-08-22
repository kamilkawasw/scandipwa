/* eslint-disable */
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
import { connect } from 'react-redux';

import { showNotification } from 'Store/Notification/Notification.action';
import { MixType } from 'Type/Common';
import { ProductType } from 'Type/ProductList';
import { isSignedIn } from 'Util/Auth';

import ProductWishlistButton from './ProductWishlistButton.component';

export const WishlistDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Wishlist/Wishlist.dispatcher'
);

/** @namespace Component/ProductWishlistButton/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    productsInWishlist: state.WishlistReducer.productsInWishlist,
    isAddingWishlistItem: state.WishlistReducer.isLoading
});

/** @namespace Component/ProductWishlistButton/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    addProductToWishlist: (wishlistItem) => WishlistDispatcher.then(
        ({ default: dispatcher }) => dispatcher.addItemToWishlist(dispatch, wishlistItem)
    ),
    removeProductFromWishlist: (options) => WishlistDispatcher.then(
        ({ default: dispatcher }) => dispatcher.removeItemFromWishlist(dispatch, options)
    ),
    showNotification: (type, message) => dispatch(showNotification(type, message))
});

/** @namespace Component/ProductWishlistButton/Container */
export class ProductWishlistButtonContainer extends PureComponent {
    static propTypes = {
        magentoProduct: PropTypes.object.isRequired,
        isAddingWishlistItem: PropTypes.bool.isRequired,
        productsInWishlist: PropTypes.objectOf(ProductType).isRequired,
        addProductToWishlist: PropTypes.func.isRequired,
        removeProductFromWishlist: PropTypes.func.isRequired,
        showNotification: PropTypes.func.isRequired,
        onProductValidationError: PropTypes.func,
        mix: MixType
    };

    static defaultProps = {
        mix: {},
        onProductValidationError: () => {}
    };

    state = {
        isWishlistButtonLoading: false
    };

    containerFunctions = {
        addToWishlist: this.toggleProductInWishlist.bind(this, true),
        removeFromWishlist: this.toggleProductInWishlist.bind(this, false)
    };

    componentDidUpdate(prevProps) {
        const { isAddingWishlistItem: isPrevAddingWishlistItem } = prevProps;
        const { isAddingWishlistItem } = this.props;

        if (isPrevAddingWishlistItem && !isAddingWishlistItem) {
            this.setWishlistButtonLoading(false);
        }
    }

    containerProps() {
        const { magentoProduct, mix } = this.props;

        return {
            mix,
            magentoProduct,
            isDisabled: this.isDisabled(),
            isInWishlist: this.isInWishlist(),
            isReady: this._getIsProductReady(),
            isSignedIn: isSignedIn()
        };
    }

    setWishlistButtonLoading(isLoading) {
        return this.setState({ isWishlistButtonLoading: isLoading });
    }

    toggleProductInWishlist(add = true) {
        const {
            magentoProduct,
            magentoProduct: [{ sku }] = [],
            isAddingWishlistItem,
            showNotification,
            productsInWishlist,
            addProductToWishlist,
            removeProductFromWishlist
        } = this.props;

        if (!isSignedIn()) {
            return showNotification('info', __('You must login or register to add items to your wishlist.'));
        }

        if (isAddingWishlistItem) {
            return null;
        }

        // if (product === ERROR_CONFIGURABLE_NOT_PROVIDED) {
        //     onProductValidationError(type_id);
        //
        //     return showNotification('info', __('Please, select desirable option first!'));
        // }

        this.setWishlistButtonLoading(true);

        if (add) {
            return addProductToWishlist(magentoProduct);
        }

        const { wishlist: { id: item_id } } = Object.values(productsInWishlist).find(
            ({ wishlist: { wishlistSku } }) => sku === wishlistSku
        );

        return removeProductFromWishlist(item_id);
    }

    isDisabled = () => {
        const { isAddingWishlistItem } = this.props;
        return isAddingWishlistItem || !isSignedIn();
    };

    isInWishlist = () => {
        const { productsInWishlist } = this.props;

        const { magentoProduct: [{ sku: productSku }] = [] } = this.props;

        return Object.values(productsInWishlist).findIndex(({ wishlist: { sku } }) => sku === productSku) >= 0;
    };

    _getIsProductReady() {
        // const { product: { type_id }, configurableVariantIndex } = this.props;
        //
        // if (type_id === PRODUCT_TYPE.configurable && configurableVariantIndex < 0) {
        //     return false;
        // }
        return true;
    }

    render() {
        return null;
        // const { isWishlistButtonLoading } = this.state;
        //
        // return (
        //     <ProductWishlistButton
        //       isLoading={ isWishlistButtonLoading }
        //       { ...this.containerProps() }
        //       { ...this.containerFunctions }
        //     />
        // );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductWishlistButtonContainer);
