# Netlight
This project is a web application that uses TypeScript for type-checking and React for building interactive user interfaces. It is designed to seamlessly connect with an external API repository, utilizing the callAPI method to fetch data from various endpoints. The project offers a development workflow with a simple setup for both development and production environments.

## Configuration

In the src/config.ts file, you'll find the following variables:

- **API_ADDRESS**: By default, the project is configured to connect to the API hosted at "https://netlight-api-7d8cc46c53b9.herokuapp.com". If you want to connect to a local instance of the API, update the API_ADDRESS variable to "http://localhost:4000". Ensure that you have set up the local API with the necessary environment variables.
- **APP_ADDRESS**: This variable should hold the address where the project is running, it is used, for example, to redirect users back to the application after actions like payment via Stripe. By default, it is "https://netlight-6e85680640b6.herokuapp.com". If you want to run a local instance of the web application, update the APP_ADDRESS variable to "http://localhost:3000".
- **STRIPE_PUBLIC_KEY**: This variable holds the public Stripe key used for payment processing. If you set up a local instance of the API, you may need to change this key to match the one associated with your local Stripe account.

## Installation
1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using npm:

```bash
npm install
```

### Development

To run the project in development mode, execute the following command:

```bash
npm run dev
```
This command will start the development server and you can access the application in your browser at http://localhost:3000.

### Production
To build the project for production, execute the following commands:

```bash
npm run build
npm start
```

## Hosting

The project is currently hosted publicly at https://netlight-6e85680640b6.herokuapp.com.

## API Connection
This project is connected to the repository [Netlight API](https://netlight-api-7d8cc46c53b9.herokuapp.com) serving as the API. Whenever the application needs to fetch data from the API, it utilizes the callAPI method with the appropriate endpoint.

## Dependencies
- @headlessui/react: ^1.7.18
- @heroicons/react: ^2.1.1
- @stripe/react-stripe-js: ^2.6.2
- @stripe/stripe-js: ^3.1.0
- @testing-library/jest-dom: ^5.17.0
- @testing-library/react: ^13.4.0
- @testing-library/user-event: ^13.5.0
- @types/jest: ^27.5.2
- @types/node: ^16.18.72
- @types/react: ^18.2.48
- @types/react-dom: ^18.2.18
- @types/react-router-dom: ^5.3.3
- axios: ^1.6.8
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.21.3
- react-scripts: 5.0.1
- serve: ^14.2.1
- typescript: ^4.9.5
- web-vitals: ^2.1.4
