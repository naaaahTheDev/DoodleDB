import chalk from "chalk";
import fs from "fs";
export default {
    push(filePath, dataCollectionName, data) {
        fs.readFile(filePath, 'utf8', (err, fileData) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    //File does not exist, create the file
                    const initialData = {
                        [dataCollectionName]: []
                    };
                    const initialJsonData = JSON.stringify(initialData, null, 2);
                    fs.writeFile(filePath, initialJsonData, (writeError) => {
                        if (writeError) {
                            console.error(chalk.red('Error creating JSON file:', writeError));
                            return;
                        }
                        console.log(chalk.green('Database file created successfully.'));
                        //Call the push function recursively now that the file is created
                        this.push(filePath, dataCollectionName, data);
                    });
                }
                else {
                    console.error(chalk.red('Error reading JSON file', err));
                }
            }
            else {
                let dataObject = {};
                try {
                    if (fileData) {
                        dataObject = JSON.parse(fileData);
                    }
                }
                catch (parseError) {
                    console.error(chalk.red('Error parsing JSON file:', parseError));
                    return;
                }
                if (!dataObject[dataCollectionName]) {
                    dataObject[dataCollectionName] = [];
                }
                const dataCollection = dataObject[dataCollectionName];
                const id = data.id || dataCollection.length + 1;
                dataCollection.push({ id, ...data });
                const updatedJsonData = JSON.stringify(dataObject, null, 2);
                fs.writeFile(filePath, updatedJsonData, (writeError) => {
                    if (writeError) {
                        console.error(chalk.red('Error writing JSON file:', writeError));
                        return;
                    }
                    console.log(chalk.green('New data has been added to the JSON file successfully!'));
                });
            }
        });
    },
    get(filePath, dataCollectionName, searchQuery, callback) {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error(chalk.red(err));
                return;
            }
            let dataObject = {};
            try {
                dataObject = JSON.parse(jsonData);
            }
            catch (err) {
                console.error(chalk.red('Error while parsing data ' + err));
            }
            const dataCollection = dataObject[dataCollectionName];
            if (!dataCollection) {
                console.log(chalk.yellow('No data found in the specified dataCollection.'));
                return;
            }
            const foundData = dataCollection.filter((data) => {
                for (const key in searchQuery) {
                    const indexObject = dataObject[`${dataCollectionName}_${key}_index`];
                    const fieldValue = data[key];
                    if (indexObject && indexObject[key]) {
                        const indexedArray = indexObject[key]; //Array of indexes
                        const matchingIndexes = indexedArray.filter((index) => fieldValue === index);
                        if (matchingIndexes.length > 0) {
                            return true;
                        }
                    }
                    else {
                        const queryValue = searchQuery[key].toString().toLowerCase();
                        const dataValue = data[key].toString().toLowerCase();
                        if (Number(dataValue) === searchQuery[key]) {
                            return true;
                        }
                        else if (dataValue && dataValue.includes(queryValue)) {
                            return true;
                        }
                    }
                }
                return false;
            });
            callback(foundData);
        });
    },
    getCollection(filePath, dataCollectionName, callback) {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error(chalk.red(err));
            }
            let dataObject = {};
            try {
                dataObject = JSON.parse(jsonData);
            }
            catch (err) {
                console.error(chalk.red('Error while parsing data ' + err));
            }
            const dataCollection = dataObject[dataCollectionName];
            if (!dataCollection) {
                console.log(chalk.red('Collection not found'));
                return;
            }
            else {
                callback(dataCollection);
            }
        });
    },
    edit(filePath, dataCollectionName, objectID, editObject) {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error(chalk.red('Error reading JSON file: ', err));
                return;
            }
            try {
                const dataObject = JSON.parse(jsonData);
                const dataCollection = dataObject[dataCollectionName];
                if (!dataCollection) {
                    console.log(chalk.red('no data found in the specified dataCollection.'));
                    return;
                }
                const dataToEdit = dataCollection.find((data) => data.id === objectID);
                if (!dataToEdit) {
                    console.log(chalk.red('No dataset found with the provided object ID.'));
                    return;
                }
                let isIndexed = false;
                for (const key in editObject) {
                    if (editObject.hasOwnProperty(key)) {
                        const fieldValue = editObject[key];
                        //Update the data field
                        dataToEdit[key] = fieldValue;
                        //Check if index object exists
                        const indexObject = dataObject[`${dataCollectionName}_${fieldValue}_index`];
                        if (indexObject && indexObject[fieldValue]) {
                            const indexedArray = indexObject[fieldValue];
                            const matchingIndexes = indexedArray.filter((index) => index === fieldValue);
                            if (matchingIndexes.length > 0) {
                                indexedArray.push(objectID);
                            }
                            isIndexed = true;
                        }
                    }
                }
                if (!isIndexed) {
                    //Fall back to regular search through the entire JSON file
                    for (const key in editObject) {
                        dataToEdit[key] = editObject[key];
                    }
                }
                const updatedJsonData = JSON.stringify(dataObject, null, 2);
                fs.writeFile(filePath, updatedJsonData, (writeError) => {
                    if (writeError) {
                        console.error(chalk.red('Error while writing JSON file ' + writeError));
                        return;
                    }
                    console.log(chalk.green('JSON file has been updated successfully!'));
                });
            }
            catch (err) {
                console.error(chalk.red('Error while finding data ' + err));
            }
        });
    },
    delCollection(filePath, dataCollectionName, objectID) {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error(chalk.red('Error while reading JSON file ' + err));
                return;
            }
            try {
                const dataObject = JSON.parse(jsonData);
                const dataCollection = dataObject[dataCollectionName];
                const setToDel = dataCollection.find((data) => data.id === objectID);
                if (setToDel) {
                    const propertiesToDelete = Object.keys(setToDel);
                    for (const property of propertiesToDelete) {
                        delete setToDel[property];
                    }
                }
                else {
                    console.log(`Dataset with ID ${objectID} not found.`);
                    return;
                }
                const filteredArray = dataCollection.filter((data) => Object.keys(data).length > 0);
                dataObject[dataCollectionName] = filteredArray;
                const updatedJsonData = JSON.stringify(dataObject, null, 2);
                fs.writeFile(filePath, updatedJsonData, (writeError) => {
                    if (writeError) {
                        console.error(chalk.red('Error writing JSON file: ', writeError));
                        return;
                    }
                    console.log(chalk.green('JSON file has been updated successfully!'));
                });
            }
            catch (err) {
                console.error(chalk.red('Error while finding data ' + err));
                return;
            }
        });
    },
    del(filePath, dataCollectionName, objectID, deleteObject) {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error(chalk.red('Error while reading JSON file ' + err));
                return;
            }
            try {
                const dataObject = JSON.parse(jsonData);
                const dataCollection = dataObject[dataCollectionName];
                const dataToDel = dataCollection.find((data) => data.id === objectID);
                if (dataToDel) {
                    for (const key in deleteObject) {
                        delete dataToDel[key];
                    }
                }
                else {
                    console.log(`Dataset with ID ${objectID} not found.`);
                    return;
                }
                const updatedJsonData = JSON.stringify(dataObject, null, 2);
                fs.writeFile(filePath, updatedJsonData, (writeError) => {
                    if (writeError) {
                        console.error(chalk.red('Error while writing JSON file ' + err));
                        return;
                    }
                    console.log(chalk.green('JSON file has been updated successfully!'));
                });
            }
            catch (err) {
                console.error(chalk.red('Error while finding data ' + err));
            }
        });
    },
    //Indexing
    createIndex(filePath, dataCollectionName, fieldName) {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error(chalk.red('Error reading JSON data ' + err));
                return;
            }
            try {
                const dataObject = JSON.parse(jsonData);
                const dataCollection = dataObject[dataCollectionName];
                if (!dataObject[`${dataCollectionName}_${fieldName}_index`]) {
                    dataObject[`${dataCollectionName}_${fieldName}_index`] = {};
                }
                const indexObject = dataObject[`${dataCollectionName}_${fieldName}_index`];
                dataCollection.forEach((data) => {
                    const fieldValue = data[fieldName];
                    if (fieldValue !== undefined) {
                        //Check if fieldValue is already a part of the indexed object.
                        if (!indexObject[fieldValue]) {
                            indexObject[fieldValue] = [];
                        }
                        if (indexObject[fieldValue].includes(data.id)) {
                            return;
                        }
                        indexObject[fieldValue].push(data.id);
                    }
                });
                const updatedJsonData = JSON.stringify(dataObject, null, 2);
                fs.writeFile(filePath, updatedJsonData, (writeError) => {
                    if (writeError) {
                        console.error(chalk.red('Error while updating JSON file ' + err));
                        return;
                    }
                    console.log(chalk.green(`Successfully indexed "${fieldName}", under collection: ${dataCollectionName}`));
                });
            }
            catch (err) {
                console.error(chalk.red('Error getting JSON data ' + err));
            }
        });
    }
};
//# sourceMappingURL=index.js.map