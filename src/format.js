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
    let exports_ = [];
    let mexports = [];
    let tags = [];

    if (!editor) { 
        return;
    }

    if (document.lineCount === 0) {
        vscode.window.showWarningMessage(`This file is empty`);
        return;
    }

    for (let i = 0; i < document.lineCount; i++) {
        try {

            const line = document.lineAt(i);

            if (!line) {
                continue;
            }

            const { import_, export_, moduleExport, require_, tag } = pushToArray(line);

            if (import_ != null) {
                imports.push(import_);
            }
            if (require_ != null) {
                requires.push(require_);
            }
            if (export_ != null) {
                exports_.push(export_);
            }
            if (moduleExport != null) {
                mexports.push(moduleExport);
            }
            if (tag != null) {
                tags.push(tag);
            }


        } catch (error) {
            console.error(`Error on line ${i}: ${error}`);
            vscode.window.showErrorMessage(`Error on line ${i}:  ${error}`);

        }

    }

    let changes = processLines(imports, requires, exports_, mexports, tags);

    if (Array.isArray(changes) && changes.length != 0) {
        const edit = new vscode.WorkspaceEdit();
        edit.set(document.uri, changes);
        changes = []
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Formating elements',
            cancellable: false
        }, (progress, token) => {
            token.onCancellationRequested(() => {
                console.log("User canceled the long running operation");
            });

            progress.report({ message: "Please wait, formatting may take a while..." });

            return vscode.workspace.applyEdit(edit);
        }).then((success) => {
            if (success) {
                vscode.window.showInformationMessage(`Elements are now Beautiful!`);
            } else {
                vscode.window.showErrorMessage(`beautifulImports Extension Failed`);
            }
        });
    }
}

function activate(context) {

    vscode.workspace.onDidChangeTextDocument((event) => {
        // Check if the event is an undo event
        if (event.contentChanges[0].rangeLength > 0 && event.contentChanges[0].text === "") {
            console.log("Undo detected. Not formatting imports.");
            return;
        }


    });
    const disposable = vscode.commands.registerCommand('extension.formatImports', formatImports);

    context.subscriptions.push(disposable);


}


function deactivate() {
    vscode.window.showErrorMessage(`beautifulImports Extension Deactivated`);
    context.subscriptions.map(e => e.dispose())

}

module.exports = {
    activate,
    deactivate
};
