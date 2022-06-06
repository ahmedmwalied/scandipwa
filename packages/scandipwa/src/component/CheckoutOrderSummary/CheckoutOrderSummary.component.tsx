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

import { lazy, PureComponent } from 'react';

import CartItem from 'Component/CartItem';
import CheckoutOrderSummaryPriceLine from 'Component/CheckoutOrderSummaryPriceLine';
import ExpandableContent from 'Component/ExpandableContent';
import Loader from 'Component/Loader';
import { TotalsItem } from 'Query/Checkout.type';
import { CheckoutSteps } from 'Route/Checkout/Checkout.config';
import { Mods, ReactElement } from 'Type/Common.type';
import { getItemsCountLabel } from 'Util/Cart';
import { noopFn } from 'Util/Common';

import { CheckoutOrderSummaryComponentProps } from './CheckoutOrderSummary.type';

import './CheckoutOrderSummary.style';

export const CartCoupon = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "checkout-info" */
    'Component/CartCoupon'
));

/**
 * Checkout Order Summary component
 * @namespace Component/CheckoutOrderSummary/Component
 */
export class CheckoutOrderSummary extends PureComponent<CheckoutOrderSummaryComponentProps> {
    static defaultProps: Partial<CheckoutOrderSummaryComponentProps> = {
        totals: undefined,
        isLoading: false,
        renderCmsBlock: noopFn,
        isExpandable: false,
        cartShippingPrice: 0,
        cartShippingSubPrice: null,
        cartTotalSubPrice: null,
        cartSubtotal: undefined,
        cartSubtotalSubPrice: null,
        showItems: true,
        children: [],
        checkoutStep: undefined
    };

    renderPriceLine(price: number, title: string, mods?: Mods): ReactElement {
        if (!price) {
            return null;
        }

        const { totals: { quote_currency_code } } = this.props;

        return (
            <CheckoutOrderSummaryPriceLine
              price={ price }
              currency={ quote_currency_code }
              title={ title }
              mods={ mods }
            />
        );
    }

    renderItem(item: TotalsItem): ReactElement {
        const { totals: { quote_currency_code } } = this.props;

        const { item_id } = item;

        return (
            <CartItem
              key={ item_id }
              item={ item }
              currency_code={ quote_currency_code }
            />
        );
    }

    renderDiscount(): ReactElement {
        const {
            totals: {
                applied_rule_ids,
                discount_amount,
                coupon_code
            }
        } = this.props;

        if (!applied_rule_ids || !discount_amount) {
            return null;
        }

        const label = coupon_code ? __('Coupon code discount') : __('Discount');
        const discount = -Math.abs(discount_amount);

        return (
            <CheckoutOrderSummaryPriceLine
              price={ discount }
              title={ label }
              coupon_code={ coupon_code }
            />
        );
    }

    renderMobileDiscount(coupon_code?: string): ReactElement {
        return (
            <>
                <div
                  block="ExpandableContent"
                  elem="Heading"
                  mix={ { block: 'CheckoutOrderSummary', elem: 'ExpandableContentHeading' } }
                >
                    { __('Have a discount code?') }
                </div>
                <CartCoupon couponCode={ coupon_code } />
            </>
        );
    }

    renderDiscountCode(): ReactElement {
        const {
            totals: { coupon_code, items },
            checkoutStep,
            isMobile
        } = this.props;

        if (!items || items.length < 1 || checkoutStep !== CheckoutSteps.BILLING_STEP) {
            return null;
        }

        if (isMobile) {
            return this.renderMobileDiscount(coupon_code);
        }

        return (
            <ExpandableContent
              heading={ __('Have a discount code?') }
              mix={ { block: 'CheckoutOrderSummary', elem: 'Discount' } }
              isArrow
            >
                <CartCoupon couponCode={ coupon_code } />
            </ExpandableContent>
        );
    }

    renderItems(): ReactElement {
        const { showItems, totals: { items_qty, items = [] } } = this.props;

        if (!showItems || !items_qty) {
            return null;
        }

        return (
            <>
            <div block="CheckoutOrderSummary" elem="ItemsInCart">
                { getItemsCountLabel(items_qty) }
            </div>
            <div block="CheckoutOrderSummary" elem="OrderItems">
                <div block="CheckoutOrderSummary" elem="CartItemList">
                    { items.map(this.renderItem.bind(this)) }
                </div>
            </div>
            </>
        );
    }

    renderHeading(): ReactElement {
        return (
            <div
              block="CheckoutOrderSummary"
              elem="Header"
              mix={ { block: 'CheckoutPage', elem: 'Heading', mods: { hasDivider: true } } }
            >
                <h2>{ __('Summary') }</h2>
            </div>
        );
    }

