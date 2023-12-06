import React from 'react';
import type { ReactElement } from 'react';
import { actions } from '../../../../state';
import type { GuidedAnswerNode as GuidedAnswerNodeType } from '@sap/guided-answers-extension-types';
import { UiIcons, UIIcon } from '@sap-ux/ui-components';
import '../GuidedAnswerNode.scss';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';

/**
 * @param props - props for middle component
 * @param props.activeNode - array that stores GuidedAnswers node objects
 * @returns - The middle react element
 */
export function Right(props: Readonly<{ activeNode: GuidedAnswerNodeType }>): ReactElement {
    return (
        <div className="guided-answer__node__commands">
            <FocusZone direction={FocusZoneDirection.vertical} isCircularNavigation={true}>
                {props.activeNode.COMMANDS
                    ? props.activeNode.COMMANDS.map((command) => (
                          <div
                              className="guided-answer__node__command"
                              key={`command-${command.label}`}
                              title={command.label}
                              onClick={() => {
                                  actions.executeCommand(command);
                              }}
                              onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                      actions.executeCommand(command);
                                  }
                              }}
                              role="button">
                              <div className="guided-answer__node__command__header">
                                  <UIIcon
                                      className="guided-answer__node__command__header__icon"
                                      iconName={UiIcons.CreateMockData}
                                  />
                                  <div className="guided-answer__node__command__header__label">{command.label}</div>
                              </div>

                              <button
                                  className="guided-answer__node__command__description"
                                  id="guided-answer__node__command">
                                  {command.description}
                              </button>
                          </div>
                      ))
                    : ''}
            </FocusZone>
        </div>
    );
}
