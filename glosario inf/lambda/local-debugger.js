/*
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

/* ## DEPRECATION NOTICE

This script has been deprecated and is no longer supported. 
Please use the [ASK Toolkit for VS Code]
(https://marketplace.visualstudio.com/items?itemName=ask-toolkit.alexa-skills-kit-toolkit), 
which provides a more end-to-end integration with Visual Studio Code. If you 
use another editor/IDE, please check out the [ASK SDK Local Debug package at npm]
(https://www.npmjs.com/package/ask-sdk-local-debug).

*/

const net = require('net');
const fs = require('fs');

const localDebugger = net.createServer();

const httpHeaderDelimeter = '\r\n';
const httpBodyDelimeter = '\r\n\r\n';
const defaultHandlerName = 'handler';
const host = 'localhost';
const defaultPort = 0;

/**
 * Resolves the skill invoker class dependency from the user provided
 * skill entry file.
 */

// eslint-disable-next-line import/no-dynamic-require
const skillInvoker = require(getAndValidateSkillInvokerFile());
const portNumber = getAndValidatePortNumber();
const lambdaHandlerName = getLambdaHandlerName();

/**
 * Starts listening on the port for incoming skill requests.
 */

localDebugger.listen(portNumber, host, () => {
    console.log(`Starting server on port: ${localDebugger.address().port}.`);
});

/**
 * For a new incoming skill request a new socket connection is established.
 * From the data received on the socket the request body is extracted, parsed into
 * JSON and passed to the skill invoker's lambda handler.
 * The response from the lambda handler is parsed as a HTTP 200 message format as specified
 * here - https://developer.amazon.com/docs/custom-skills/request-and-response-json-reference.html#http-header-1
 * The response is written onto the socket connection.
 */

localDebugger.on('connection', (socket) => {
    console.log(`Connection from: ${socket.remoteAddress}:${socket.remotePort}`);
    socket.on('data', (data) => {
        const body = JSON.parse(data.toString().split(httpBodyDelimeter).pop());
        console.log(`Request envelope: ${JSON.stringify(body)}`);
        skillInvoker[lambdaHandlerName](body, null, (_invokeErr, response) => {
            response = JSON.stringify(response);
            console.log(`Response envelope: ${response}`);
            socket.write(`HTTP/1.1 200 OK${httpHeaderDelimeter}Content-Type: application/json;charset=UTF-8${httpHeaderDelimeter}Content-Length: ${response.length}${httpBodyDelimeter}${response}`);
        });
    });
});

/**
 * Validates user specified port number is in legal range [0, 65535].
 * Defaults to 0.
 */

function getAndValidatePortNumber() {
    const portNumberArgument = Number(getArgument('portNumber', defaultPort));
    if (!Number.isInteger(portNumberArgument)) {
        throw new Error(`Port number has to be an integer - ${portNumberArgument}.`);
    }
    if (portNumberArgument < 0 || portNumberArgument > 65535) {
        throw new Error(`Port out of legal range: ${portNumberArgument}. The port number should be in the range [0, 65535]`);
    }
    if (portNumberArgument === 0) {
        console.log('The TCP server will listen on a port that is free.'
        + 'Check logs to find out what port number is being used');
    }
    return portNumberArgument;
}

/**
 * Gets the lambda handler name.
 * Defaults to "handler".
 */

function getLambdaHandlerName() {
    return getArgument('lambdaHandler', defaultHandlerName);
}

/**
 * Validates that the skill entry file exists on the path specified.
 * This is a required field.
 */

// eslint-disable-next-line consistent-return
function getAndValidateSkillInvokerFile() {
    const fileNameArgument = getArgument('skillEntryFile');
    if (!fs.existsSync(fileNameArgument)) {
        throw new Error(`File not found: ${fileNameArgument}`);
    }
    return fileNameArgument;
}
function diccionario(expr){
    
switch (expr) {
  case 'Acceso Directo':
    console.log('Icono especial que representa a una carpeta o un archivo y que abre o ejecuta ésta de una forma cómoda y rápida.');
    break;
  case 'API':
    console.log('(Aplication Program Interface - Interfaz de Aplicación del Programa) Conjunto de rutinas del sistema que se pueden usar en un programa para la gestión de entrada-salida de ficheros, etc.');
    break;
  case 'Aplicación':
    console.log('Programa que realiza una serie de funciones y con el cual trabajamos en el ordenador.');
    break;
  case 'Arbol':
    console.log('Estructura de directorios o carpetas de un ordenador, del directorio raíz van partiendo diferentes ramas (subdirectorios o subcarpetas), donde se ubican los archivos.');
    break;
  case 'Bus':
    console.log('Especie de carretera por donde circulan los datos dentro del ordenador comunicando a los diferentes componentes de la placa base, que dependiendo de su tamaño harán que un ordenador tenga mayores o menores prestaciones, así como una mayor o menor capacidad de transferencia del ordenador.');
    break;  
  case 'Byte':
    console.log('Medida básica de capacidad en informática. Comprende 8 bits o interruptores, cada uno de los cuales puede conmutar en dos posiciones ON y OFF.');
    break;
  case 'Microprocesador':
    console.log('Unidad de proceso y corazón del ordenador. Podríamos decir que es el jefe del ordenador, el cual procesa y distribuye el trabajo a los demás componentes del ordenador');
    break;
  case 'Pixel':
    console.log('Unidad de medida correspondiente al mínimo punto que se puede representar en pantalla.');
    break;
  case 'Pirata':
    console.log('El que copia software ilegalmente y lo comercializa sin ningún tipo de licencia.');
    break;
    
  default:
    console.log('Lo lamentamos, por el momento no disponemos de ' + expr + '.');
}
}
/**
 * Helper function to fetch the value for a given argument
 * @param {argumentName} argumentName name of the argument for which the value needs to be fetched
 * @param {defaultValue} defaultValue default value of the argument that is returned if the value doesn't exist
 */

function getArgument(argumentName, defaultValue) {
    const index = process.argv.indexOf(`--${argumentName}`);
    if (index === -1 || typeof process.argv[index + 1] === 'undefined') {
        if (defaultValue === undefined) {
            throw new Error(`Required argument - ${argumentName} not provided.`);
        } else {
            return defaultValue;
        }
    }
    return process.argv[index + 1];
}
