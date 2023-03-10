const vscode = require('vscode');
const path = require('path');

const {
    IMPORT_STATEMENT_REGEX,
    REQUIRE_STATEMENT_REGEX,
    EXPORT_STATEMENT_REGEX,
    MODULE_EXPORT_REGEX,
    TAG_REGEX,
    TAG_ATTRIBUTES,
    SUPPORTED_FILE_TYPES, } = require('./constants');

function supportedFileType() {
    const filePath = vscode.workspace.textDocuments[0].uri.fsPath;
    const fileExtension = path.extname(filePath);
    return SUPPORTED_FILE_TYPES.includes(fileExtension) ? fileExtension : null;
}

function handelClosingTag(lineText) {
    const str = lineText.trimRight();
    return str.slice(-2) === "/>" ? str.slice(0, -2) + " />" : str.slice(-1) === ">" ? str.slice(0, -1) + " >" : str + " >";
}

function breakIntoElements(lineText, line) {

    const importStatement = lineText.trim().match(IMPORT_STATEMENT_REGEX);
    const requireStatement = lineText.trim().match(REQUIRE_STATEMENT_REGEX);
    const exportStatement = lineText.trim().match(EXPORT_STATEMENT_REGEX);
    const moduleExportStatement = lineText.trim().match(MODULE_EXPORT_REGEX);
    const tagStatementCheck = handelClosingTag(lineText);
    const tagStatement = tagStatementCheck.match(TAG_REGEX);
    console.log("🚀 ~ file: index.js:26 ~ breakIntoElements ~ tagStatement:", tagStatement)



    if (importStatement) {
        const [, , default_, elements] = importStatement;
        console.log("🚀 ~ file: index.js:23 ~ breakIntoElements ~ default_:", default_)
        return {
            type: 'import_',
            elements: { line, default_, elements, packageName: importStatement[importStatement.length - 1] }
        }
    } else if (requireStatement) {
        const [, key, elements] = requireStatement;
        return {
            type: 'require_',
            elements: { line, key, elements, packageName: requireStatement[requireStatement.length - 1] }
        }
    } else if (exportStatement) {
        const [, , key, name, elements] = exportStatement;
        return {
            type: 'export_',
            elements: { line, key, name, elements, packageName: exportStatement[exportStatement.length - 1] }
        }
    } else if (moduleExportStatement) {
        const [, elements] = moduleExportStatement;
        return {
            type: 'moduleExport',
            elements: { line, elements, packageName: moduleExportStatement[moduleExportStatement.length - 1] }
        }
    } else if (tagStatement) {
        const iEnabled = vscode.workspace.getConfiguration('beautifulImports').get('EnableForComponents');
        console.log("🚀 ~ file: index.js:63 ~ breakIntoElements ~ iEnabled:", iEnabled)
        

        if (!iEnabled) {

            vscode.window.showInformationMessage(
                "😇 Components have been detected, but please note that the 'EnableForComponents' feature "+
                "is currently deactivated by default. This is because it is still under development. "+
                "So, not to potentially cause issues with your code, it is recommended to take a peep at the README. "+
                "You may  activate this feature from the settings."
            );

            return {
                type: null,
                elements: null
            }
        }

        const [, sapce, tagName, attributes] = tagStatement;

        if (!attributes) {
            return {
                type: null,
                elements: null
            }
        }
        let closingTag_ = lineText.trimRight().slice(-1).includes('>') ? ">" : "";
        closingTag_ = lineText.trimRight().slice(-2).includes('/>') ? '/>' : closingTag_;
        return {
            type: 'tag',
            elements: { line, indent: " ".repeat(sapce.split(" ").length - 1), tagName, attributes, closingTag: closingTag_ }
        }
    } else {
        return {
            type: null,
            elements: null
        }
    }
}

function pushToArray(line) {


    const statements = {
        import_: null,
        require_: null,
        export_: null,
        moduleExport: null,
        tag: null
    };

    if (!line) {
        return statements;
    }

    let lineText = line.text || line.b;

    const { type, elements } = breakIntoElements(lineText, line);

    if (statements.hasOwnProperty(type)) {
        statements[type] = elements;
    }

    return statements;

}


