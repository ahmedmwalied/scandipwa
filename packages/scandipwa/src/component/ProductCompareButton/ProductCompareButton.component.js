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

import Loader from 'Component/Loader';
import { MixType } from 'Type/Common';

import './ProductCompareButton.style';

/** @namespace Component/ProductCompareButton/Component */
export class ProductCompareButton extends PureComponent {
    static propTypes = {
        handleClick: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        isActive: PropTypes.bool,
        mix: MixType
    };

    static defaultProps = {
        isLoading: false,
        isActive: false,
        mix: {}
    };

    render() {
        const {
            handleClick,
            isLoading,
            isActive,
            mix
        } = this.props;

        return (
            <div block="ProductCompareButton" mix={ mix }>
                <button
                  block="ProductCompareButton"
                  elem="Button"
                  onClick={ handleClick }
                  mods={ { isActive } }
                  mix={ {
                      block: 'Button',
                      mods: { isHollow: true }
                  } }
                >
                    <div block="ProductCompareButton" elem="Icon" />
                    <Loader isLoading={ isLoading } />
                </button>
            </div>
        );
    }
}

export default ProductCompareButton;
