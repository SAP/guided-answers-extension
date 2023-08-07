import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import type { AppState } from '../../../types';
import { Bookmarks } from '../Bookmarks';
import { LastVisited } from '../LastVisited';
import { QuickFilters } from '../QuickFilters';
import './HomeGrid.scss';

/**
 * Home grid for Guided Answers Extension app.
 *
 * @returns - react elements for the home grid
 */
export function HomeGrid(): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);

    const hasLastVisited = !!appState.lastVisitedGuides.length;
    const hasBookmarks = !!Object.keys(appState.bookmarks).length;
    const hasQuickFilters = !!appState.quickFilters.length;

    const isTwoColumnLayout = hasLastVisited && hasBookmarks && hasQuickFilters;

    return isTwoColumnLayout ? (
        <div className="guided-answer__home-grid">
            <div className="guided-answer__home-grid__column">
                <Bookmarks />
            </div>
            <div className="guided-answer__home-grid__column">
                <LastVisited />
                <QuickFilters />
            </div>
        </div>
    ) : (
        <div className="guided-answer__home-grid">
            <div className="guided-answer__home-grid__column">
                {hasLastVisited && <LastVisited />}
                {hasBookmarks && <Bookmarks />}
                {hasQuickFilters && <QuickFilters />}
            </div>
        </div>
    );
}
