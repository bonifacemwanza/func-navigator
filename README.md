
# Function List Side Bar

## Description

`function-list-side-bar` is a Visual Studio Code extension that adds a function list to the sidebar. This helps developers quickly navigate to functions and methods in their code.

## Features

- Display a list of all functions and methods in the active file.
- Navigate to a function or method by clicking on it in the sidebar.
- Show classes and their methods in a collapsible tree structure.
- Display tooltips with the function's or method's code snippet.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window or pressing `Ctrl+Shift+X`.
3. Search for `function-list-side-bar`.
4. Click `Install` to install the extension.
5. Reload Visual Studio Code.
6. Go to `View` > `Appearance` > `Show Secondary Sidebar` to enable the secondary sidebar.
7. Drag the "Function List" extension to the secondary sidebar.

## Usage

1. Open a file in Visual Studio Code.
2. The function list will appear in the secondary sidebar under "Function List".
3. Click on any function or method to navigate to its definition in the code.

## Commands

- `functionList.revealRange`: Reveal the function or method in the editor.

## Development

To set up the extension for development, follow these steps:

1. Clone the repository:
   \```sh
   git clone https://github.com/bonifacemwanza/func-navigator.git
   cd func-navigator
   \```

2. Install dependencies:
   \```sh
   npm install
   \```

3. Compile the extension:
   \```sh
   npm run compile
   \```

4. Open the project in Visual Studio Code:
   \```sh
   code .
   \```

5. Press `F5` to open a new VS Code window with your extension loaded.

## Publishing

To publish the extension:

1. Ensure you have the `vsce` tool installed:
   \```sh
   npm install -g vsce
   \```

2. Package the extension:
   \```sh
   vsce package
   \```

3. Login to `vsce` with your publisher name:
   \```sh
   vsce login <publisher-name>
   \```

4. Publish the extension:
   \```sh
   vsce publish
   \```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

Special thanks to the contributors and the VS Code community for their support and feedback.
