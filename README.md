# DoodleDB
DoodleDB is a lightweight package that allows you to utilize JSON files as databases

## Table of Contents:
- [Installation](#installation)
- [Usage](#usage)
- [Functions](#functions)
- [Q&A](#qa)
- [Discord Server](#discord-server)
- [License](#license)

## Installation

To install DoodleDB, run the following command:

```bash
npm install doodledb
```

## Usage

1. Import the class into your Node.js application

```js
import { DoodleDB } from "doodledb";
```

2. Instantiate the class with the path to the JSON file
```js
const database = new DoodleDB({ filePath: "database.json" });
```

3. Use DoodleDB's many functions to manipulate the database!

## Functions
For detailed documentation of every method on the DoodleDB class, visit our [GitHub Docs Page](https://github.com/naaaahTheDev/DoodleDB/blob/main/docs/classes/DoodleDB.md)

## Examples
### `push`
Add new data to the JSON file
  ```js
  database.push({ filePath, collectionName, data })
    .then((successMessage) => {
      console.log(successMessage);
    })
    .catch((error) => {
      console.error(error);
    });
  ```

### `get`
Retrieve data from the JSON file based on search criteria.
  ```js
  database.get({ filePath, collectionName, searchQuery: data })
    .then((foundData) => {
      console.log(foundData);
    })
    .catch((error) => {
      console.error(error);
    });
  ```

### `getCollection` 
Retrieve an entire collection from the JSON file
  ```js
  database.getCollection({ filePath, collectionName })
    .then((dataCollection) => {
      console.log(dataCollection);
    })
    .catch((error) => {
      console.error(error);
    });
  ```

### `deleteCollection`
Delete an entire collection from the JSON file
  ```js
  database.deleteCollection({ filePath, collectionName, objectID })
    .then((successMessage) => {
      console.log(successMessage);
    })
    .catch((error) => {
      console.error(error);
    });
  ```

### `delete` 
Delete specific fields from a data entry in the JSON file
  ```js
  database.delete({ filePath, collectionName, objectID, deleteObject })
    .then((successMessage) => {
      console.log(successMessage);
    })
    .catch((error) => {
      console.error(error);
    });
  ```

### `createIndex` 
Create an index for faster searching.
  ```js
  database.createIndex({ filePath, collectionName, fieldName })
    .then((successMessage) => {
      console.log(successMessage);
    })
    .catch((error) => {
      console.error(error);
    });
  ```

## Q&A
<details> 
  <summary>What are IDs?</summary>
  Each object within a collection has an ID value. This value increases depending on its order in the array. If it is at position one, the ID will be 1.
</details>

## Discord Server
- Join the [Discord Server](https://discord.gg/XjQQRzUpmC) server for support - 

## License
This project is under the MIT license. Read more about this license at **[LICENSE](https://opensource.org/license/mit/)**