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

import ChevronIcon from 'Component/ChevronIcon';
import { BOTTOM, TOP } from 'Component/ChevronIcon/ChevronIcon.config';
import ClickOutside from 'Component/ClickOutside';

import './FieldSelect.style';

export class FieldSelect extends PureComponent {
    static propTypes = {
        attr: PropTypes.object.isRequired,
        events: PropTypes.object.isRequired,
        options: PropTypes.array.isRequired,
        setRef: PropTypes.func.isRequired,
        isExpanded: PropTypes.bool.isRequired,
        handleSelectListOptionClick: PropTypes.func.isRequired,
        handleSelectListKeyPress: PropTypes.func.isRequired,
        handleSelectExpandedExpand: PropTypes.func.isRequired,
        handleSelectExpand: PropTypes.func.isRequired
    };

    renderNativeOption = (option) => {
        const {
            id,
            value,
            disabled,
            label,
            subLabel = ''
        } = option;

        return (
            <option
                key={ id }
                id={ id }
                value={ value }
                disabled={ disabled }
            >
                { `${label}${subLabel}` }
            </option>
        );
    };

    renderNativeSelect() {
        const { setRef, attr, events, isDisabled, options } = this.props

        return (
            <select
                block="FieldSelect"
                elem="Select"
                ref={ (elem) => setRef(elem) }
                disabled={ isDisabled }
                { ...attr }
                { ...events }
            >
                { options.map(this.renderNativeOption) }
            </select>
        );
    }

    renderOption = (option) => {
        const {
            id,
            label,
            subLabel
        } = option;

        const {
            isExpanded,
            handleSelectListOptionClick
        } = this.props;

        return (
            <li
                block="FieldSelect"
                elem="Option"
                mods={ { isExpanded } }
                key={ id }
                /**
                 * Added 'o' as querySelector does not work with
                 * ids, that consist of numbers only
                 */
                id={ `o${id}` }
                role="menuitem"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={ () => handleSelectListOptionClick(option) }
                // eslint-disable-next-line react/jsx-no-bind
                onKeyPress={ () => handleSelectListOptionClick(option) }
                tabIndex={ isExpanded ? '0' : '-1' }
            >
                { label }
                { subLabel && <strong>{ subLabel }</strong> }
            </li>
        );
    };

    renderOptions() {
        const {
            options,
            isExpanded
        } = this.props;

        return (
            <ul
                block="FieldSelect"
                elem="Options"
                role="menu"
                mods={ { isExpanded } }
            >
                { options.map(this.renderOption) }
            </ul>
        );
    }

    render() {
        const {
            attr: { id = '' } = {},
            isExpanded,
            handleSelectExpand,
            handleSelectListKeyPress,
            handleSelectExpandedExpand
        } = this.props;

        return (
            <ClickOutside onClick={ handleSelectExpandedExpand }>
                <div
                    id={ `${ id }_wrapper` }
                    block="FieldSelect"
                    mods={ { isExpanded } }
                    onClick={ handleSelectExpand }
                    onKeyPress={ handleSelectListKeyPress }
                    role="button"
                    tabIndex="0"
                    aria-label="Select dropdown"
                    aria-expanded={ isExpanded }
                >
                    <div block="FieldSelect" elem="Clickable">
                        { this.renderNativeSelect() }
                        <ChevronIcon direction={ isExpanded ? TOP : BOTTOM } />
                    </div>
                    { this.renderOptions() }
                </div>
            </ClickOutside>
        );
    }
}

export default FieldSelect;
