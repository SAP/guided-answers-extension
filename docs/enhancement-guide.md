# Enhancement Guide

This extension allows to enhance the content provide from [SAP Guided Answers](https://ga.support.sap.com/dtp/viewer/) nodes and trees. There are currently two types of enhancements: node enhancements and html enhancements. Both are currently defined in JSON file [packages/ide-extension/src/enhancement/enhancements.json](../packages/ide-extension/src/enhancement/enhancements.json). An enhancement can execute either of two actions, it can start a command from VSCode's command palette or execute a command in VSCode's terminal.

Here is a sample enhancement configuration:

```
{
  "nodeEnhancements": [
    {
      "nodeId": 48366,
      "command": {
        "label": "Show App Info",
        "description": "Run command to show application info",
        "exec": {
          "extensionId": "sapse.sap-ux-application-modeler-extension",
          "commandId": "sap.ux.application.info",
        }
      }
    },
    {
      "nodeId": 48364,
      "command": {
        "label": "Check VSCode version",
        "description": "Run terminal command to show version of Visual Studio Code",
        "exec": {
          "cwd": "",
          "arguments": ["code", "--version"]
        }
      }
    }
  ],
  "htmlEnhancements": [
    {
      "text": "SAP Fiori tools",
      "command": {
        "label": "SAP Fiori tools release notes",
        "description": "Run command to show SAP Fiori tools release notes",
        "exec": {
          "extensionId": "sapse.sap-ux-application-modeler-extension",
          "commandId": "sap.ux.fioriTools.showReleaseNotes"
        }
      }
    }
  ]
}
```

## Explanation of the different enhancements

Let's have a look at the different enhancements defined in the example above.

### Node enhancements

The first node enhancement is:
```
{
  "nodeId": 48366,
  "command": {
    "label": "Show App Info",
    "description": "Run command to show application info",
    "exec": {
      "extensionId": "sapse.sap-ux-application-modeler-extension",
      "commandId": "sap.ux.application.info",
    }
  }
}
```

This means, whenever the Guided Answers node `48366` is displayed, there will be an additional button rendered with text from `label`: 'Show App Info' and `description` 'Run command to show application info'. The `exec` property defines additional information about the kind of action, command palette or terminal command. In this example we have a `VSCodeCommand` with properties:

`extensionId`: the id of the extension that provides the command 
`commandId`: the id of the command

Additionally, if the command accepts arguments they can be passed using the property `argument`.


The second node enhancement:
```
{
  "nodeId": 48364,
  "command": {
    "label": "Check VSCode version",
    "description": "Run terminal command to show version of Visual Studio Code",
    "exec": {
      "cwd": "",
      "arguments": ["code", "--version"]
    }
  }
}
```

is for node `48364`. Same as before, a button is rendered showing the text from `label` and `description`. In this case a click will open a VSCode terminal and run the command `code --version` which displays the version of VSCode.

`cwd`: allows to pass the current working directory
`arguments`: is a string array that contains the terminal command. The parts will be concatenated with a whitespace (' ').

The exact definition of the properties of `exec` can be found in [packages/types/src/types.ts](../packages/types/src/types.ts).

There can be multiple node enhancements for a single node.

----

**Hint**: When navigating to a node in a Guided Answers tree, the node id is shown in output console of VSCode. To open the output console use menu  
`View` -> `Output` and select 'Guided Answers Extension'.

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
    }
  }
}
```

With this enhancement, every occurrence of the string 'SAP Fiori tools' in any body of the node is replaced with a link, that executes that specified action from `exec` property. In this case, if the SAP Fiori tools - Application Modeler extension is installed, it open the release notes for it.
