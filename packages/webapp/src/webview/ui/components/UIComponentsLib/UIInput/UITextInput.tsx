import React from 'react';

import type { ITextFieldStyleProps, ITextFieldStyles } from '@fluentui/react';
import { TextField } from '@fluentui/react';

export { ITextField, ITextFieldProps } from '@fluentui/react';

/**
 * UITextInput component
 * based on https://developer.microsoft.com/en-us/fluentui#/controls/web/textfield
 *
 * @export
 * @class UITextInput
 * @extends {React.Component<ITextFieldProps, {}>}
 */
export class UITextInput extends React.Component<any> {
    public constructor(props: any) {
        super(props);
    }

    render(): JSX.Element {
        const textFieldStyles = (props: ITextFieldStyleProps): Partial<ITextFieldStyles> => {
            return {
                ...{
                    root: {
                        height: 'auto',
                        fontFamily: 'var(--vscode-font-family)'
                    },
                    fieldGroup: [
                        !props.disabled &&
                            !props.multiline && {
                                backgroundColor: 'var(--vscode-input-background)',
                                border: '1px solid var(--vscode-editorWidget-border)',
                                borderRadius: 0,
                                height: 24,
                                maxHeight: 24,
                                minHeight: 24,
                                boxSizing: 'initial',
                                selectors: {
                                    '&:hover': {
                                        border: '1px solid var(--vscode-focusBorder)'
                                    }
                                }
                            },
                        props.multiline && {
                            backgroundColor: 'var(--vscode-input-background)',
                            border: '1px solid var(--vscode-editorWidget-border)',
                            borderRadius: 0,
                            boxSizing: 'initial',
                            selectors: {
                                '&:hover': {
                                    border: '1px solid var(--vscode-focusBorder)'
                                }
                            }
                        },
                        props.disabled &&
                            !props.multiline && {
                                color: 'var(--vscode-input-foreground)',
                                opacity: 0.4,
                                backgroundColor: `var(--vscode-editor-inactiveSelectionBackground)`,
                                borderColor: 'var(--vscode-editorWidget-border)',
                                border: '1px solid var(--vscode-editorWidget-border)',
                                borderRadius: 0,
                                height: 24,
                                maxHeight: 24,
                                minHeight: 24,
                                boxSizing: 'initial'
                            },
                        props.focused &&
                            !props.disabled && {
                                selectors: {
                                    ':after': {
                                        border: `1px solid var(--vscode-focusBorder)`
                                    }
                                }
                            }
                    ],
                    field: [
                        !props.multiline && {
                            backgroundColor: 'var(--vscode-input-background)',
                            color: 'var(--vscode-input-foreground)',
                            lineHeight: 'normal',
                            height: 24,
                            maxHeight: 24,
                            minHeight: 24,
                            fontSize: '13px',
                            fontWeight: 'normal',
                            boxSizing: 'border-box',
                            selectors: {
                                '::placeholder': {
                                    fontSize: 13,
                                    fontFamily: 'var(--vscode-font-family)',
                                    color: 'var(--vscode-input-placeholderForeground)'
                                }
                            }
                        },
                        props.hasIcon && {
                            selectors: {
                                '&:hover': {
                                    cursor: 'pointer'
                                }
                            }
                        },

                        props.multiline && {
                            backgroundColor: 'var(--vscode-input-background)',
                            color: 'var(--vscode-input-foreground)',
                            minHeight: '60px',
                            height: 'auto',
                            display: 'flex',
                            fontSize: '13px',
                            fontWeight: 'normal',
                            boxSizing: 'border-box',
                            selectors: {
                                '::placeholder': {
                                    fontSize: 13,
                                    fontFamily: 'var(--vscode-font-family)',
                                    color: 'var(--vscode-input-placeholderForeground)'
                                }
                            }
                        },

                        // props for input element inside field group
                        props.disabled && {
                            fontStyle: 'italic',
                            backgroundColor: 'transparent'
                        }
                    ],
                    suffix: {
                        backgroundColor: 'var(--vscode-input-background)'
                    },
                    subComponentStyles: {
                        label: {
                            root: [
                                {
                                    marginTop: 25
                                },
                                props.disabled && {
                                    opacity: '0.4'
                                },
                                props.required && {
                                    selectors: {
                                        '::after': {
                                            content: `' *'`,
                                            color: 'var(--vscode-inputValidation-errorBorder)',
                                            paddingRight: 12
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    icon: [
                        {
                            bottom: 2
                        }
                    ]
                }
            };
        };

        return <TextField {...this.props} styles={textFieldStyles} />;
    }
}
