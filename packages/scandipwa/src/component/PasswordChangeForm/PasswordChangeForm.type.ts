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

import { FieldData } from 'Util/Form/Form.type';
import { ValidationRule } from 'Util/Validator/Validator.type';

export interface PasswordChangeFormComponentProps {
    onFormSubmit: (form: HTMLFormElement, fields: FieldData[]) => void;
    onFormError: () => void;
    range: ValidationRule['range'];
    minimunPasswordCharacter: string;
}
