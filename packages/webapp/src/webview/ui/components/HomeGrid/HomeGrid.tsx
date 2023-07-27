import type { ReactElement, ReactNode } from 'react';
import React, { Children, isValidElement } from 'react';
import './HomeGrid.scss';

/**
 * Home grid for Guided Answers Extension app.
 *
 * @param props Props for HomeGrid component
 * @param props.children Sections to layout in the grid
 * @returns - react elements for the home grid
 */
export function HomeGrid(props: { children: ReactNode }): ReactElement {
    const children = Children.toArray(props.children)
        .filter((c) => isValidElement(c))
        .map((c) => c as ReactElement);
    let column1: ReactElement[] = [];
    let column2: ReactElement[] = [];

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
            {column2.length > 0 && (
                <div className="guided-answer__home-grid__column">
                    {column2.map((row) => (
                        <div key={`home-grid-row-${row.key}`} className="guided-answer__home-grid__row">
                            {row}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
