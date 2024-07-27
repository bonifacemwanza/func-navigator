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

        class MyClass {
            methodOne() {
                console.log('methodOne');
            }

            methodTwo() {
                console.log('methodTwo');
            }
        }

        class ExtendedClass extends MyClass {
            methodThree() {
                console.log('methodThree');
            }

            methodFour() {
                function nestedFunction() {
                    console.log('nestedFunction');
                }
                console.log('methodFour');
            }
            methoddThree() {
                console.log('methodThree');
            }

            methodFoudr() {
                function nestedFunction() {
                    console.log('nestedFunction');
                }
                console.log('methodFour');
            }
        }

        class ImplementedClass implements MyInterface {
            methodFive() {
                console.log('methodFive');
            }
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
        
        // Verify classes
        const classItem = items.find(item => item.label === 'MyClass');
        assert.strictEqual(classItem !== undefined, true, 'MyClass should be found');
        assert.strictEqual(classItem!.children.length, 2, 'MyClass should have two methods');

        const extendedClassItem = items.find(item => item.label === 'ExtendedClass');
        assert.strictEqual(extendedClassItem !== undefined, true, 'ExtendedClass should be found');
        assert.strictEqual(extendedClassItem!.children.length, 4, 'ExtendedClass should have four methods');

        const implementedClassItem = items.find(item => item.label === 'ImplementedClass');
        assert.strictEqual(implementedClassItem !== undefined, true, 'ImplementedClass should be found');
        assert.strictEqual(implementedClassItem!.children.length, 1, 'ImplementedClass should have one method');

        // Verify methods
        const methodOneItem = classItem!.children.find(item => item.label === 'methodOne');
        const methodTwoItem = classItem!.children.find(item => item.label === 'methodTwo');

        assert.strictEqual(methodOneItem !== undefined, true, 'methodOne should be found');
        assert.strictEqual(methodTwoItem !== undefined, true, 'methodTwo should be found');

        const methodThreeItem = extendedClassItem!.children.find(item => item.label === 'methodThree');
        const methodFourItem = extendedClassItem!.children.find(item => item.label === 'methodFour');
        const methoddThreeItem = extendedClassItem!.children.find(item => item.label === 'methoddThree');
        const methodFoudrItem = extendedClassItem!.children.find(item => item.label === 'methodFoudr');

        assert.strictEqual(methodThreeItem !== undefined, true, 'methodThree should be found');
        assert.strictEqual(methodFourItem !== undefined, true, 'methodFour should be found');
        assert.strictEqual(methoddThreeItem !== undefined, true, 'methoddThree should be found');
        assert.strictEqual(methodFoudrItem !== undefined, true, 'methodFoudr should be found');

        const methodFiveItem = implementedClassItem!.children.find(item => item.label === 'methodFive');
        assert.strictEqual(methodFiveItem !== undefined, true, 'methodFive should be found');

        // Verify nested functions
        const nestedFunctionItem1 = methodFourItem!.children.find(item => item.label === 'nestedFunction');
        const nestedFunctionItem2 = methodFoudrItem!.children.find(item => item.label === 'nestedFunction');
        assert.strictEqual(nestedFunctionItem1 !== undefined, true, 'nestedFunction in methodFour should be found');
        assert.strictEqual(nestedFunctionItem2 !== undefined, true, 'nestedFunction in methodFoudr should be found');

        // Verify tooltips
        const verifyTooltip = (item: vscode.TreeItem, expectedContent: string) => {
            if (item.tooltip instanceof vscode.MarkdownString) {
                assert.strictEqual(item.tooltip.value.includes(expectedContent), true, `${item.label} tooltip should contain code`);
            } else {
                assert.fail(`${item.label} tooltip is not a MarkdownString`);
            }
        };

        verifyTooltip(fooItem!, 'function foo()');
        verifyTooltip(barItem!, 'function bar()');
        verifyTooltip(methodOneItem!, 'methodOne()');
        verifyTooltip(methodTwoItem!, 'methodTwo()');
        verifyTooltip(methodThreeItem!, 'methodThree()');
        verifyTooltip(methodFourItem!, 'methodFour()');
        verifyTooltip(methoddThreeItem!, 'methoddThree()');
        verifyTooltip(methodFoudrItem!, 'methodFoudr()');
        verifyTooltip(methodFiveItem!, 'methodFive()');
        verifyTooltip(nestedFunctionItem1!, 'nestedFunction()');
        verifyTooltip(nestedFunctionItem2!, 'nestedFunction()');
    });
});
