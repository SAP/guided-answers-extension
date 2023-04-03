import React, { useState } from 'react';
import './RelevantNodesList.scss';

export function RelevantNodesList({ items }: any) {
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        setExpanded(!expanded);
    };

    const displayedItems = expanded ? items : items.slice(0, 2);

    return (
        <div className="relevant-nodes-list">
            <ul>
                {displayedItems.map((item: any, index: any) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            {items.length > 2 && (
                <button className="relevant-nodes-list-toggle" onClick={handleClick}>
                    {expanded ? 'View less results' : 'View more results'}
                </button>
            )}
        </div>
    );
}
