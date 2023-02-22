const vscode = require('vscode');
const path = require('path');

const { IMPORT_STATEMENT_REGEX, REQUIRE_STATEMENT_REGEX, SUPPORTED_FILE_TYPES, EXPORT_STATEMENT_REGEX, MODULE_EXPORT_REGEX } = require('./constants');

function supportedFileType() {
    const filePath = vscode.workspace.textDocuments[0].uri.fsPath;
    const fileExtension = path.extname(filePath);
    return SUPPORTED_FILE_TYPES.includes(fileExtension) ? fileExtension : null;
}

function breakIntoElements(lineText, line) {

    const importStatement = lineText.match(IMPORT_STATEMENT_REGEX);
    const requireStatement = lineText.match(REQUIRE_STATEMENT_REGEX);
    const exportStatement = lineText.match(EXPORT_STATEMENT_REGEX);
    const moduleExportStatement = lineText.match(MODULE_EXPORT_REGEX);


    if (importStatement) {
        console.log("🚀 ~ file: index.js:21 ~ breakIntoElements ~ importStatement:", importStatement)

        const [_, __, default_, elements] = importStatement;
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
        moduleExport: null
    };

    if (!line) {
        return statements;
    }

    let trimmedLine = line.text || line.b;
    trimmedLine = trimmedLine.trim();

    const { type, elements } = breakIntoElements(trimmedLine, line);

    if (statements.hasOwnProperty(type)) {
        statements[type] = elements;
    }

    return statements;

}

function processElements(maxElementsPerLine, elements) {

    const elementArray = elements.split(',').map(e => e.trim());
    let lines = []

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


function processLines(imports = [], requires = [], exports = [], mexports = []) {
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
            // Replace the import statement line with the reformatted lines
            const newText = `import ${default_ ? default_ + "," : ""} {\n${lines.join(',\n')}\n} from "${packageName.trim()}";\n`;
            changes.push(new vscode.TextEdit(line.range, newText));
        }

    }

    if (requires.length > 0) {
        for (const requireStatement of requires) {
            const { line, key, elements, packageName } = requireStatement;
            let lines = processElements(maxElementsPerLine, elements);
            // Replace the require statement line with the reformatted lines
            const newText = `${key} {\n${lines.join(',\n')}\n} = require("${packageName.trim()}");\n`;
            changes.push(new vscode.TextEdit(line.range, newText));
        }
    }

    if (exports.length > 0) {
        for (const exportStatement of exports) {
            const { line, key = null, name = null, elements } = exportStatement;
            let lines = processElements(maxElementsPerLine, elements);
            // Replace the export statement line with the reformatted lines
            const newText = `export ${key || ""} ${name ? name + " =" : ""} {\n${lines.join(',\n')}\n};\n`;
            changes.push(new vscode.TextEdit(line.range, newText));
        }

    }

    if (mexports.length > 0) {
        for (const mexportStatement of mexports) {
            const { line, elements } = mexportStatement;
            let lines = processElements(maxElementsPerLine, elements);
            // Replace the module export statement line with the reformatted lines
            const newText = `module.exports = {\n${lines.join(',\n')}\n};\n`;
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