import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DirectionalHint } from '@fluentui/react';
import { actions } from '../../../../state';
import { VscHome, VscRefresh, VscArrowLeft } from 'react-icons/vsc';
import i18next from 'i18next';
import { UIIcon, UiIcons, UICallout, UIIconButton, UITextInput } from '@sap-ux/ui-components';
import { focusOnElement } from '../../utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { AppState } from '../../../../types';
import { GuidedAnswerNode, GuidedAnswerTreeId } from '@sap/guided-answers-extension-types';

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
    const [isCalloutVisible, setCalloutVisible] = useState(false);
    const [isCopiedVisible, setCopiedVisible] = useState(false);
    const toggleCallout = (): void => {
        setCopiedVisible(false);
        setCalloutVisible(!isCalloutVisible);
    };
    const toggleCopied = (): void => {
        setCopiedVisible(!isCopiedVisible);
    };
    const nodes = useSelector<AppState, GuidedAnswerNode[]>((state) => state.activeGuidedAnswerNode);
    const treeId = useSelector<AppState, GuidedAnswerTreeId>((state) => state.activeGuidedAnswer!.TREE_ID);
    const [link, setLink] = useState('');

    useEffect(() => {
        setLink(
            `vscode://saposs.sap-guided-answers-extension#/tree/${treeId}/actions/${nodes
                .map((n) => n.NODE_ID)
                .join(':')}`
        );
    }, [nodes, treeId]);

    return (
        <div>
            <UIIconButton
                className="guided-answer__header__navButtons guided-answer__header__navButtons__content"
                id={id}
                iconProps={{ iconName: UiIcons.Link }}
                checked={isCalloutVisible}
                onClick={toggleCallout}></UIIconButton>
            {isCalloutVisible && (
                <UICallout
                    target={`#${id}`}
                    isBeakVisible={true}
                    beakWidth={10}
                    directionalHint={DirectionalHint.bottomCenter}
                    onDismiss={() => toggleCallout()}
                    calloutWidth={230}
                    calloutMinWidth={230}>
                    <div>
                        <div style={{ margin: '10px 0 0 10px', fontSize: '13px', fontWeight: '700' }}>
                            Share this answer
                        </div>
                        <div style={{ display: 'flex', margin: '10px' }}>
                            {!isCopiedVisible && <UITextInput value={link} style={{ width: '184px' }} />}
                            {isCopiedVisible && (
                                <div
                                    style={{
                                        width: '186px',
                                        border: '1px solid var(--vscode-terminal-ansiGreen)',
                                        lineHeight: '22px',
                                        paddingLeft: '6px',
                                        fontSize: '13px',
                                        display: 'inline-block'
                                    }}>
                                    <UIIcon
                                        iconName={UiIcons.ConfirmationCheckSymbol}
                                        style={{ marginRight: '5px', verticalAlign: 'middle' }}
                                    />
                                    Copied to clipboard
                                </div>
                            )}
                            <CopyToClipboard text={link} onCopy={toggleCopied}>
                                <UIIcon
                                    className="copy-to-clipboard"
                                    iconName={UiIcons.Copy}
                                    style={{ padding: '5px 0 0 10px', cursor: 'pointer' }}
                                />
                            </CopyToClipboard>
                        </div>
                        <p style={{ padding: '0 10px 0 10px', fontSize: '11px' }}>
                            Paste this code into search field on the home page to get back here.
                        </p>
                    </div>
                </UICallout>
            )}
        </div>
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

export { AllAnswersButton };
