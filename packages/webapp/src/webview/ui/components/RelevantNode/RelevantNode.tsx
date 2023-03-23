import React from 'react';
import './RelevantNode.scss';

/**
 * @param props
 * @param props.title
 * @param props.description
 *@returns - react element to show the relevant node
 */
export function RelevantNode(props: { title: string; description: string }) {
    return (
        <button className="guided-answer__tree">
            <div className="guided-answer__tree__ul" style={{ width: '100%', padding: '0 15px' }}>
                <div className="bottom-section">
                    <div className="relevant-node">
                        <div className="relevant-node-content">
                            <h4 className="relevant-node-content-title">{props.title}</h4>
                            <p className="relevant-node-content-description">{props.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}
