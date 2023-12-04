import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { DirectionalHint } from '@fluentui/react';
import { actions } from '../../../../state';
import i18next from 'i18next';
import { UIIcon, UiIcons, UICallout, UIIconButton, UITextInput } from '@sap-ux/ui-components';
import { focusOnElement } from '../../utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import type { AppState } from '../../../../types';
import type {
    Bookmarks,
    GuidedAnswerNode,
    GuidedAnswerTree,
    GuidedAnswerTreeId,
    ShareNodeLinks
} from '@sap/guided-answers-extension-types';

/**
 *
 * @returns A button component navigating to home page.
 */
export const HomeButton = React.memo(function HomeButton() {
    focusOnElement('#home-button');

    return (
        <button
            id="home-button"
            className="guided-answer__header__button"
            title={i18next.t('HOME')}
            onClick={(): void => {
                actions.goToHomePage();
            }}>
            <UIIcon iconName={UiIcons.Home} />
            <span className="guided-answer__header__button__text">{i18next.t('HOME')}</span>
        </button>
    );
});

/**
 *
 * @returns A button component for going back one step.
 */
export function BackButton() {
    return (
        <button
            id="back-button"
            className="guided-answer__header__button"
            title={i18next.t('STEP_BACK')}
            onClick={(): void => {
                actions.goToPreviousPage();
            }}>
            <UIIcon iconName={UiIcons.GoLeft} />
            <span className="guided-answer__header__button__text">{i18next.t('STEP_BACK')}</span>
        </button>
    );
}

/**
 *
 * @returns A button component for going back to the first step.
 */
export function RestartButton() {
    return (
        <button
            id="restart-button"
            className="guided-answer__header__button"
            title={i18next.t('RESTART')}
            onClick={(): void => {
                actions.restartAnswer();
            }}>
            <UIIcon iconName={UiIcons.Refresh} />
            <span className="guided-answer__header__button__text">{i18next.t('RESTART')}</span>
        </button>
    );
}

/**
 *
 * @returns A button component for sharing a link.
 */
