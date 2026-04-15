# Hawtio AI Plugin Example

This sample application demonstrates how to run Hawtio with Quarkus and the [Hawtio AI plugin](https://github.com/hawtio/hawtio-ai-plugin).

The AI plugin integrates AI-powered features into Hawtio, leveraging AI models including Google Gemini and Ollama to provide intelligent assistance for managing and monitoring your applications.

## Prerequisites

To use the AI plugin features, you'll need:

- A Google API key for the Gemini models
- Configure the API key in the Hawtio AI preferences after starting the application

## How to run

Run in development mode with:

```console
mvn compile quarkus:dev
```

Or build the project and execute the runnable JAR:

```console
mvn package && java -jar target/quarkus-app/quarkus-run.jar
```

Or build the container image and run it (see <https://quarkus.io/guides/container-image>):

```console
mvn clean install -DskipTests -Dquarkus.container-image.build=true
podman run -p 8080:8080 quay.io/hawtio/hawtio-example-ai:5.0-SNAPSHOT
```

Hawtio is available at <http://localhost:8080/hawtio>.

## AI Plugin

### Configuration

The AI plugin is configured in [src/main/resources/application.yaml](./src/main/resources/application.yaml):

```yaml
quarkus:
  hawtio:
    plugin:
      ai-plugin:
        scope: hawtioAiPlugin
        module: ./plugin
    http:
      csp:
        connectSrc: https://generativelanguage.googleapis.com
```

The Content Security Policy (CSP) is configured to allow connections to the remote [Google Gemini models](https://gemini.google.com/).

### Features

The AI plugin provides:

- AI-powered assistance for troubleshooting and monitoring
- Integration with various AI models
- Context-aware suggestions based on your application's state

For more information about configuring and using the AI plugin, refer to the Hawtio AI plugin documentation.
