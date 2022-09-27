import React, { ReactElement, useState } from 'react';
import './MessageDialogBox.scss';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import i18next from 'i18next';

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

    // const primaryButtonFunc = () => props.primaryButtonAction();
    // const toggleDialog = (): void => {
    // setVisible(!isVisible);
    // if (isVisible === false) {
    //     primaryButtonFunc();
    // }
    // };

    const toggle = (): void => {
        console.log(isVisible);
        setVisible(!isVisible);
    };

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
                    <PrimaryButton text={i18next.t('HOME')} onClick={() => props.defaultButtonAction()} />
                    <DefaultButton text={i18next.t('CLOSE')} onClick={toggle} />
                    {/* <DefaultButton text={i18next.t('CLOSE')} /> */}
                </DialogFooter>
            </Dialog>
        </>
    );
}
