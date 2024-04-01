# Remote Hawtio plugin example

This sample plugin demonstrates how a Hawtio plugin can be hosted remotely and loaded from a secure location (SSL).

Since a Hawtio plugin is based on React and [Webpack Module Federation](https://module-federation.github.io/), this project uses Yarn v4 and [Webpack](https://webpack.js.org/) as the build tools. You can use any JS/TS tools for developing a Hawtio plugin so long as they can build a React and Webpack Module Federation application.

## Key components

The key components in the plugin project are as follows:

<!-- prettier-ignore-start -->
| File/Directory                                      | Description |
|-----------------------------------------------------| ----------- |
| [webpack.config.cjs](./webpack.config.cjs) | The build configuration file. The plugin interface is defined with `ModuleFederationPlugin`. The name `remotePlugin` and the module name `./plugin` at the `exposes` section correspond to the parameters `scope` and `module` set to the `HawtioPlugin` API. |
| [src/remote-plugin](./src/remote-plugin)            | This is where the actual code of the plugin is located. |
| [pom.xml](./pom.xml)                                | This project uses Maven as the primary tool for building. Here, the `frontend-maven-plugin` is used to trigger the build of `remote-plugin` TypeScript project. |
<!-- prettier-ignore-end -->

## How to build

```console
mvn install
```
