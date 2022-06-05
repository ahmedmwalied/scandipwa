/* eslint-disable react/jsx-no-bind */
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

import CloseIcon from 'Component/CloseIcon';
import { ReactElement } from 'Type/Common.type';
import { getFiltersCount } from 'Util/Category';

import { ResetAttributesComponentProps, ResetItem } from './ResetAttributes.type';

import './ResetAttributes.style';

/** @namespace Component/ResetAttributes/Component */
export class ResetAttributes extends PureComponent<ResetAttributesComponentProps> {
    renderSelectedOption(selectedOption: ResetItem): ReactElement {
        const { toggleCustomFilter } = this.props;
        const { attribute_code, attribute_label, value_string } = selectedOption;
        const onRemove = () => toggleCustomFilter(attribute_code, value_string);

        return (
            <div block="ResetAttributes" elem="AttributeValue" key={ value_string }>
                <div
                  block="ResetAttributes"
                  elem="CloseIcon"
                  role="button"
                  tabIndex={ 0 }
                  onKeyDown={ onRemove }
                  onClick={ onRemove }
                  aria-label={ __('Close') }
                >
                    <CloseIcon />
                </div>
                <div block="ResetAttributes" elem="AttributeText">
                    <span block="ResetAttributes" elem="AttributeLabel">{ `${attribute_label}: ` }</span>
                    <span block="ResetAttributes" elem="AttributeOption">{ `${selectedOption.label}` }</span>
                </div>
            </div>
        );
    }

    renderResetItem(title: string, selectedOptions: ResetItem[]): ReactElement {
        return (
            <div key={ title }>
                { selectedOptions.map((o) => this.renderSelectedOption(o)) }
            </div>
        );
    }

    renderDesktopTitle(): ReactElement {
        return (
            <h3 block="ResetAttributes" elem="Title">
                { __('Now shopping by:') }
            </h3>
        );
    }

    renderMobileTitle(): ReactElement {
        const { filtersData = {} } = this.props;

        const count = getFiltersCount(filtersData);

        return (
            <div block="ResetAttributes" elem="MobileTitle">
                { count === 1 ? __('1 filter selected') : getFiltersCount(filtersData) + __(' filters selected') }
            </div>
        );
    }

    render(): ReactElement {
        const { filtersData = {} } = this.props;

        if (!Object.keys(filtersData).length) {
            return null;
        }

        return (
            <>
                { this.renderDesktopTitle() }
                { this.renderMobileTitle() }
                <div block="ResetAttributes">
                    { Object.entries(filtersData).map(
                        ([attrName, attrData]) => this.renderResetItem(attrName, attrData)
                    ) }
                </div>
            </>
        );
    }
}

export default ResetAttributes;
