import type { ReactElement } from 'react';
import React from 'react';
import './HomeGrid.scss';

type ReactElementWithKey = ReactElement<{ key: string }>;

/**
 * Home grid for Guided Answers Extension app.
 *
 * @param props Props for HomeGrid component
 * @param props.children Sections to layout in the grid
 * @returns - react elements for the home grid
 */
export function HomeGrid(props: { children: ReactElementWithKey[] | ReactElementWithKey }): ReactElement {
    const children = Array.isArray(props.children) ? props.children : [props.children];

    let column1: ReactElementWithKey[] = [];
    let column2: ReactElementWithKey[] = [];

    if (children.length <= 2) {
        column1 = children;
    } else {
        const half = Math.ceil(children.length / 2);
        column1 = children.slice(0, half);
        column2 = children.slice(half, half + children.length);
    }

    return (
        <div className="guided-answer__home-grid">
            <div className="guided-answer__home-grid__column">
                {column1.map((row) => (
                    <div key={`home-grid-row-${row.key}`} className="guided-answer__home-grid__row">
                        {row}
                    </div>
                ))}
            </div>
            <div className="guided-answer__home-grid__column">
                {column2.map((row) => (
                    <div key={`home-grid-row-${row.key}`} className="guided-answer__home-grid__row">
                        {row}
                    </div>
                ))}
            </div>
        </div>
    );
}
