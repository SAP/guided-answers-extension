import React from 'react';

/**
 * Component for the bottom section of the button it a tree list.
 *
 * @param props - properties containing tree
 * @param props.tree - Guided Answers tree
 * @returns A TreeItemBottomSection component.
 */
export function TreeItemBottomSection(props: { tree: any }) {
    return (
        <div className="bottom-section" id="bottom-section">
            {props.tree.DESCRIPTION && <span className="guided-answer__tree__desc">{props.tree.DESCRIPTION}</span>}
            <div
                className="component-and-product-container"
                style={{
                    marginTop: props.tree.DESCRIPTION ? '10px' : '0'
                }}>
                {props.tree.PRODUCT && (
                    <div className="guided-answer__tree__product" id="product-container">
                        <span className="bottom-title">Product: </span>
                        {props.tree.PRODUCT.split(',')[0].trim()}
                    </div>
                )}
                {props.tree.COMPONENT && (
                    <div className="guided-answer__tree__component" id="component-container">
                        <span className="bottom-title">Component: </span>
                        {props.tree.COMPONENT.split(',')[0].trim()}
                    </div>
                )}
            </div>
        </div>
    );
}
