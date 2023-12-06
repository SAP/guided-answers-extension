import React from 'react';

/**
 * Component for the bottom section of the button it a tree list.
 *
 * @param props - properties containing tree
 * @param props.description - Guided Answers tree description
 * @param props.product - Guided Answers tree product
 * @param props.component - Guided Answers tree component
 * @returns A TreeItemBottomSection component.
 */
export function TreeItemBottomSection(props: Readonly<{ description?: string; product?: string; component?: string }>) {
    return (
        <div className="bottom-section" id="bottom-section">
            {props.description && <span className="guided-answer__tree__desc">{props.description}</span>}
            <div
                className="component-and-product-container"
                style={{
                    marginTop: props.description ? '10px' : '0'
                }}>
                {props.product && (
                    <div className="guided-answer__tree__product" id="product-container">
                        <span className="bottom-title">Product: </span>
                        {props.product.split(',')[0].trim()}
                    </div>
                )}
                {props.component && (
                    <div className="guided-answer__tree__component" id="component-container">
                        <span className="bottom-title">Component: </span>
                        {props.component.split(',')[0].trim()}
                    </div>
                )}
            </div>
        </div>
    );
}
