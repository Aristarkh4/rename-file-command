// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rename-file-command" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('rename-file-command.renameFile', async () => {
		// The code you place here will be executed every time your command is executed

		// No file to rename.
		if (vscode.window.activeTextEditor === undefined) {
			vscode.window.showInformationMessage('No active files to rename.');
			return;
		}

		// File is not yet saved - can save it to name it.
		if (vscode.window.activeTextEditor.document.isUntitled) {
			vscode.window.showInformationMessage('Save Untitled file to name it.');
			return;
		}

		// Get new file name (no suffix) from user.
		let new_file_name = await vscode.window.showInputBox(
			{
				placeHolder: 'New name for the file.'
			}
		);

		// User cancelled rename
		if (new_file_name === undefined) {
			return;
		}

		let old_file_name_w_ext = path.basename(vscode.window.activeTextEditor.document.fileName);
		let new_file_name_w_ext = new_file_name + path.extname(old_file_name_w_ext);


		let old_file_uri = vscode.window.activeTextEditor.document.uri;

		// Construct new file uri from old
		let new_file_uri = vscode.Uri.file(old_file_uri.fsPath);
		new_file_uri = vscode.Uri.joinPath(
			vscode.Uri.file(path.dirname(vscode.window.activeTextEditor.document.fileName)),
			new_file_name_w_ext
		);

		// Apply rename edit
		let edit = new vscode.WorkspaceEdit();
		edit.renameFile(old_file_uri, new_file_uri);
		vscode.workspace.applyEdit(edit);


		vscode.window.showInformationMessage('Renamed ' + old_file_name_w_ext + ' to ' + new_file_name_w_ext);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
