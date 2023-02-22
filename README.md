# Beautiful imports

<p
    align="center"
    style="text-align: center;"
>
    <img
        src="https://raw.githubusercontent.com/abderox/BEAUTIFUL-IMPORTS/main/icons/beautifulImports.png"
        alt="Beautiful imports"
    />
</p>

## DISCLAIMER

- 👋 Please pardon me, as this is my first time creating an extension for Visual Studio Code. I have limited knowledge and expertise, so I appreciate your patience.
- 🔔 It is recommended to format your document using the widely-known shortcut `Alt+Shift+F` before utilizing this extension `ctrl+Shift+J`.

## Overview

- This extension is designed to format JavaScript elements that may not be formatted by other formatters.
- Although it was initially intended to format imports, it has expanded its capabilities.

## Features

- The Beautiful imports extension is designed to improve the readability of JavaScript files by formatting imports.
- In particular, it formats inline imports with more than `3 (default value)` elements to be displayed vertically, making it easier to read and understand the imports in your code.
- Automatic sorting for imports and exports.
- Supports both import and require statements.
- Formats html tags ,React Componenets' attributes with more or equal to `3 (default value)` elements to be displayed vertically.

## Usage

<p
    align="center"
    style="text-align: center;"
>
    <img
        src="https://raw.githubusercontent.com/abderox/BEAUTIFUL-IMPORTS/main/github/extension-v1.0.3.gif"
        alt="Inline imports"
    />
</p>

- _From this_

```typescript
import {bmethod5 , cmethod6 ,amethod7, method8} from "package"

const {bmethod5 , cmethod6 ,amethod7, method8} =require ("package")

import defaultExport, { a as a1 ,b as b1, c as c1 } from "module/path"

export let Amodule = { method1: methodA, method2: methodB, method3: methodC};
```

- _To this_

```typescript
import {
  amethod5,
  bmethod6,
  cmethod7,
  method8
} from "package";

const {
  amethod5,
  bmethod6,
  cmethod7,
  method8
} = require("package");

import defaultExport, {
  a as a1,
  b as b1,
  c as c1
} from "module/path";

export let Amodule = {
  method1: methodA,
  method2: methodB,
  method3: methodC
};
```

## Unreleased

- Removes unused imports.
- Formating imports on save.

## Release Notes

### 1.0.3

- Now it can formats React Componenets' attributes and props with more or equal to `3`
_It transforms this_

```typescript
< Component disabled className = 'class' value1={val} value2={val2} value3=50 disabled  />
```

_To this_

```typescript
<Component
              className='class'
              value1={val}
              value2={val2}
              value3=50
              disabled
/>
```

### 1.0.2

- No changes within the extension

### 1.0.1

```diff
+ It is able now to format exports both for `commonJS` & `moduleJS`;
+ It is able now to format import (as a list) with its different known ways as follows 
```

```typescript
import {a, b, c} from 'module/path'
import {a as a1, b as b1, c as c1} from 'module/path'
import defaultExport, {a, b, c} from 'module/path'
import defaultExport, {a as a1, b as b1, c as c1} from 'module/path'
```

### 1.0.0

Initial release of Beautiful imports extension.

## How to install it locally Without getting to market place💻

- Go to [Release](https://github.com/abderox/BEAUTIFUL-IMPORTS/releases)
- Download the release you want `.vsix`
- Open VS Code.
- Press `Ctrl+Shift+P` (Windows, Linux) or `Cmd+Shift+P` (macOS) to open the command palette.
- Type Extensions: `Install from VSIX` in the command palette and select it.
- Navigate to the location of the `.vsix` file on your computer and select it.
- VS Code will install the extension and prompt you to restart the editor.
- If you have any unsaved work, be sure to save it before restarting.

## Requirements

- Before installing and using the extension, you must have Node.js and npm (Node Package Manager) installed on your system. You can download the latest version of Node.js from the official website: <https://nodejs.org/en/download/>.

- Additionally, you should have Visual Studio Code version 1.75.0 or later installed. You can download the latest version from the official website: <https://code.visualstudio.com/download>.

## Extension Settings

The extension contributes a command called `extension.formatImports` that can be triggered using the keyboard shortcut `Ctrl+Shift+J` (or `Cmd+Shift+J` on Mac). It also adds a context menu item to the editor that can be used to trigger the same command. The context menu item is available when a `JavaScript` or `TypeScript` file is open in the editor.

For example:

This extension contributes the following settings:

- `beautifulImports.enable`: Enable/disable this extension.

- `beautifulImports.maxInlineImports`: The number of inline imports allowed before they are formatted vertically. Default is 3.

- `beautifulImports.IndentsMaxNumber` : This number defines how many white spaces to put counting from the end of tagName . Deafault is 14.


## Known Issues

- ⚠️ This is  just a prototype, it will be replaced or removed sooner.
- In rare cases, formatting may not work correctly if the import statements are not formatted correctly in the first place.
- `Error: Illegal value for 'line'` may be thrown for some reason.

**Enjoy!** 😄
