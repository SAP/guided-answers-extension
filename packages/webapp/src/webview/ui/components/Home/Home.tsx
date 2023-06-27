import type { ReactElement } from 'react';
import React from 'react';
import { Bookmarks } from '../Bookmarks';
import './Home.scss';

/**
 * Smart home page for Guided Answers Extension app.
 *
 * @returns - react elements for the home page
 */
export function Home(): ReactElement {
    const sections = [<Bookmarks key={0} />, <Bookmarks key={1} />, <Bookmarks key={2} />];

    let column1: ReactElement[] = [];
    let column2: ReactElement[] = [];

    if (sections.length <= 2) {
        column1 = sections;
    } else {
        const half = Math.ceil(sections.length / 2);
        column1 = sections.slice(0, half);
        column2 = sections.slice(half, half + sections.length);
    }

    return (
        <div className="guided-answer__home">
            <div className="guided-answer__home__column">
                {column1.map((row, i) => (
                    <div key={i} className="guided-answer__home__row">
                        {row}
                    </div>
                ))}
            </div>
            <div className="guided-answer__home__column">
                {column2.map((row, i) => (
                    <div key={i} className="guided-answer__home__row">
                        {row}
                    </div>
                ))}
            </div>
        </div>
    );
}
