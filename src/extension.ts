import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const provider = new FunctionListProvider();

    const viewContainer = vscode.window.createTreeView('functionListView', {
        treeDataProvider: provider
    });

    context.subscriptions.push(viewContainer);

    const revealRangeCommand = vscode.commands.registerCommand('functionList.revealRange', (range: vscode.Range) => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
            editor.selection = new vscode.Selection(range.start, range.start);
        }
    });

    context.subscriptions.push(revealRangeCommand);

    vscode.window.onDidChangeActiveTextEditor(() => {
        provider.refresh();
    });

    vscode.workspace.onDidChangeTextDocument(() => {
        provider.refresh();
    });

    // Enable the secondary sidebar
    vscode.commands.executeCommand('workbench.view.extension.secondarySidebar');
}

export function deactivate() {}

export class FunctionListProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | void> = new vscode.EventEmitter<TreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
        if (!vscode.window.activeTextEditor) {
            return Promise.resolve([]);
        }

        if (element) {
            return Promise.resolve(element.children);
        }

        const text = vscode.window.activeTextEditor.document.getText();
        const items = this.extractItems(text);
        return Promise.resolve(items);
    }

    private extractItems(text: string): TreeItem[] {
        const functionRegex = /\b(?:function|const|let)\s+([a-zA-Z0-9_]+)\s*(?:\([^)]*\))?\s*=>|\bfunction\s+([a-zA-Z0-9_]+)\s*\(/g;
        const classRegex = /class\s+([a-zA-Z0-9_]+)\s*(?:extends\s+[a-zA-Z0-9_]+\s*)?(?:implements\s+[a-zA-Z0-9_,\s]+)?\s*\{([\s\S]*?)\n\}/g;
        const methodRegex = /^\s*([a-zA-Z0-9_]+)\s*\(/gm;

        const functions: TreeItem[] = [];
        const classes: TreeItem[] = [];

        let match;

        // Extract functions
        while ((match = functionRegex.exec(text)) !== null) {
            const functionName = match[1] || match[2];
            const startPos = vscode.window.activeTextEditor?.document.positionAt(match.index);
            const endPos = vscode.window.activeTextEditor?.document.positionAt(match.index + match[0].length);
            if (startPos && endPos) {
                const range = new vscode.Range(startPos, endPos);
                const code = text.split('\n').slice(startPos.line, startPos.line + 5).join('\n');
                functions.push(new TreeItem(functionName, range, code, 'function'));
            }
        }
        console.log('Extracted functions:', functions);

        // Extract classes and methods within classes
        while ((match = classRegex.exec(text)) !== null) {
            const className = match[1];
            const classBody = match[2];
            const classStartPos = vscode.window.activeTextEditor?.document.positionAt(match.index);
            const classEndPos = vscode.window.activeTextEditor?.document.positionAt(match.index + match[0].length);

            console.log('Matched class body:', classBody);

            if (classStartPos && classEndPos) {
                const classChildren: TreeItem[] = [];
                const classRange = new vscode.Range(classStartPos, classEndPos);
                const classCode = text.split('\n').slice(classStartPos.line, classStartPos.line + 5).join('\n');

                // Extract methods within the class body
                let methodMatch;
                while ((methodMatch = methodRegex.exec(classBody)) !== null) {
                    const methodName = methodMatch[1];
                    const methodStartIndex = match.index + classBody.indexOf(methodMatch[0]);
                    const methodStartPos = vscode.window.activeTextEditor?.document.positionAt(methodStartIndex);
                    const methodEndPos = vscode.window.activeTextEditor?.document.positionAt(methodStartIndex + methodMatch[0].length);

                    if (methodStartPos && methodEndPos) {
                        const methodChildren: TreeItem[] = [];
                        const methodRange = new vscode.Range(methodStartPos, methodEndPos);
                        const methodCode = text.split('\n').slice(methodStartPos.line, methodStartPos.line + 5).join('\n');
                        const methodItem = new TreeItem(methodName, methodRange, methodCode, 'method', methodChildren);
                        classChildren.push(methodItem);

                        // Extract nested functions within the method body
                        const methodBody = classBody.substring(classBody.indexOf(methodMatch[0]), classBody.indexOf('}', classBody.indexOf(methodMatch[0])) + 1);
                        this.extractNestedFunctions(methodBody, methodChildren, methodStartIndex);
                    }
                }
                console.log(`Extracted methods for class ${className}:`, classChildren);

                const classItem = new TreeItem(className, classRange, classCode, 'class', classChildren);
                classes.push(classItem);
            }
        }
        console.log('Extracted classes:', classes);

        return [...functions, ...classes];
    }

    private extractNestedFunctions(body: string, children: TreeItem[], offset: number, depth = 0): void {
        const functionRegex = /\bfunction\s+([a-zA-Z0-9_]+)\s*\(/g;
        const maxDepth = 10; // Safeguard against too deep recursion

        let match;

        if (depth > maxDepth) {
            console.warn('Maximum depth reached for nested function extraction.');
            return;
        }
        while ((match = functionRegex.exec(body)) !== null) {
            const functionName = match[1];
            const functionStartIndex = offset + match.index;
            const startPos = vscode.window.activeTextEditor?.document.positionAt(functionStartIndex);
            const endPos = vscode.window.activeTextEditor?.document.positionAt(functionStartIndex + match[0].length);

            if (startPos && endPos) {
                const range = new vscode.Range(startPos, endPos);
                const code = body.split('\n').slice(startPos.line, startPos.line + 5).join('\n');
                const functionItem = new TreeItem(functionName, range, code, 'function');
                children.push(functionItem);

                // Recursively extract nested functions
                const functionBody = body.substring(match.index, body.indexOf('}', match.index) + 1);
                this.extractNestedFunctions(functionBody, functionItem.children, functionStartIndex, depth + 1);
            }
        }
    }
}

class TreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private readonly range: vscode.Range,
        private readonly code: string,
        type: string,
        public readonly children: TreeItem[] = []
    ) {
        super(label, children.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        this.tooltip = new vscode.MarkdownString(`\`\`\`javascript\n${code}\n\`\`\``);
        this.command = {
            command: 'functionList.revealRange',
            title: 'Go to Code',
            arguments: [this.range]
        };
        this.iconPath = new vscode.ThemeIcon(type === 'class' ? 'symbol-class' : type === 'method' ? 'symbol-method' : 'symbol-function');
        this.description = type === 'class' ? label : `${label}()`;
        console.log("check children to collapse", children);
    }
}
