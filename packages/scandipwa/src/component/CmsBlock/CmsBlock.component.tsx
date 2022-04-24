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

import { PureComponent } from 'react';

import Html from 'Component/Html';
import { ReactElement } from 'Type/Common.type';

import { CmsBlockComponentProps } from './CmsBlock.type';

import './CmsBlock.style';

/**
 * Cms Block
 * @class CmsBlock
 * @namespace Component/CmsBlock/Component
 */
export class CmsBlock extends PureComponent<CmsBlockComponentProps> {
    static defaultProps = {
        cmsBlock: {},
        blockType: ''
    };

    renderPlaceholder(): ReactElement {
        const {
            children
        } = this.props;

        if (children && (!Array.isArray(children) || children.length)) {
            return children;
        }

        return null;
    }

    render(): ReactElement {
        const {
            cmsBlock: {
                identifier,
                content,
                disabled
            },
            blockType
        } = this.props;

        if (disabled) {
            return null;
        }

        if (identifier === undefined) {
            return this.renderPlaceholder();
        }

        return (
            <div
              block="CmsBlock"
              elem="Wrapper"
              mods={ { type: blockType } }
            >
                <Html content={ content } />
            </div>
        );
    }
}

export default CmsBlock;