export function ShareButton() {
    const id = 'callout-test-id';
    const [isCopiedVisible, setCopiedVisible] = useState(false);
    const treeId = useSelector<AppState, GuidedAnswerTreeId | undefined>((state) => state.activeGuidedAnswer?.TREE_ID);
    const nodes = useSelector<AppState, GuidedAnswerNode[]>((state) => state.activeGuidedAnswerNode);
    const nodeIdPath = nodes.map((n) => n.NODE_ID);
    const shareNodeLinks = useSelector<AppState, ShareNodeLinks | null>((state) => state.activeNodeSharing);

    const copyInstructions = i18next.t('COPY_WITH_INSTRUCTIONS_TEXT', {
        extensionLink: shareNodeLinks?.extensionLink ?? ''
    });

    const handleCopy = (): void => {
        actions.shareLinkTelemetry();
        setCopiedVisible(true);
    };

    return treeId ? (
        <>
            <UIIconButton
                className="guided-answer__header__button"
                id={id}
                title={i18next.t('SHARE_THIS_GUIDE')}
                iconProps={{ iconName: UiIcons.Link }}
                checked={!!shareNodeLinks}
                onClick={() => actions.fillShareLinks({ treeId, nodeIdPath })}></UIIconButton>
            {!!shareNodeLinks && (
                <UICallout
                    role="alertdialog"
                    target={`#${id}`}
                    isBeakVisible={true}
                    beakWidth={10}
                    directionalHint={DirectionalHint.bottomCenter}
                    onDismiss={() => {
                        setCopiedVisible(false);
                        actions.updateActiveNodeSharing(null);
                    }}
                    calloutWidth={268}
                    calloutMinWidth={268}
                    layerProps={{
                        eventBubblingEnabled: true
                    }}
                    setInitialFocus>
                    <div>
                        <div className="sharable-link__title">{i18next.t('SHARE_THIS_GUIDE')}</div>
                        <div className="sharable-link__body">
                            {!isCopiedVisible && (
                                <UITextInput
                                    disabled={true}
                                    value={shareNodeLinks.extensionLink}
                                    className="sharable-link__input-field"
                                />
                            )}
                            {isCopiedVisible && (
                                <div id="sharable-link-copied" className="sharable-link__copied">
                                    <UIIcon
                                        iconName={UiIcons.ConfirmationCheckSymbol}
                                        className="sharable-link__copied-icon"
                                    />
                                    {i18next.t('COPIED_TO_CLIPBOARD')}
                                </div>
                            )}

                            <CopyToClipboard text={shareNodeLinks.extensionLink} onCopy={handleCopy}>
                                <UIIconButton
                                    className="sharable-link__copy-to-clipboard"
                                    id="copy-btn"
                                    title={i18next.t('COPY_THIS_LINK')}
                                    iconProps={{ iconName: UiIcons.CopyToClipboard }}></UIIconButton>
                            </CopyToClipboard>

                            <div className="sharable-link__divider-vertical"></div>

                            <CopyToClipboard text={copyInstructions} onCopy={handleCopy}>
                                <UIIconButton
                                    className="sharable-link__copy-to-clipboard"
                                    id="copy-btn-instructions"
                                    title={i18next.t('COPY_WITH_INSTRUCTIONS')}
                                    iconProps={{ iconName: UiIcons.CopyToClipboardLong }}></UIIconButton>
                            </CopyToClipboard>
                        </div>
                        <p className="sharable-link__footer">{i18next.t('COPIED_TO_CLIPBOARD_DESC')}</p>
                        <hr className="sharable-link__divider"></hr>
                        <a
                            className="sharable-link__web-link"
                            id="web-link"
                            href={shareNodeLinks.webLink}
                            onClick={() => actions.openLinkTelemetry()}>
                            <UIIcon iconName={UiIcons.Export} />
                            {i18next.t('VIEW_ON_WEBSITE')}
                        </a>
                    </div>
                </UICallout>
            )}
        </>
    ) : (
        <></>
    );
}

/**
 *
 * @returns A button component for feedback submission.
 */
export function GeneralFeedbackButton() {
    return (
        <UIIconButton
            className="guided-answer__header__button"
            title={i18next.t('FEEDBACK')}
            iconProps={{ iconName: UiIcons.ChatBubbles }}
            onClick={(): void => {
                actions.feedbackStatus(true);
            }}
        />
    );
}

/**
 *
 * @returns A button component for bookmarking a guide.
 */
export function BookmarkButton() {
    const nodePath = useSelector<AppState, GuidedAnswerNode[]>((state) => state.activeGuidedAnswerNode);
    const bookmarks = useSelector<AppState, Bookmarks>((state) => state.bookmarks);
    const tree = useSelector<AppState, GuidedAnswerTree | undefined>((state) => state.activeGuidedAnswer);
    if (!tree) {
        // No active tree, nothing we can do here
        return <></>;
    }
    const bookmarkKey = `${tree.TREE_ID}-${nodePath.map((n) => n.NODE_ID).join(':')}`;

    return (
        <UIIconButton
            id="bookmark-button"
            className="guided-answer__header__button"
            title={!bookmarks[bookmarkKey] ? i18next.t('BOOKMARK_THIS_GUIDE') : i18next.t('REMOVE_FROM_BOOKMARKS')}
            iconProps={{ iconName: !bookmarks[bookmarkKey] ? UiIcons.Star : UiIcons.StarActive }}
            onClick={(): void => {
                const newBookmarks: Bookmarks = JSON.parse(JSON.stringify(bookmarks));
                if (newBookmarks[bookmarkKey]) {
                    delete newBookmarks[bookmarkKey];
                } else {
                    newBookmarks[bookmarkKey] = { tree, nodePath, createdAt: new Date().toISOString() };
                }
                actions.updateBookmark({ bookmarkKey, bookmarks: newBookmarks });
            }}
        />
    );
}
