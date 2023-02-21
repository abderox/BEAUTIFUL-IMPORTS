const vscode = require('vscode');

const {
    supportedFileType,
    pushToArray,
    processLines
} = require('./utils');

const isEnabled = vscode.workspace.getConfiguration("beautifulImports").get("enabled");


function formatImports() {

    if (!isEnabled) {
        vscode.window.showErrorMessage(`beautifulImports Extension is disabled`);
        return;
    }
    

    const editor = vscode.window.activeTextEditor;
    const document = editor.document;
    let imports = [];
    let requires = [];


    if (editor) {
        if (!supportedFileType()) {
            vscode.window.showErrorMessage(`This file type is not supported ${supportedFileType}`);
            return;
        }

    }


    if (document.lineCount === 0) {
        vscode.window.showWarningMessage(`This file is empty`);
        return;
    }

    for (let i = 0; i < document.lineCount; i++) {
        try {
            console.log("Debugging here 1")
            const line = document.lineAt(i);
            console.log("Debugging here 2")

            if (!line) {
                continue;
            }
            console.log("Debugging here 3")

            const { importStatement, requireStatement } = pushToArray(line);

            if (importStatement != null) {
                imports.push(importStatement);
            }
            if (requireStatement != null) {
                requires.push(requireStatement);
            }
        } catch (error) {
            console.error(`Error on line ${i}: ${error}`);
            vscode.window.showErrorMessage(`Error on line ${i}:  ${error}`);

        }

    }

    let changes = processLines(imports, requires);

    if (Array.isArray(changes) && changes.length != 0) {
        const edit = new vscode.WorkspaceEdit();
        edit.set(document.uri, changes);
        changes = []
        imports = []
        requires = []
        vscode.workspace.applyEdit((edit)).then(
            (success) => {
                if (success) {
                    vscode.window.showInformationMessage(`Imports sorted successfully!`);
                } else {
                    vscode.window.showErrorMessage(`beautifulImports Extension Failed`);
                }
            }
        )
    }
}

function activate(context) {

    const disposable = vscode.commands.registerCommand('extension.formatImports', ()=>{
        vscode.workspace.onDidChangeTextDocument((event) => {

            if (event.contentChanges[0].rangeLength > 0 && event.contentChanges[0].text === "") {
                console.log("Error is thrown  here")
                return;
              }
            formatImports();
            
        });
    });
    context.subscriptions.push(disposable);
}


function deactivate() {
    vscode.window.showErrorMessage(`beautifulImports Extension Deactivated`);
}

module.exports = {
    activate,
    deactivate
};
