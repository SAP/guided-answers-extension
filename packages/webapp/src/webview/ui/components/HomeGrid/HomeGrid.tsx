import type { ReactElement } from 'react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { AppState } from '../../../types';
import { Bookmarks } from './Bookmarks';
import { LastVisited } from './LastVisited';
import { Filters } from './Filters';
import './HomeGrid.scss';

/**
 * Home grid for Guided Answers Extension app.
 *
 * @returns - react elements for the home grid
 */
export function HomeGrid(): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);

    const [hasBookmarks, setHasBookmarks] = useState(false);
    const hasLastVisited = !!appState.lastVisitedGuides.length;
    const hasFilters = !!appState.autoFilters.length || !!appState.customFilters.length;

    if (!hasBookmarks && !!Object.keys(appState.bookmarks).length) {
        setHasBookmarks(true);
    }

    const isTwoColumnLayout = hasLastVisited && hasBookmarks && hasFilters;

    return isTwoColumnLayout ? (
        <div className="guided-answer__home-grid">
            <div className="guided-answer__home-grid__column">
                <Bookmarks />
            </div>
            <div className="guided-answer__home-grid__column">
                <LastVisited />
                <Filters />
            </div>
        </div>
    ) : (
        <div className="guided-answer__home-grid">
            <div className="guided-answer__home-grid__column">
                {hasLastVisited && <LastVisited />}
                {hasBookmarks && <Bookmarks />}
                {hasFilters && <Filters />}
            </div>
        </div>
    );
}