    renderSubTotal(): ReactElement {
        const {
            totals: { quote_currency_code },
            cartSubtotal,
            cartSubtotalSubPrice
        } = this.props;

        const title = __('Subtotal');

        if (cartSubtotal) {
            return (
                <CheckoutOrderSummaryPriceLine
                  price={ cartSubtotal }
                  currency={ quote_currency_code }
                  title={ title }
                  subPrice={ cartSubtotalSubPrice }
                />
            );
        }

        return this.renderPriceLine(cartSubtotal, title);
    }

    getShippingLabel(): string {
        const { checkoutStep } = this.props;

        if (checkoutStep === CheckoutSteps.BILLING_STEP) {
            return __('Shipping');
        }

        return __('Estimated Shipping');
    }

    renderShipping(): ReactElement {
        const {
            totals: {
                quote_currency_code
            },
            cartShippingPrice,
            cartShippingSubPrice
        } = this.props;
        const title = this.getShippingLabel();
        const mods = { divider: true };

        if (!cartShippingSubPrice) {
            return this.renderPriceLine(cartShippingPrice, title, mods);
        }

        return (
            <CheckoutOrderSummaryPriceLine
              price={ cartShippingPrice }
              currency={ quote_currency_code }
              title={ title }
              mods={ mods }
              subPrice={ cartShippingSubPrice }
            />
        );
    }

    renderOrderTotal(): ReactElement {
        const {
            totals: {
                grand_total,
                quote_currency_code
            },
            cartTotalSubPrice
        } = this.props;
        const title = __('Order total');

        if (cartTotalSubPrice) {
            return (
                <CheckoutOrderSummaryPriceLine
                  price={ grand_total }
                  currency={ quote_currency_code }
                  title={ title }
                  subPrice={ cartTotalSubPrice }
                  mods={ { isTotal: true } }
                />
            );
        }

        if (!grand_total) {
            return null;
        }

        return this.renderPriceLine(grand_total, title, { isTotal: true });
    }

    renderTaxFullSummary(): ReactElement {
        const {
            totals: {
                applied_taxes = []
            },
            cartDisplayConfig: {
                display_full_tax_summary
            } = {}
        } = this.props;

        if (!display_full_tax_summary || !applied_taxes.length) {
            return null;
        }

        return applied_taxes
            .map(({ rates }) => rates)
            .reduce((rates, rate) => rates.concat(rate), [])
            .map(({ percent, title }, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div block="CheckoutOrderSummary" elem="AppendedContent" key={ i }>
                    { `${title} (${percent}%)` }
                </div>
            ));
    }

    renderTax(): ReactElement {
        const {
            totals: {
                tax_amount = 0,
                quote_currency_code,
                items_qty
            },
            cartDisplayConfig: {
                display_full_tax_summary,
                display_zero_tax_subtotal
            } = {}
        } = this.props;

        if (!quote_currency_code || (!tax_amount && !display_zero_tax_subtotal)) {
            return null;
        }

        return (
            <CheckoutOrderSummaryPriceLine
              price={ tax_amount.toFixed(2) } // since we display tax even if value is 0
              currency={ quote_currency_code }
              itemsQty={ items_qty }
              title={ __('Tax') }
              mods={ { withAppendedContent: display_full_tax_summary || false } }
            >
                { this.renderTaxFullSummary() }
            </CheckoutOrderSummaryPriceLine>
        );
    }

    renderTotals(): ReactElement {
        const { children, totals: { items = [] } } = this.props;

        return (
            <div block="CheckoutOrderSummary" elem="OrderTotals">
                <ul>
                    { this.renderSubTotal() }
                    { this.renderTax() }
                    { this.renderDiscount() }
                    { this.renderShipping() }
                    <div block="CheckoutOrderSummary" elem="ButtonWrapper" mods={ { isEmpty: items.length < 1 } }>
                        { this.renderOrderTotal() }
                        { children }
                    </div>
                </ul>
            </div>
        );
    }

    renderCmsBlock(): ReactElement {
        const { renderCmsBlock } = this.props;

        const content = renderCmsBlock();

        if (!content) {
            return null;
        }

        return (
            <div
              block="CheckoutOrderSummary"
              elem="CmsBlock"
            >
                { content }
            </div>
        );
    }

    renderExpandableContent(): ReactElement {
        return (
            <ExpandableContent
              heading={ __('Summary') }
              mix={ { block: 'CheckoutOrderSummary', elem: 'ExpandableContent' } }
            >
                { this.renderItems() }
                { this.renderTotals() }
                { this.renderDiscountCode() }
                { this.renderCmsBlock() }
            </ExpandableContent>
        );
    }

    renderContent(): ReactElement {
        const { isExpandable } = this.props;

        if (isExpandable) {
            return this.renderExpandableContent();
        }

        return (
            <>
                { this.renderHeading() }
                { this.renderItems() }
                { this.renderTotals() }
            </>
        );
    }

    render(): ReactElement {
        const { isLoading } = this.props;

        return (
            <article block="CheckoutOrderSummary" aria-label="Order Summary">
                <Loader isLoading={ isLoading } />
                { this.renderContent() }
            </article>
        );
    }
}

export default CheckoutOrderSummary;
