/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/scandipwa
 * @link https://github.com/scandipwa/scandipwa
 */

import { PureComponent } from 'react';

import Html from 'Component/Html';
import Image from 'Component/Image';
import { ImageRatio } from 'Component/Image/Image.type';
import TextPlaceholder from 'Component/TextPlaceholder';
import { TextPlaceHolderLength } from 'Component/TextPlaceholder/TextPlaceholder.config';
import { ReactElement } from 'Type/Common.type';

import { CategoryDetailsComponentProps } from './CategoryDetails.type';

import './CategoryDetails.style';

/**
 * Category details
 * @class CategoryDetails
 * @namespace Component/CategoryDetails/Component
 */
export class CategoryDetailsComponent extends PureComponent<CategoryDetailsComponentProps> {
    static defaultProps: Partial<CategoryDetailsComponentProps> = {
        isCurrentCategoryLoaded: true,
    };

    renderCategoryText(): ReactElement {
        const {
            category: { name },
            isCurrentCategoryLoaded,
        } = this.props;
        const {
            actionName: {
                name: preloadName,
            },
            isPrefetchValueUsed,
        } = window;

        const categoryName = isPrefetchValueUsed ? preloadName : name;

        if (isCurrentCategoryLoaded || isPrefetchValueUsed) {
            return (
                <TextPlaceholder content={ categoryName } />
            );
        }

        return (
            <TextPlaceholder />
        );
    }

    renderCategoryName(): ReactElement {
        const {
            category: { name, id },
        } = this.props;
        const {
            isPrefetchValueUsed,
        } = window;

        if (!id && !name && !isPrefetchValueUsed) {
            return null;
        }

        return (
            <h1 block="CategoryDetails" elem="Heading">
                { this.renderCategoryText() }
            </h1>
        );
    }

    renderCategoryDescription(): ReactElement {
        const {
            category: { description, id },
            isCurrentCategoryLoaded,
        } = this.props;
        const { isPrefetchValueUsed, actionName: { name: preloadDescription } } = window;

        if (isPrefetchValueUsed && !isCurrentCategoryLoaded) {
            if (preloadDescription) {
                return <Html content={ preloadDescription } />;
            }

            return null;
        }

        if ((!id || !isCurrentCategoryLoaded) && !preloadDescription) {
            return this.renderCategoryDescriptionPlaceholder();
        }

        if (!description) {
            return null;
        }

        return <Html content={ description } />;
    }

    renderCategoryDescriptionPlaceholder(): ReactElement {
        return (
            <h1>
                <TextPlaceholder length={ TextPlaceHolderLength.MEDIUM } />
            </h1>
        );
    }

    renderCategoryImagePlaceholder(): ReactElement {
        return (
            <Image
              mix={ { block: 'CategoryDetails', elem: 'Picture' } }
              ratio={ ImageRatio.IMG_CUSTOM }
              isPlaceholder
            />
        );
    }

    renderCategoryImage(): ReactElement {
        const {
            category: { image, id },
            isCurrentCategoryLoaded,
        } = this.props;

        if (!image) {
            return null;
        }

        if (!id || !isCurrentCategoryLoaded) {
            return this.renderCategoryImagePlaceholder();
        }

        return (
            <Image
              mix={ { block: 'CategoryDetails', elem: 'Picture' } }
              src={ image || '' }
              ratio={ ImageRatio.IMG_CUSTOM }
            />
        );
    }

    render(): ReactElement {
        return (
            <article block="CategoryDetails">
                <div block="CategoryDetails" elem="Description">
                    { this.renderCategoryName() }
                    { this.renderCategoryDescription() }
                </div>
                { this.renderCategoryImage() }
            </article>
        );
    }
}

export default CategoryDetailsComponent;
