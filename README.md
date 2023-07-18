# DoodleDB
DoodleDB is a lightweight package that allows you to utilize JSON files as databases

## Table of Contents:
- [Installation](#installation)
- [Usage](#usage)
- [Functions](#functions)
- [Q&A](#qa)
- [License](#license)

## Installation

To install DoodleDB, run the following command:

```bash
npm install doodledb
```

## Usage

Use doodleDBs many functions and features.

1. Import the module into your Node.js application

```js
import database from "doodledb";
```


2. Usage of functions
  - **Push**: Add new data to the JSON file
  ```js
  database.push({ filePath, collectionName, data })
    .then((successMessage) => {
      console.log(successMessage);
    })
    .catch((error) => {
      console.error(error);
    });
  ```

  - **Get**: Retrieve data from the JSON file based on search criteria.
  ```js
  database.get({ filePath, collectionName, searchQuery: data })
  .then((foundData) => {
    console.log(foundData);
  })
  .catch((error) => {
    console.error(error);
  });
  ```

  - **Get Collection**: Retrieve the entire collection from the JSON file
  ```js
  database.getCollection({ filePath, collectionName })
  .then((dataCollection) => {
    console.log(dataCollection);
  })
  .catch((error) => {
    console.error(error);
  });
  ```

  - **Delete Collection**: Delete an entire collection from the JSON file.
  ```js
  database.delCollection({ filePath, collectionName, objectID })
  .then((successMessage) => {
    console.log(successMessage);
  })
  .catch((error) => {
    console.error(error);
  });
  ```

  - **Delete**" Delete specific fields from a data entry in the JSON file
  ```js
  database.del({ filePath, collectionName, objectID, deleteObject })
  .then((successMessage) => {
    console.log(successMessage);
  })
  .catch((error) => {
    console.error(error);
  });
  ```

  - **Create Index**: Create an index for faster searching.
  ```js
  database.createIndex({ filePath, collectionName, fieldName })
  .then((successMessage) => {
    console.log(successMessage);
  })
  .catch((error) => {
    console.error(error);
  });
  ```


## Functions
```js
push(options: { filePath: string, collectionName: string, data: { id?: number, [key: string]: any } }): Promise<string>
```
This function adds new data to the specified JSON file. It takes the following parameters:



`filePath` (string): The path to the JSON file.


`collectionName` (string): The name of the collection in which the data should be stored.


`data` (object): The data to be added to the JSON file.

Returns a promise that resolves to a success message on successful data addition.




```js
get(options: { filePath: string, collectionName: string, searchQuery: { [key: string]: string | number } }): Promise<any[]>
```
This function retrieves data from the specified JSON file based on a search query. It takes the following parameters:



`filePath` (string): The path to the JSON file.


`collectionName` (string): The name of the collection from which to retrieve the data.


`searchQuery` (object): The search query object containing the properties to match.


Returns a promise that resolves to an array of matching data objects.




```js
getCollection(options: { filePath: string, collectionName: string }): Promise<any[]>
```


This function retrieves the entire collection of data from the specified JSON file. It takes the following parameters:



`filePath` (string): The path to the JSON file.



`collectionName` (string): The name of the collection to retrieve from the JSON file.


Returns a promise that resolves to an array of all data objects in the collection.







```js
edit(options: { filePath: string, collectionName: string, objectID: number, editObject: { [key: string]: string | number } }): Promise<string>
```
This function edits an existing dataset in the specified JSON file. It takes the following parameters:



`filePath` (string): The path to the JSON file.



`collectionName` (string): The name of the collection in which the dataset is located.



`objectID` (number): The ID of the dataset to be edited.



`editObject` (object): The object containing the properties and values to be edited.


Returns a promise that resolves to a success message on successful data editing.



```js
delCollection(options: { filePath: string, collectionName: string, objectID: number }): Promise<string>
```


This function deletes an entire collection from the specified JSON file based on its ID. It takes the following parameters:

`filePath` (string): The path to the JSON file.



`collectionName` (string): The name of the collection from which to delete the dataset.



`objectID` (number): The ID of the dataset to be deleted.


Returns a promise that resolves to a success message on successful collection deletion.



```js
del(options: { filePath: string, collectionName: string, objectID: number, deleteObject: object }): Promise<string>
```


This function deletes specific properties from an existing dataset in the specified JSON file. It takes the following parameters:



`filePath` (string): The path to the JSON file.



`collectionName` (string): The name of the collection in which the dataset is located.



`objectID` (number): The ID of the dataset from which to delete the properties.



`deleteObject` (object): The object containing the properties to be deleted from the dataset.


Returns a promise that resolves to a success message on successful field deletion.



```js
createIndex(options: { filePath: string, collectionName: string, fieldName: string }): Promise<string>
```

Creates an index for faster searching.

`filePath` (string): Path to the JSON file.



`collectionName` (string): The collection containing the property you want to index.



`fieldName`: (string): The property you would like to index.


Returns a promise that resolves to a success message on successful index creation.


## Q&A
**What are IDs?**
- Each object within a collection has an ID value. This value increases depending on its order in the array. If it is at position one, the ID will be 1.

## Discord Server
- Join the [Discord Server](https://discord.gg/XjQQRzUpmC) server for support - 

## License
This project is under the MIT license. Read more about this license at **[LICENSE](https://opensource.org/license/mit/)**.