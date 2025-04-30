import { Injectable } from "@nestjs/common";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { GraphqlClient } from "./GraphqlClient";

@Injectable()
export class ClientService {
  renderClient(): string {
    // Create the React element
    const element = React.createElement(GraphqlClient);

    // Render the React component to string
    const appHtml = ReactDOMServer.renderToString(element);

    // Create a complete HTML document
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>GraphQL Client Example</title>
          <script defer src="client.js"></script>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .card {
              border: 1px solid #ddd;
              padding: 15px;
              margin-bottom: 10px;
              border-radius: 5px;
            }
            button {
              padding: 8px 16px;
              background-color: #4caf50;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              margin: 5px;
            }
            button.secondary {
              background-color: #2196f3;
            }
            input,
            textarea {
              width: 100%;
              padding: 8px;
              margin: 5px 0;
              box-sizing: border-box;
            }
            pre {
              background-color: #f5f5f5;
              padding: 10px;
              border-radius: 5px;
              overflow: auto;
            }
            .error {
              color: red;
              font-weight: bold;
            }
            .success {
              color: green;
              font-weight: bold;
            }
            .user-item {
              border: 1px solid #eee;
              padding: 10px;
              margin-bottom: 5px;
              border-radius: 4px;
              cursor: pointer;
            }
            .user-item:hover {
              background-color: #f9f9f9;
            }
            .user-item.selected {
              border-color: #4caf50;
              background-color: #e8f5e9;
            }
            .user-info {
              margin-top: 15px;
              padding: 10px;
              background-color: #e8f5e9;
              border-radius: 4px;
              border-left: 4px solid #4caf50;
            }
            .instruction {
              padding: 10px;
              background-color: #e3f2fd;
              border-radius: 4px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div id="root">${appHtml}</div>
        </body>
      </html>
    `;
  }
}
