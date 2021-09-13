# react-native

## Description

<dl>
    <dd>
        React-Native IOS for ZION
    </dd>
</dl><br />

## Quick start

1.  Clone this repo using `git clone https://github.com/getZION/react-native.git`
2.  Move to the directory: `cd <PROJECT_NAME>`.<br />
3.  Run: `yarn install`.<br />

### IOS

- `cd ios` and `pod install` to install the dependecies
- From project root: `npm run ios` to run IOS app on the IOS simulator

### Code Formatter

Code formatting is enforced via prettier with config in package.json.

You can run `yarn prettier` to format all code in /src at once.

You should turn on "format on save" in your editor. Instructions for VSCode:

- Add a `.vscode` directory
- Create a file `settings.json` inside `.vscode`
- Install Prettier - Code formatter in VSCode
- Add the following snippets:

```json
{
  "editor.formatOnSave": true
}
```
