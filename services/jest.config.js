module.exports = {
    collectCoverageFrom: ["src/**/*.{js,jsx,mjs}"],
    verbose: true,
    transform: {
        "^.+\\.(css|scss|less)$": "jest-css-modules-transform",
        "^.+\\.(js|jsx|mjs)$": "babel-jest"
    },
    moduleFileExtensions: [
        "js",
        "jsx"
    ],
    moduleDirectories: [
        "node_modules"
    ],
    moduleNameMapper: {
        "^Components(.*)$": "<rootDir>/application/src/components/$1",
        "^Pages(.*)$": "<rootDir>/application/src/pages/$1",
        "^Media(.*)$": "<rootDir>/application/media/$1",
        "^GameAssets(.*)$": "<rootDir>/application/media/game_assets/$1",
        "^.+\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    },
    setupFiles: [
        "<rootDir>/application/src/SetupTests.js"
    ]
};