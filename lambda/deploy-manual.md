# Deploy Manual Installation

In this installation manual, several connections between functions and files will be shown and also the environment variables used in the function.

---

## *tryout-fetch-function*

The tryout-fetch-function uses `./iot-get` with the following environment variables:

```
DYNAMODB_TABLE
```

## *tryout-store-function*

The tryout-store-function uses `./iot-store` with the following environment variables:

```
DYNAMODB_TABLE
```

## *tryout-message-function*

The tryout-message-function uses `./message` with the following environment variables:

```
DYNAMODB_TABLE
SNS_TOPIC_ARN
```