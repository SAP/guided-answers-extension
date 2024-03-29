import React, { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import './MessageDialogBox.scss';
import { DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import i18next from 'i18next';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { UIDefaultButton, UIDialog } from '@sap-ux/ui-components';

/**
 * @param props props for Message Dialog Box component
 * @param props.dialogTitle title for dialog box
 * @param props.dialogText text for dialog box
 * @param props.dialogVisible visability status for dialog box
 * @param props.stylingClassName classname for dialog box
 * @param props.primaryButtonAction a function that triggers a redux state change when primary button is pressed
 * @param props.defaultButtonAction a function that triggers a redux state change when default button is pressed
 * @returns - react element to show a Dialog box
 */
export function MessageDialogBox(
    props: Readonly<{
        dialogTitle: string;
        dialogText: string;
        stylingClassName: string;
        dialogVisible: boolean;
        primaryButtonAction: Function;
        defaultButtonAction: Function;
    }>
): ReactElement {
    const [isVisible, setIsVisible] = useState(props.dialogVisible);
    useEffect(() => {
        setIsVisible(props.dialogVisible);
    }, [props.dialogVisible]);

    const dialogContentProps = {
        type: DialogType.normal,
        title: props.dialogTitle,
        subText: props.dialogText
    };

    const modalProps = {
        isDarkOverlay: true,
        className: `${props.stylingClassName}`
    };

    return (
        <UIDialog hidden={!isVisible} dialogContentProps={dialogContentProps} modalProps={modalProps}>
            <DialogFooter>
                <FocusZone direction={FocusZoneDirection.horizontal} className="button-container">
                    <UIDefaultButton
                        id="dialog-home-button"
                        primary
                        text={i18next.t('HOME')}
                        onClick={() => props.primaryButtonAction()}
                    />
                    <UIDefaultButton
                        id="dialog-close-button"
                        text={i18next.t('CLOSE')}
                        onClick={() => {
                            props.defaultButtonAction();
                        }}
                    />
                </FocusZone>
            </DialogFooter>
        </UIDialog>
    );
}
