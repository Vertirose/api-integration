# API Integration

This project focuses on creating a monitoring and alerting solution for IoT devices within the company by leveraging APIs and a serverless cloud environment. The solution incorporates real-time monitoring to efficiently track the status and performance of connected IoT devices. A robust alerting system ensures administrators are promptly notified of issues or specific conditions. Additionally, database backup mechanisms have been implemented to maintain data availability and resilience.

## Tech Stack

The API Integration Project leverages a powerful combination of technologies to ensure reliability and efficiency:

- **[Node.js](https://nodejs.org/):** Utilized for building scalable, event-driven server-side applications and managing API interactions.
- **[Python](https://www.python.org/):** Used for AWS Lambda functions due to its simplicity and extensive support for AWS SDKs.
- **[API Gateway](https://aws.amazon.com/api-gateway/):** A managed service for creating, publishing, maintaining, and securing APIs at scale.
- **[DynamoDB](https://aws.amazon.com/dynamodb/):** A fully managed NoSQL database ensuring high availability, scalability, and performance.
- **[AWS Lambda](https://aws.amazon.com/lambda/):** Facilitates serverless computing for event-driven tasks, such as processing IoT data and integrating with DynamoDB.

## Front-End Setup

The front-end for this project is located in the **/frontend** folder within this repository. Before running the application, ensure all environment variables provided in the folder are configured correctly.

### Front-End Environment Variables

Below is an example of the environment variables required for the application:

```env
API_MAIN=https://api-url/main
API_MESSAGE=https://api-url/message
LOG_DIR=/log/storage
```

## Project Setup

Install dependencies by running the following command:

```bash
npm install
```

### Dynamic Chart Rendering for Development

In the development environment, the application utilizes **dynamic chart rendering**, ensuring that only essential chart components are loaded. This approach accelerates hot-reload performance, enabling efficient development cycles. Start the development server with:

```bash
npm run dev
```

### Static Asset Preloading for Production

For production, the application implements **static asset preloading**, bundling all components (charts, styles, and other assets) into optimized static files. This ensures fast load times and a seamless user experience. Build and serve the application for production using:

```bash
npm start
```

> **Note:** Follow these steps carefully to avoid configuration issues.

## AWS Lambda

AWS Lambda plays a critical role in this project, managing how APIs interact with the backend. All Lambda function requirements are available in the **/lambda** folder. Configure these functions correctly to ensure optimal API performance.

## Dummy Data

If IoT devices are unavailable for testing, use the dummy data provided in the **/iot** folder. This allows you to invoke endpoints from AWS IoT Core and validate the functionality without needing physical devices.

Author **_Vertirose_**
