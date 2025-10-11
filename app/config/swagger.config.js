import swaggerJsDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your Project Name",
      version: "1.0.0",
      description: "Your project description",
    },
    servers: [
      {
        url: "http://localhost:3000", // Replace with your API URL
      },
    ],
  },
  apis: ["./app/controller/*.js"], // Replace with the path to your controllers
};

const specs = swaggerJsDoc(options);

export default specs;