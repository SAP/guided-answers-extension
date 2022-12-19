import { SELECT_NODE, SEND_FEEDBACK_OUTCOME } from '@sap/guided-answers-extension-types';
import type { GuidedAnswerActions } from '@sap/guided-answers-extension-types';
import { trackEvent } from './telemetry';

/**
 * Map specified redux actions to to telemetry events and track them.
 *
 * @param action - action that occurred
 */
export async function trackAction(action: GuidedAnswerActions): Promise<void> {
    let actionProps = {};

    switch (action.type) {
        case SELECT_NODE: {
            actionProps = { nodeId: action.payload.toString() };
            break;
        }
        case SEND_FEEDBACK_OUTCOME: {
            actionProps = action.payload;
            break;
        }
        default: {
            // Nothing to do if the action is not handled
            return;
        }
    }
    const properties = {
        action: action.type,
        ...actionProps
    };
    trackEvent({ name: 'GA_USER_INTERACTION', properties });
}
