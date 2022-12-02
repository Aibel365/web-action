module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverageFrom: [],
    transform: {
        "^.+\\.(js|ts)$": [
            "ts-jest",
            {
                /* ts-jest config goes here in Jest */
            }
        ]
    }
};