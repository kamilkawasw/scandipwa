/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/scandipwa-theme
 * @link https://github.com/scandipwa/scandipwa
 */

import { AnyAction } from 'redux';

export enum NewsletterSubscriptionActionType {
    SUBSCRIBE_TO_NEWSLETTER = 'SUBSCRIBE_TO_NEWSLETTER'
}

export interface SubscribeToNewsletterAction extends AnyAction {
    type: NewsletterSubscriptionActionType.SUBSCRIBE_TO_NEWSLETTER;
    email: string;
}
