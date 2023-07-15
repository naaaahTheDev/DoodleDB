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

To use the package, you need to import the package and access its functions. Here's an example of how to import the package and use its functions:

Import (ES6):
```javascript
import db from "doodledb";
```

Example:
```js
import database from 'doodledb';

// Example usage of functions

// Adding data to the database
const filePath = 'data.json';
const dataArrayName = 'items';
const newData = {
  name: 'John',
  age: 25
};
database.push(filePath, dataArrayName, newData);

// Retrieving data from the database
const searchQuery = {
  name: 'John'
};
database.get(filePath, dataArrayName, searchQuery, (foundData) => {
  console.log(foundData);
});

// Updating data in the database
const objectID = 1;
const editObject = {
  age: 30
};
database.edit(filePath, dataArrayName, objectID, editObject);

// Deleting a dataset from the database
database.delSet(filePath, dataArrayName, objectID);
```

## Functions
```js
push(filePath, dataArrayName, data)
```
This function adds new data to the specified JSON file. It takes the following parameters:



`filePath` (string): The path to the JSON file.


`dataArrayName` (string): The name of the array in which the data should be stored.


`data` (object): The data to be added to the JSON file.




```js
get(filePath, dataArrayName, searchQuery, callback)
```
This function retrieves data from the specified JSON file based on a search query. It takes the following parameters:



`filePath` (string): The path to the JSON file.


`dataArrayName` (string): The name of the array from which to retrieve the data.


`searchQuery` (object): The search query object containing the properties to match.


`callback` (function): The callback function that receives the found data.




```js
getArray(filePath, dataArrayName, callback)
```


This function retrieves the entire array of data from the specified JSON file. It takes the following parameters:



`filePath` (string): The path to the JSON file.



`dataArrayName` (string): The name of the array to retrieve from the JSON file.



`callback` (function): The callback function that receives the retrieved array.





```js
edit(filePath, dataArrayName, objectID, editObject)
```
This function edits an existing dataset in the specified JSON file. It takes the following parameters:



`filePath` (string): The path to the JSON file.



`dataArrayName` (string): The name of the array in which the dataset is located.



`objectID` (number): The ID of the dataset to be edited.



`editObject` (object): The object containing the properties and values to be edited.






```js
delSet(filePath, dataArrayName, objectID)
```


This function deletes an entire dataset from the specified JSON file based on its ID. It takes the following parameters:

`filePath` (string): The path to the JSON file.



`dataArrayName` (string): The name of the array from which to delete the dataset.



`objectID` (number): The ID of the dataset to be deleted.






```js
del(filePath, dataArrayName, objectID, deleteObject)
```


This function deletes specific properties from an existing dataset in the specified JSON file. It takes the following parameters:



`filePath` (string): The path to the JSON file.



`dataArrayName` (string): The name of the array in which the dataset is located.



`objectID` (number): The ID of the dataset from which to delete the properties.



`deleteObject` (object): The object containing the properties to be deleted from the dataset.


## Q&A
**What are IDs?**
- Each dataset within an array has an ID value. This value increases depending on its order in the array. If it is at position one, the ID will be 1.

## License
This project is under the MIT license. Read more about this license at **[LICENSE](https://opensource.org/license/mit/)**.