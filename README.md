# Beautiful imports README

This is the README for your extension "Beautiful imports"

<p
    align="center"
    style="text-align: center;"
>
    <img
        src="./github/logo-200x200-.png"
        alt="Beautiful imports"
    />
</p>

## Overview

This extension formats JavaScript imports to be more readable.

## Features

- The Beautiful imports extension is designed to improve the readability of JavaScript files by formatting imports.
- In particular, it formats inline imports with more than `3 (default value)` elements to be displayed vertically, making it easier to read and understand the imports in your code.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

## Requirements

- Before installing and using the extension, you must have Node.js and npm (Node Package Manager) installed on your system. You can download the latest version of Node.js from the official website: <https://nodejs.org/en/download/>.

- Additionally, you should have Visual Studio Code version 1.75.0 or later installed. You can download the latest version from the official website: <https://code.visualstudio.com/download>.

## Extension Settings

The extension contributes a command called `extension.formatImports` that can be triggered using the keyboard shortcut `Ctrl+Shift+J` (or `Cmd+Shift+J` on Mac). It also adds a context menu item to the editor that can be used to trigger the same command. The context menu item is available when a `JavaScript` or `TypeScript` file is open in the editor.

For example:

This extension contributes the following settings:

- `beautifulImports.enable`: Enable/disable this extension.

- `beautifulImports.maxInlineImports`: The number of inline imports allowed before they are formatted vertically. Default is 3.

## Known Issues

This is  just a prototype, it will be replaced sooner.

## Release Notes

### 1.0.0

Initial release of Beautiful imports extension.

**Enjoy!** 😄
