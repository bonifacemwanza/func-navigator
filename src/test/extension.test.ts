import * as assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });

    test('Function List Provider: Functions Test', async () => {
        const provider = new myExtension.FunctionListProvider();

        const testText = `
        function foo() {
            console.log('foo');
        }

        function bar() {
            console.log('bar');
        }
        `;

        // Mock the active text editor
        const document = await vscode.workspace.openTextDocument({ content: testText });
        await vscode.window.showTextDocument(document);

        const items = await provider.getChildren();
        
        // Verify functions
        const fooItem = items.find(item => item.label === 'foo');
        const barItem = items.find(item => item.label === 'bar');

        assert.strictEqual(fooItem !== undefined, true, 'foo function should be found');
        assert.strictEqual(barItem !== undefined, true, 'bar function should be found');
    });

    // test('Function List Provider: MyClass Test', async () => {
    //     const provider = new myExtension.FunctionListProvider();

    //     const testText = `
    //     class MyClass {
    //         methodOne() {
    //             console.log('methodOne');
    //         }

    //         methodTwo() {
    //             console.log('methodTwo');
    //         }
    //     }
    //     `;

    //     // Mock the active text editor
    //     const document = await vscode.workspace.openTextDocument({ content: testText });
    //     await vscode.window.showTextDocument(document);

    //     const items = await provider.getChildren();
    //     console.log('items for MyClass Test:', items);

    //     // Verify classes
    //     const classItem = items.find(item => item.label === 'MyClass');
    //     console.log('MyClass item:', classItem);
    //     assert.strictEqual(classItem !== undefined, true, 'MyClass should be found');
    //     assert.strictEqual(classItem!.children.length, 2, 'MyClass should have two methods');

    //     // Verify methods
    //     const methodOneItem = classItem!.children.find(item => item.label === 'methodOne');
    //     const methodTwoItem = classItem!.children.find(item => item.label === 'methodTwo');

    //     assert.strictEqual(methodOneItem !== undefined, true, 'methodOne should be found');
    //     assert.strictEqual(methodTwoItem !== undefined, true, 'methodTwo should be found');
    // });

    // test('Function List Provider: ExtendedClass Test', async () => {
    //     const provider = new myExtension.FunctionListProvider();

    //     const testText = `
    //     class ExtendedClass extends MyClass {
    //         methodThree() {
    //             console.log('methodThree');
    //         }

    //         methodFour() {
    //             function nestedFunction() {
    //                 console.log('nestedFunction');
    //             }
    //             console.log('methodFour');
    //         }
    //     }
    //     `;

    //     // Mock the active text editor
    //     const document = await vscode.workspace.openTextDocument({ content: testText });
    //     await vscode.window.showTextDocument(document);

    //     const items = await provider.getChildren();
    //     console.log('items for ExtendedClass Test:', items);

    //     // Verify classes
    //     const extendedClassItem = items.find(item => item.label === 'ExtendedClass');
    //     console.log('ExtendedClass item:', extendedClassItem);
    //     assert.strictEqual(extendedClassItem !== undefined, true, 'ExtendedClass should be found');
    //     assert.strictEqual(extendedClassItem!.children.length, 2, 'ExtendedClass should have two methods');

    //     // Verify methods
    //     const methodThreeItem = extendedClassItem!.children.find(item => item.label === 'methodThree');
    //     const methodFourItem = extendedClassItem!.children.find(item => item.label === 'methodFour');

    //     assert.strictEqual(methodThreeItem !== undefined, true, 'methodThree should be found');
    //     assert.strictEqual(methodFourItem !== undefined, true, 'methodFour should be found');

    //     // Verify nested functions
    //     const nestedFunctionItem = methodFourItem!.children.find(item => item.label === 'nestedFunction');
    //     assert.strictEqual(nestedFunctionItem !== undefined, true, 'nestedFunction should be found');
    // });

    // test('Function List Provider: ImplementedClass Test', async () => {
    //     const provider = new myExtension.FunctionListProvider();

    //     const testText = `
    //     class ImplementedClass implements MyInterface {
    //         methodFive() {
    //             console.log('methodFive');
    //         }
    //     }
    //     `;

    //     // Mock the active text editor
    //     const document = await vscode.workspace.openTextDocument({ content: testText });
    //     await vscode.window.showTextDocument(document);

    //     const items = await provider.getChildren();
    //     console.log('items for ImplementedClass Test:', items);

    //     // Verify classes
    //     const implementedClassItem = items.find(item => item.label === 'ImplementedClass');
    //     console.log('ImplementedClass item:', implementedClassItem);
    //     assert.strictEqual(implementedClassItem !== undefined, true, 'ImplementedClass should be found');
    //     assert.strictEqual(implementedClassItem!.children.length, 1, 'ImplementedClass should have one method');

    //     // Verify methods
    //     const methodFiveItem = implementedClassItem!.children.find(item => item.label === 'methodFive');
    //     assert.strictEqual(methodFiveItem !== undefined, true, 'methodFive should be found');
    // });

    // test('Function List Provider: Tooltips Test', async () => {
    //     const provider = new myExtension.FunctionListProvider();

    //     const testText = `
    //     function foo() {
    //         console.log('foo');
    //     }

    //     function bar() {
    //         console.log('bar');
    //     }

    //     class MyClass {
    //         methodOne() {
    //             console.log('methodOne');
    //         }

    //         methodTwo() {
    //             console.log('methodTwo');
    //         }
    //     }

    //     class ExtendedClass extends MyClass {
    //         methodThree() {
    //             console.log('methodThree');
    //         }

    //         methodFour() {
    //             function nestedFunction() {
    //                 console.log('nestedFunction');
    //             }
    //             console.log('methodFour');
    //         }
    //     }

    //     class ImplementedClass implements MyInterface {
    //         methodFive() {
    //             console.log('methodFive');
    //         }
    //     }
    //     `;

    //     // Mock the active text editor
    //     const document = await vscode.workspace.openTextDocument({ content: testText });
    //     await vscode.window.showTextDocument(document);

    //     const items = await provider.getChildren();
    //     console.log("items for Tooltips Test:", items);
        
    //     const fooItem = items.find(item => item.label === 'foo');
    //     const barItem = items.find(item => item.label === 'bar');

    //     const classItem = items.find(item => item.label === 'MyClass');
    //     const methodOneItem = classItem!.children.find(item => item.label === 'methodOne');
    //     const methodTwoItem = classItem!.children.find(item => item.label === 'methodTwo');

    //     const extendedClassItem = items.find(item => item.label === 'ExtendedClass');
    //     const methodThreeItem = extendedClassItem!.children.find(item => item.label === 'methodThree');
    //     const methodFourItem = extendedClassItem!.children.find(item => item.label === 'methodFour');
    //     const nestedFunctionItem = methodFourItem!.children.find(item => item.label === 'nestedFunction');

    //     const implementedClassItem = items.find(item => item.label === 'ImplementedClass');
    //     const methodFiveItem = implementedClassItem!.children.find(item => item.label === 'methodFive');

    //     // Verify tooltips
    //     const verifyTooltip = (item: vscode.TreeItem, expectedContent: string) => {
    //         if (item.tooltip instanceof vscode.MarkdownString) {
    //             assert.strictEqual(item.tooltip.value.includes(expectedContent), true, `${item.label} tooltip should contain code`);
    //             if (item.label === 'ExtendedClass') {
    //                 assert.strictEqual(item.tooltip.value.includes('...'), true, 'ExtendedClass tooltip should contain ellipsis');
    //             }
    //         } else {
    //             assert.fail(`${item.label} tooltip is not a MarkdownString`);
    //         }
    //     };

    //     verifyTooltip(fooItem!, 'function foo()');
    //     verifyTooltip(barItem!, 'function bar()');
    //     verifyTooltip(methodOneItem!, 'methodOne()');
    //     verifyTooltip(methodTwoItem!, 'methodTwo()');
    //     verifyTooltip(methodThreeItem!, 'methodThree()');
    //     verifyTooltip(methodFourItem!, 'methodFour()');
    //     verifyTooltip(methodFiveItem!, 'methodFive()');
    //     verifyTooltip(nestedFunctionItem!, 'nestedFunction()');
    // });
});
