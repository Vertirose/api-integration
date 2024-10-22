# API Integration

This project aims to develop a robust integration between the Internet of Things (IoT) and Application Programming Interface (API) on the Amazon Web Services (AWS) platform, focusing on creating an efficient and secure architecture for real-time data communication. By utilizing AWS services such as AWS IoT Core, API Gateway, and Lambda, the project will ensure optimal collection, processing, and storage of data from IoT devices, while implementing strict security measures to protect the transferred data. In addition, system monitoring will be conducted through AWS CloudWatch to ensure performance and reliability, creating a scalable solution that supports both organizational and personal needs in the future.

## TechStack

API Integration Project uses a number of technology stacks to work properly

- [NodeJS]() -
- [Python]() -
- [API Gateway]() -
- [DynamoDB]() -
- [Lambda]() -

## Front-end Setup

For the front-end, all files are available in the **/frontend** folder in this repository. All you need to do is fill in some environment variables that have been provided in the folder.

### Front-end Environment Variable

_example environment variables are also provided in the folder_

```
API_DATA="YOUR_API_DATA"
API_MESSAGE="YOUR_API_MESSAGE"
DEV_PORT="YOUR_DEVELOPMENT_PORT" # 3000
PROD_PORT="YOUR_PRODUCTION_PORT" # 5000
```

### Project Setup

Install dependencies by performing the following command

```
npm install
```

#### Compile and Hot-Reload for Development

Run the application for development by performing the following command

```
npm run dev
```

#### Type-Check, Compile and Minify for Production

Run the application for development by performing the following command

```
npm run build
```

_Follow each step to run the application properly so that there are no configuration errors later_

## Lambda

AWS Lambda has an important role in this project, as its functions control how the API operates. Therefore, all Lambda-related requirements have been provided in the **/lambda** folder. Be sure to configure and manage these functions so that the API can run optimally.

## Dummy Data

If you don't have an IoT device to test in this project, you can use the prepared dummy data in the **/iot** folder to invoke an endpoint from AWS IoT Core. This will allow you to test functionality without the need for a physical device.

---

Author - Vertirose
