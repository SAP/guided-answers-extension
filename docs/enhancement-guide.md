# Enhancement Guide

This extension allows to enhance the content provide from [SAP Guided Answers](https://ga.support.sap.com/dtp/viewer/) nodes and trees. There are currently two types of enhancements: node enhancements and html enhancements. Node enhancements are maintained together with the Guided Answer, html enhancements are currently defined in JSON file [packages/ide-extension/src/enhancement/enhancements.json](../packages/ide-extension/src/enhancement/enhancements.json). An enhancement can execute either of two actions, it can start a command from VSCode's command palette or execute a command in VSCode's terminal.

Here is a sample html enhancement configuration:

```
{
  "htmlEnhancements": [
    {
      "text": "SAP Fiori tools",
      "command": {
        "label": "SAP Fiori tools release notes",
        "description": "Run command to show SAP Fiori tools release notes",
        "exec": {
          "extensionId": "sapse.sap-ux-application-modeler-extension",
          "commandId": "sap.ux.fioriTools.showReleaseNotes"
        },
        "environment": ["VSCODE", "SBAS"]
      }
    }
  ]
}
```

## Explanation of the different enhancements

Let's have a look at the different enhancements defined in the example above.

### Node enhancements

Node enhancements are maintained together with the Guided Answers in the editor. There are two types of node enhancements: `Extension Commands`, which are commands like the ones in command palette and `Terminal Commands`, which are executed in the terminal.

Extension commands have following properties: 
- `Label` is the text that appear on the clickable command next to the node content
- `Description` is the tooltip for the command

A `VSCodeCommand` has properties:
- `Extension ID`, which is the id of the extension that provides the command
- `Command ID` is the id of the command
- Additionally, if the command accepts arguments they can be passed using the property `argument`.

The `Environment` property tells the extension, that these node enhancement should be applied if this extension runs in Microsoft Visual Studio Code (`VSCODE`) or SAP Business Application Studio (`SBAS`).

Terminal commands have also a label and description, but instead of extension id and command id, they have properties
- `cwd`, which allows to pass the current working directory in which the command should be executed
- `arguments`, the actual command with arguments, like `code --version`.

There can be multiple node enhancements for a single node.

----

### Html enhancements

The second type of enhancements, html enhancements, are independent of the node that is currently viewed. 

```
{
  "text": "SAP Fiori tools",
  "command": {
    "label": "SAP Fiori tools release notes",
    "description": "Run command to show SAP Fiori tools release notes",
    "exec": {
      "extensionId": "sapse.sap-ux-application-modeler-extension",
      "commandId": "sap.ux.fioriTools.showReleaseNotes"
    },
    "environment": ["VSCODE", "SBAS"]
  }
}
```

With this enhancement, every occurrence of the string 'SAP Fiori tools' in any body of the node is replaced with a link, that executes that specified action from `exec` property. In this case, if the SAP Fiori tools - Application Modeler extension is installed, it open the release notes for it.

----

### How to find Extension and Command Ids
 
An HTML enhancement can execute a command from VSCode's command palette. To start a command via the command palette, two things are required

1. Extension id
2. Command id


The extension identifier can be found in the extension 'Details' section


<img width="1129" alt="Screenshot 2022-09-27 at 15 57 20" src="https://user-images.githubusercontent.com/9609226/192562085-5fb6f893-ed17-4939-b4d9-bd45aec91e14.png">


The command ids available to be called can be found under 'Commands' in the 'Feature Contributions' section


<img width="1124" alt="Screenshot 2022-09-27 at 16 01 51" src="https://user-images.githubusercontent.com/9609226/192563154-3518ee6d-8d8f-4316-9b0a-79712aa44e15.png">