function processTagElements(maxElementsPerLine, elements, spaces) {
    let [...attributes] = elements.match(TAG_ATTRIBUTES);
    attributes = attributes.map(e => e.trim());
    let lines = []
    // check if elements >= 3
    if (attributes.length < maxElementsPerLine) {
        return lines;
    }
    console.log("🚀 ~ file: index.js:99 ~ processTagElements ~ attributes:", attributes)
    const indetsMaxNumber = vscode.workspace.getConfiguration('beautifulImports').get('IndentsMaxNumber') || 14;
    const indent = " ".repeat(indetsMaxNumber) + spaces;

    for (let i = 0; i < attributes.length; i += maxElementsPerLine) {
        let lineElements = attributes.slice(i, i + maxElementsPerLine);
        let formatedLines = lineElements.map(e => {
            const index = e.indexOf('=');
            if (index > -1) {
                const key = e.slice(0, index);
                const value = e.slice(index + 1);
                return `${indent}${key}=${value}`;
            }
            else {
                return `${indent}${e}`;
            }

        })

        lines.push(`${formatedLines.join('\n')}`);
    }
    return lines;

}

function processElements(maxElementsPerLine, elements) {

    const elementArray = elements.split(',').map(e => e.trim());
    let lines = []
    // check if elements >= 3
    if (elementArray.length < maxElementsPerLine) {
        return lines;
    }


    for (let i = 0; i < elementArray.length; i += maxElementsPerLine) {
        let lineElements = elementArray.slice(i, i + maxElementsPerLine);
        lineElements.sort();

        let formatedLines = lineElements.map(e => {
            if (e.includes(':')) {
                const [key, value] = e.split(':').map(it => it.trim());
                return `${key}: ${value}`;
            } else if (e.includes('as')) {
                const [key, value] = e.split('as').map(it => it.trim());
                return `${key} as ${value}`;
            }
            else {
                return e;
            }

        })

        lines.push(`  ${formatedLines.join(',\n  ')}`);
    }
    return lines;
}


function processLines(imports = [], requires = [], exports = [], mexports = [], tags = []) {
    const maxElementsPerLine = parseInt(vscode.workspace.getConfiguration("beautifulImports").get("maxInlineImports"));
    let changes = []

    if (!maxElementsPerLine) {
        vscode.window.showErrorMessage(`Invalid value for maxInlineImports`);
        return;
    }

    if (imports.length > 0) {
        for (const importStatement of imports) {
            const { line, default_, elements, packageName } = importStatement;
            let lines = processElements(maxElementsPerLine, elements);
            if (lines.length === 0) { continue; }
            // Replace the import statement line with the reformatted lines
            const newText = `import ${default_ ? default_ + "," : ""} {\n${lines.join(',\n')}\n} from "${packageName.trim()}";\n`;
            changes.push(new vscode.TextEdit(line.range, newText));
        }

    }

    if (requires.length > 0) {
        for (const requireStatement of requires) {
            const { line, key, elements, packageName } = requireStatement;
            let lines = processElements(maxElementsPerLine, elements);
            if (lines.length === 0) { continue; }
            // Replace the require statement line with the reformatted lines
            const newText = `${key} {\n${lines.join(',\n')}\n} = require("${packageName.trim()}");\n`;
            changes.push(new vscode.TextEdit(line.range, newText));
        }
    }

    if (exports.length > 0) {
        for (const exportStatement of exports) {
            const { line, key = null, name = null, elements } = exportStatement;
            let lines = processElements(maxElementsPerLine, elements);
            if (lines.length === 0) { continue; }
            // Replace the export statement line with the reformatted lines
            const newText = `export ${key || ""} ${name ? name + " =" : ""} {\n${lines.join(',\n')}\n};\n`;
            changes.push(new vscode.TextEdit(line.range, newText));
        }

    }

    if (mexports.length > 0) {
        for (const mexportStatement of mexports) {
            const { line, elements } = mexportStatement;
            let lines = processElements(maxElementsPerLine, elements);
            if (lines.length === 0) { continue; }
            // Replace the module export statement line with the reformatted lines
            const newText = `module.exports = {\n${lines.join(',\n')}\n};\n`;
            changes.push(new vscode.TextEdit(line.range, newText));
        }
    }

    if (tags.length > 0) {
        for (const tagStatement of tags) {
            const { line, indent, tagName, attributes, closingTag } = tagStatement;
            let lines = processTagElements(maxElementsPerLine, attributes, indent);
            if (lines.length === 0) { continue; }
            // Replace the tag statement line with the reformatted lines
            const newText = `${indent}<${tagName.trim()}\n${lines.join('\n')}\n${closingTag ? indent + closingTag.trim() : ""}`;
            changes.push(new vscode.TextEdit(line.range, newText));
        }
    }



    return changes;
}


module.exports = {
    supportedFileType,
    pushToArray,
    processLines
}