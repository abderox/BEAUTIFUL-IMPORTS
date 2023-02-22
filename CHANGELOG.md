# Change Log

## Unreleased

- Removes unused imports.
- Formating imports on save.

## Release Notes

### [1.0.3] - 2022-02-22

- Now it can formats React Componenets' attributes and props with more or equal to `3`
- You better format your document using the famous shortcut `Alt+Shift+F` before using this extesnion.

_It transforms this_

```typescript
< Component disabled className = 'heheh' value1={val} value2={val2} value3=50  />
```

_To this_

```typescript
<Component
              className='heheh'
              value1={val}
              value2={val2}
              value3=50
/>
```

### [1.0.2] - 2022-02-22

- No changes within the extension
- Changing Extension categories from other to Formatters

### [1.0.1] - 2022-02-22

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

## [1.0.0] - 2022-02-20

- Supports automatic sorting and formatting of import statements in JavaScript files
Features
- Supports both import and require statements

## Feautures

- The Beautiful imports extension is designed to improve the readability of JavaScript files by formatting imports.
- Supports automatic sorting.
- Supports both import and require statements.
- Supports both Javascript and Typescript imports.
- Formats format exports both for commonJS & moduleJS.
- Formats React Componenets' attributes

## Known Issues

- In rare cases, formatting may not work correctly if the import statements are not formatted correctly in the first place.
- `Error: Illegal value for 'line'` may be thrown.
- ⚠️ This is  just a prototype, it will be replaced or removed sooner.
