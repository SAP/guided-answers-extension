import React, { useState, useRef, useEffect } from 'react';
import './RelevantNodeList.scss';
import { RelevantNode } from '../RelevantNode';

export function RelevantNodeList({ items }: any) {
    const [expanded, setExpanded] = useState(false);
    const additionalItemsRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState<number>(0);

    const handleClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        if (additionalItemsRef.current) {
            if (expanded) {
                setContainerHeight(additionalItemsRef.current.scrollHeight);
            } else {
                setContainerHeight(0);
            }
        }
    }, [expanded]);

    const additionalItems = items.slice(2);
    const hasAdditionalItems = additionalItems.length > 0;

    return (
        <div className="relevant-node-list">
            <ul>
                {items
                    .slice(0, 2)
                    .map((item: { title: string; description: string }, index: React.Key | null | undefined) => (
                        <li key={index}>
                            <RelevantNode title={item.title} description={item.description} />
                        </li>
                    ))}
            </ul>
            {hasAdditionalItems && (
                <>
                    <div
                        className="additional-items-container"
                        style={{ height: containerHeight }}
                        ref={additionalItemsRef}>
                        <ul>
                            {additionalItems.map(
                                (item: { title: string; description: string }, index: React.Key | null | undefined) => (
                                    <li key={index}>
                                        <RelevantNode title={item.title} description={item.description} />
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                    <div style={{ height: '25px' }}>
                        <button className="relevant-node-list-toggle" onClick={handleClick}>
                            {expanded ? 'View less results' : 'View more results'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
