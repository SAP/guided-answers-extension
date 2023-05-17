import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DirectionalHint } from '@fluentui/react';
import { actions } from '../../../../state';
import { VscHome, VscRefresh, VscArrowLeft, VscStarEmpty, VscStarFull } from 'react-icons/vsc';
import i18next from 'i18next';
import { UIIcon, UiIcons, UICallout, UIIconButton, UITextInput } from '@sap-ux/ui-components';
import { focusOnElement } from '../../utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { AppState } from '../../../../types';
import type { GuidedAnswerNode, GuidedAnswerTreeId, ShareNodeLinks } from '@sap/guided-answers-extension-types';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';

/**
 *
 * @returns A button component navigating to all answers.
 */
const AllAnswersButton = React.memo(function AllAnswersButton() {
    focusOnElement('.home-icon');

    return (
        <button
            id="all-answers-button"
            className="guided-answer__header__navButtons home-icon"
            onClick={(): void => {
                actions.goToAllAnswers();
            }}
            title={i18next.t('ALL_ANSWERS')}>
            <VscHome className="guided-answer__header__navButtons__content" />{' '}
            <span className="guided-answer__header__navButtons__content__text text-underline">
                {i18next.t('ALL_ANSWERS')}
            </span>
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
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.goToPreviousPage();
            }}
            title={i18next.t('STEP_BACK')}>
            <VscArrowLeft className="guided-answer__header__navButtons__content" />
            <span className="guided-answer__header__navButtons__content text-underline" style={{ marginLeft: '3px' }}>
                {i18next.t('STEP_BACK')}
            </span>
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
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.restartAnswer();
            }}
            title={i18next.t('RESTART')}>
            <VscRefresh className="guided-answer__header__navButtons__content" />
            <span className="guided-answer__header__navButtons__content text-underline" style={{ marginLeft: '3px' }}>
                {i18next.t('RESTART')}
            </span>
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
    const toggleCopied = (): void => {
        actions.shareLinkTelemetry();
        setCopiedVisible(!isCopiedVisible);
    };
    const treeId = useSelector<AppState, GuidedAnswerTreeId>((state) => state.activeGuidedAnswer!?.TREE_ID);
    const nodes = useSelector<AppState, GuidedAnswerNode[]>((state) => state.activeGuidedAnswerNode);
    const nodeIdPath = nodes.map((n) => n.NODE_ID);
    const shareNodeLinks = useSelector<AppState, ShareNodeLinks | null>((state) => state.activeNodeSharing);

    const copyInstructions = i18next
        .t('COPY_WITH_INSTRUCTIONS_TEXT')
        .replace('{EXTENSION_LINK}', shareNodeLinks?.extensionLink ?? '');

    return (
        <>
            {!!treeId && (
                <div>
                    <UIIconButton
                        className="guided-answer__header__navButtons guided-answer__header__navButtons__content"
                        // Overriding outline from ui-components
                        style={{ outline: 'none' }}
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
                            calloutWidth={230}
                            calloutMinWidth={230}
                            layerProps={{
                                eventBubblingEnabled: true
                            }}
                            setInitialFocus>
                            <div>
                                <div className="sharable-link__title">{i18next.t('SHARE_THIS_GUIDE')}</div>
                                <div className="sharable-link__body">
                                    <FocusZone direction={FocusZoneDirection.horizontal} style={{ display: 'flex' }}>
                                        {!isCopiedVisible && (
                                            <UITextInput
                                                disabled={true}
                                                value={shareNodeLinks.extensionLink}
                                                className="sharable-link__input-field"
                                            />
                                        )}
                                        {isCopiedVisible && (
                                            <div id="sharable-link-copied" className="sharable-link__copied">
                                                <UIIconButton
                                                    iconProps={{ iconName: UiIcons.ConfirmationCheckSymbol }}
                                                    className="sharable-link__copied-icon"
                                                />
                                                {i18next.t('COPIED_TO_CLIPBOARD')}
                                            </div>
                                        )}

                                        <CopyToClipboard text={shareNodeLinks.extensionLink} onCopy={toggleCopied}>
                                            <button title={i18next.t('COPY_THIS_LINK')} id="copy-btn">
                                                <UIIcon
                                                    className="sharable-link__copy-to-clipboard"
                                                    iconName={UiIcons.CopyToClipboard}
                                                />
                                            </button>
                                        </CopyToClipboard>
                                    </FocusZone>
                                </div>
                                <p className="sharable-link__footer">{i18next.t('COPIED_TO_CLIPBOARD_DESC')}</p>
                                <hr className="sharable-link__divider"></hr>
                                <CopyToClipboard text={copyInstructions} onCopy={toggleCopied}>
                                    <p
                                        className="sharable-link__copy-instructions"
                                        id="copy-instructions"
                                        title={copyInstructions}>
                                        {i18next.t('COPY_WITH_INSTRUCTIONS')}
                                    </p>
                                </CopyToClipboard>
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
                </div>
            )}
        </>
    );
}

/**
 *
 * @returns A button component for feedback submission.
 */
export function GeneralFeedbackButton() {
    return (
        <button
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.feedbackStatus(true);
            }}
            title={i18next.t('FEEDBACK')}>
            <UIIcon
                className="guided-answer__header__navButtons__content"
                style={{ paddingTop: '2px' }}
                iconName={UiIcons.ChatBubbles}
            />
        </button>
    );
}

/**
 *
 * @returns A button component for bookmarking a guide.
 */
export function BookmarkButton() {
    const appState = useSelector<AppState, AppState>((state) => state);
    const [isBookmarked, setBookmark] = useState(false);
    const nodes = useSelector<AppState, GuidedAnswerNode[]>((state) => state.activeGuidedAnswerNode);
    const bookmarks = useSelector<AppState, any[]>((state) => state.bookmarks);
    const nodeId = nodes[nodes.length - 1].NODE_ID;

    useEffect(() => {
        if (bookmarks !== undefined) {
            bookmarks.forEach((bookmark) => {
                if (bookmark.activeGuidedAnswerNode.NODE_ID === nodeId) {
                    setBookmark(bookmark.status);
                }
            });

            if (!bookmarks.some((bookmark) => bookmark.activeGuidedAnswerNode.NODE_ID === nodeId)) {
                setBookmark(false);
            }
        }
    }, [bookmarks]);

    return (
        <button
            id="bookmark-button"
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.updateBookmark({
                    activeGuidedAnswer: appState.activeGuidedAnswer,
                    activeGuidedAnswerNode: appState.activeGuidedAnswerNode[appState.activeGuidedAnswerNode.length - 1],
                    status: !isBookmarked
                });
                setBookmark(!isBookmarked);
            }}
            title={i18next.t('BOOKMARK')}>
            {!isBookmarked ? <VscStarEmpty /> : <VscStarFull className="bookmark-icon-bookmarked" />}
        </button>
    );
}
export { AllAnswersButton };
