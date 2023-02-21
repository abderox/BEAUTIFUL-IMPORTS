const vscode = require('vscode');
const path = require('path');

const { IMPORT_STATEMENT_REGEX, REQUIRE_STATEMENT_REGEX, SUPPORTED_FILE_TYPES } = require('./constants');

function supportedFileType() {
    const filePath = vscode.workspace.textDocuments[0].uri.fsPath;
    const fileExtension = path.extname(filePath);
    return SUPPORTED_FILE_TYPES.includes(fileExtension) ? fileExtension : null;
}


function pushToArray(line) {

    console.log("🚀 ~ file: index.js:15 ~ pushToArray ~ line:", (!!line))

    let importStatement = null;
    let requireStatement = null;

    if (!line) {
        return { importStatement, requireStatement};
    }
    
    let trimmedLine = line.text || line.b;
    console.log("🚀 ~ file: index.js:27 ~ pushToArray ~ trimmedLine:", trimmedLine)
    trimmedLine = trimmedLine.trim();

    const matchImport = trimmedLine.match(IMPORT_STATEMENT_REGEX);
    const matchRequire = trimmedLine.match(REQUIRE_STATEMENT_REGEX);

    if (matchImport) {
        const [_, elements] = matchImport;
        importStatement = { line, elements, packageName: matchImport[matchImport.length - 1] };
        console.log("🚀 ~ file: format.js:27 ~ formatImports ~ importStatement:", importStatement)
    }
    else if (matchRequire) {
        const [_, key, elements] = matchRequire;
        requireStatement = { line, key, elements, packageName: matchRequire[matchRequire.length - 1] };
        console.log("🚀 ~ file: format.js:56 ~ formatImports ~ requireStatement:", requireStatement);
    }

    return { importStatement, requireStatement };

}

function processElements(maxElementsPerLine, elements) {

    const elementArray = elements.split(',').map(e => e.trim());
    let lines = []

    for (let i = 0; i < elementArray.length; i += maxElementsPerLine) {
        let lineElements = elementArray.slice(i, i + maxElementsPerLine);
        lineElements.sort();
        lines.push(`  ${lineElements.join(',\n  ')}`);
    }

    return lines;
}


function processLines(imports, requires) {
    const maxElementsPerLine = parseInt(vscode.workspace.getConfiguration("beautifulImports").get("maxInlineImports"));
    let changes = []

    if (!maxElementsPerLine) {
        vscode.window.showErrorMessage(`Invalid value for maxInlineImports`);
        return;
    }

    if (imports.length > 0) {
        for (const importStatement of imports) {
            const { line, elements, packageName } = importStatement;
            let lines = processElements(maxElementsPerLine, elements);
            // Replace the import statement line with the reformatted lines
            const newText = `import {\n${lines.join(',\n')}\n} from "${packageName.trim()}";`;
            changes.push(new vscode.TextEdit(line.range, newText));
        }

    }

    if (requires.length > 0) {
        for (const requireStatement of requires) {
            const { line, key, elements, packageName } = requireStatement;
            let lines = processElements(maxElementsPerLine, elements);
            // Replace the require statement line with the reformatted lines
            const newText = `${key} {\n${lines.join(',\n')}\n} = require("${packageName.trim()}");`;
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