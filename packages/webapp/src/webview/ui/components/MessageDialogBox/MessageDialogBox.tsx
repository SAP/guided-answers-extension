import React, { ReactElement, useState, useEffect } from 'react';
import './MessageDialogBox.scss';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import i18next from 'i18next';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';

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
export function MessageDialogBox(props: {
    dialogTitle: string;
    dialogText: string;
    stylingClassName: string;
    dialogVisible: boolean;
    primaryButtonAction: Function;
    defaultButtonAction: Function;
}): ReactElement {
    const [isVisible, setVisible] = useState(props.dialogVisible);
    useEffect(() => {
        setVisible(props.dialogVisible);
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
        <>
            <Dialog hidden={!isVisible} dialogContentProps={dialogContentProps} modalProps={modalProps}>
                <DialogFooter>
                    <FocusZone direction={FocusZoneDirection.horizontal} className="button-container">
                        <PrimaryButton
                            className="primary-button"
                            text={i18next.t('HOME')}
                            onClick={() => props.primaryButtonAction()}
                        />
                        <DefaultButton
                            className="default-button"
                            text={i18next.t('CLOSE')}
                            onClick={() => {
                                props.defaultButtonAction();
                            }}
                        />
                    </FocusZone>
                </DialogFooter>
            </Dialog>
        </>
    );
}
