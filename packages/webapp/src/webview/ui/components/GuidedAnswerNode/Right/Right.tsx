import React, { ReactElement } from 'react';
import { actions } from '../../../../state';
import type { GuidedAnswerNode as GuidedAnswerNodeType } from '@sap/guided-answers-extension-types';
import '../GuidedAnswerNode.scss';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';

/**
 * @param props - props for middle component
 * @param props.activeNode - array that stores GuidedAnswers node objects
 * @returns - The middle react element
 */
export function Right(props: { activeNode: GuidedAnswerNodeType }): ReactElement {
    return (
        <div id="right" className="column">
            <div className="guided-answer__node__commands">
                <FocusZone direction={FocusZoneDirection.vertical} isCircularNavigation={true}>
                    {props.activeNode.COMMANDS
                        ? props.activeNode.COMMANDS.map((command, index) => (
                              <div className="guided-answer__node__command" key={`command-${index}`}>
                                  <div className="guided-answer__node__command__header">
                                      <div className="guided-answer__node__command__header__label">{command.label}</div>
                                  </div>

                                  <button
                                      className="guided-answer__node__command__description"
                                      onClick={(): void => {
                                          actions.executeCommand(command);
                                      }}>
                                      {command.description}
                                  </button>
                              </div>
                          ))
                        : ''}
                </FocusZone>
            </div>
        </div>
    );
}
