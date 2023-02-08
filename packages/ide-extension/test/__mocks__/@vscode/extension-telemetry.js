module.exports = class TelemetryReporter {
    constructor() {
        return {
            sendTelemetryEvent: jest.fn()
        };
    }
};
