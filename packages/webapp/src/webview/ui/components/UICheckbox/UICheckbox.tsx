import React from 'react';
import { Checkbox } from '@fluentui/react';
import type { ICheckboxStyles, ICheckboxStyleProps } from '@fluentui/react';
import { HighContrastSelector } from '@fluentui/style-utilities';
import { IsFocusVisibleClassName } from '@fluentui/utilities';

/**
 * UICheckbox component
 * based on https://developer.microsoft.com/en-us/fluentui#/controls/web/checkbox
 *
 * @export
 * @class UICheckbox
 * @extends {React.Component<ICheckboxProps, {}>}
 */
export class UICheckbox extends React.Component<any, {}> {
    GlobalClassNames = {
        root: 'ms-Checkbox',
        label: 'ms-Checkbox-label',
        checkbox: 'ms-Checkbox-checkbox',
        checkmark: 'ms-Checkbox-checkmark',
        text: 'ms-Checkbox-text'
    };

    public constructor(props: any) {
        super(props);
    }

    protected setStyle = (props: ICheckboxStyleProps): ICheckboxStyles => {
        return {
            root: [
                !props.disabled && [
                    !props.checked && {
                        [`:hover .${this.GlobalClassNames.checkbox}`]: {
                            background: 'var(--vscode-checkbox-background)',
                            borderColor: 'var(--vscode-focusBorder)',
                            [HighContrastSelector]: {
                                borderColor: 'Highlight'
                            }
                        },
                        [`:focus .${this.GlobalClassNames.checkbox}`]: {
                            background: 'var(--vscode-checkbox-background)',
                            borderColor: 'var(--vscode-focusBorder)'
                        },
                        [`:hover .${this.GlobalClassNames.checkmark}`]: {
                            color: 'var(--vscode-foreground)',
                            opacity: 0,
                            [HighContrastSelector]: {
                                color: 'Highlight'
                            }
                        }
                    },
                    {
                        [`:hover .${this.GlobalClassNames.text}, :focus .${this.GlobalClassNames.text}`]: {
                            color: 'var(--vscode-foreground)',
                            [HighContrastSelector]: {
                                color: props.disabled ? 'GrayText' : 'WindowText'
                            }
                        }
                    }
                ],
                props.checked &&
                    !props.indeterminate && {
                        [`:hover .${this.GlobalClassNames.checkbox}`]: {
                            background: 'var(--vscode-checkbox-background)',
                            borderColor: 'var(--vscode-focusBorder)'
                        },
                        [`:focus .${this.GlobalClassNames.checkbox}`]: {
                            background: 'var(--vscode-checkbox-background)',
                            borderColor: 'var(--vscode-focusBorder)'
                        },
                        [HighContrastSelector]: {
                            [`:hover .${this.GlobalClassNames.checkbox}`]: {
                                background: 'Highlight',
                                borderColor: 'Highlight'
                            },
                            [`:focus .${this.GlobalClassNames.checkbox}`]: {
                                background: 'Highlight'
                            },
                            [`:focus:hover .${this.GlobalClassNames.checkbox}`]: {
                                background: 'Highlight'
                            },
                            [`:focus:hover .${this.GlobalClassNames.checkmark}`]: {
                                color: 'Window'
                            },
                            [`:hover .${this.GlobalClassNames.checkmark}`]: {
                                color: 'Window'
                            }
                        }
                    }
            ],
            input: {
                [`.${IsFocusVisibleClassName} &:focus + label::before`]: {
                    content: '',
                    position: 'absolute',
                    inset: -1,
                    border: '1px solid transparent !important',
                    outline: '1px solid var(--vscode-focusBorder) !important',
                    [HighContrastSelector]: {
                        outline: '1px solid WindowText'
                    }
                }
            },
            checkbox: {
                backgroundColor: 'var(--vscode-debugToolBar-background, var(--vscode-editorWidget-background))',
                borderColor: 'var(--vscode-editorWidget-border)'
            },
            checkmark: {
                color: 'var(--vscode-checkbox-foreground, var(--vscode-editorWidget-foreground))'
            },
            text: {
                color: 'var(--vscode-foreground)'
            }
        };
    };

    render(): JSX.Element {
        return (
            <Checkbox
                {...this.props}
                styles={(props) => {
                    return { ...this.setStyle(props), ...this.props.styles };
                }}
            />
        );
    }
}
