# Change Log

All notable changes to the "Beautiful Imports" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Removes unused imports and sorts the remaining imports alphabetically.
- Formating exports and sorts the remaining imports alphabetically.
- Formating imports on save.

```typescript
//this
import defaultExport, { export1, export2 } from 'module/path';
//and this
import { export1 as alias1, export2 as alias2 } from 'module/path';
//are not included yet
```

## [1.0.0] - 2022-02-20

- Initial release
- Supports automatic sorting and formatting of import statements in JavaScript files
Features
- Supports both import and require statements

## Feautures

- The Beautiful imports extension is designed to improve the readability of JavaScript files by formatting imports.
- Supports automatic sorting
- Supports both import and require statements
- Supports both Javascript and Typescript imports

## Known Issues

- In rare cases, formatting may not work correctly if the import statements are not formatted correctly in the first place.
- `Error: Illegal value for 'line'` may be thrown
- ⚠️ This is  just a prototype, it will be replaced or removed sooner.