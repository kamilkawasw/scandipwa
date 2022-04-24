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

import { FieldType } from 'Component/Field/Field.config';
import FieldForm from 'Component/FieldForm';
import { CustomerType } from 'Type/Account.type';
import { ReactElement } from 'Type/Common.type';

import './MyAccountNewsletterSubscription.style.scss';

/** @namespace Component/MyAccountNewsletterSubscription/Component */
export class MyAccountNewsletterSubscription extends FieldForm {
    static propTypes = {
        customer: CustomerType.isRequired,
        onCustomerSave: PropTypes.func.isRequired,
        onError: PropTypes.func.isRequired,
        isSubscriptionSelected: PropTypes.bool.isRequired
    };

    get fieldMap() {
        const { setSubscriptionStatus, isSubscriptionSelected } = this.props;

        return [
            {
                type: FieldType.CHECKBOX,
                attr: {
                    name: 'isSubscribed',
                    defaultChecked: isSubscriptionSelected
                },
                events: {
                    onChange: setSubscriptionStatus
                },
                label: __('General subscription')
            }
        ];
    }

    renderFormBody(): ReactElement {
        return (
            <div
              block="FieldForm"
              elem="Fields"
              mix={ { block: 'MyAccountNewsletterSubscription' } }
            >
                { super.renderFormBody() }
            </div>
        );
    }

    getFormProps() {
        const { onCustomerSave, onError } = this.props;

        return {
            onSubmit: onCustomerSave,
            onError,
            returnAsObject: true
        };
    }

    renderActions(): ReactElement {
        return (
            <button
              type={ FieldType.SUBMIT }
              block="Button"
              mix={ { block: 'MyAccountNewsletterSubscription', elem: 'Button' } }
              aria-label={ __('Submit') }
            >
                { __('Save changes') }
            </button>
        );
    }
}

export default MyAccountNewsletterSubscription;
