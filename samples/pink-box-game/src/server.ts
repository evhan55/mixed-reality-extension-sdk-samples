/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { WebHost } from '@microsoft/mixed-reality-extension-sdk';
import dotenv from 'dotenv';
import { resolve as resolvePath } from 'path';
import App from './app';

process.on('uncaughtException', err => console.log('uncaughtException', err));
process.on('unhandledRejection', reason => console.log('unhandledRejection', reason));

// Read .env if file exists
dotenv.config();

// Start listening for connections, and serve static files
const server = new WebHost({
	baseUrl: 'https://pink-box-game.azurewebsites.net',
	baseDir: resolvePath(__dirname, '../public'),
	port: (process.env.PORT || 80)
});

// Handle new application sessions
server.adapter.onConnection(context => new App(context, server.baseUrl));