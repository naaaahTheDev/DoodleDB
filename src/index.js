import chalk from "chalk";
import fs from "fs";


export default {
    push(filePath, dataArrayName, data) {
        // Read existing data from the file (if any)
        fs.readFile(filePath, 'utf8', (err, fileData) => {
            if (err) {
                try {
                    fs.writeFile(filePath, 'utf8', () => {
                        console.log(chalk.green('Database file not found. Successfully created.'))
                    })
                } catch (err) {
                    console.error(chalk.red('Error reading JSON file ' + err));
                    return;
                }
            }
    
            let dataObject = {};
    
            try {
                // Parse the existing JSON data into an object (if it exists)
                if (fileData) {
                    dataObject = JSON.parse(fileData);
                }
            } catch (parseError) {
                console.error(chalk.red('Error parsing JSON file:', parseError));
                return;
            }
    
            // Initialize the dataArray if it doesn't exist
            if (!dataObject[dataArrayName]) {
                dataObject[dataArrayName] = [];
            }
    
            const dataArray = dataObject[dataArrayName];
    
            data.id = dataArray.length + 1
    
            // Add the new data object to the dataArray
            dataArray.push(data);
    
            // Convert the updated object back to a JSON string
            const updatedJsonData = JSON.stringify(dataObject, null, 2);
    
            // Write the updated JSON data back to the file
            fs.writeFile(filePath, updatedJsonData, (writeError) => {
                if (writeError) {
                    console.error(chalk.red('Error writing JSON file:', writeError));
                    return;
                }
                console.log(chalk.green('New data has been added to the JSON file successfully!'));
            });
        });
    },
    
    get(filePath, dataArrayName, searchQuery, callback) {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error(chalk.red(err));
                return;
            }
            let dataObject = {};
    
            try {
                dataObject = JSON.parse(jsonData);
            } catch (err) {
                console.error(chalk.red('Error while parsing data ' + err));
            }
    
            const dataArray = dataObject[dataArrayName];
            if (!dataArray) {
                console.log(chalk.yellow('No data found in the specified dataArray.'));
                return;
            }
    
            const foundData = dataArray.filter((data) => {
                for (const key in searchQuery) {
                    const queryValue = searchQuery[key].toString().toLowerCase();
                    const dataValue = data[key].toString().toLowerCase();
                    if (dataValue.includes(queryValue)) {
                        return true;
                    }
                }
                return false;
            });
            callback(foundData);
        });
    },
    
    getArray(filePath, dataArrayName, callback) {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error(chalk.red(err));
            }
    
            let dataObject = {};
    
            try {
                dataObject = JSON.parse(jsonData);
            } catch (err) {
                console.error(chalk.red('Error while parsing data ' + err));
            }
    
            const dataArray = dataObject[dataArrayName];
            if (!dataArray) {
                console.log(chalk.red('Data array not found'));
                return;
            } else {
                callback(dataArray);
            }
        })
    },
    
    edit(filePath, dataArrayName, objectID, editObject) {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error(chalk.red('Error reading JSON file: ', err));
                return;
            }
    
            try {
                //Parse the JSON data into a JS object
                const dataObject = JSON.parse(jsonData);
    
                const dataArray = dataObject[dataArrayName];
    
                //Find the dataset with the specified ID
                const dataToEdit = dataArray.find((data) => data.id === objectID);
    
                if (dataToEdit) {
                    //Update the properties of the dataset with the editObject values
                    for (const key in editObject) {
                        dataToEdit[key] = editObject[key];
                    }
                } else {
                    console.log(chalk.red(`Dataset with ID ${objectID} not found.`));
                    return;
                }
    
                //Convert the updated JavaScript object back to a JSON string
                const updatedJsonData = JSON.stringify(dataObject, null, 2);
    
                fs.writeFile(filePath, updatedJsonData, (writeError) => {
                    if (writeError) {
                        console.error(chalk.red('Error while writing JSON file ' + writeError));
                        return;
                    }
                    console.log(chalk.green('JSON file has been updated successfully!'));
                });
            } catch (err) {
                console.error(chalk.red('Error while finding data ' + err));
            }
        })
    },
    
    delSet(filePath, dataArrayName, objectID) {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error(chalk.red('Error while reading JSON file ' + err));
                return;
            }
    
            try {
                //Parse the JSON to a JS object
                const dataObject = JSON.parse(jsonData);
                const dataArray = dataObject[dataArrayName];
    
                //Find dataset with specified ID
                const setToDel = dataArray.find((data) => data.id === objectID);
    
                if (setToDel) {
                    //Retrieve all properties of the dataset dynamically
                    const propertiesToDelete = Object.keys(setToDel);
    
                    //Delete the properties from the dataset
                    for (const property of propertiesToDelete) {
                        delete setToDel[property];
                    }
                } else {
                    console.log(`Dataset with ID ${objectID} not found.`);
                    return;
                }
    
                //Filter out empty objects from the dataArray
                const filteredArray = dataArray.filter((data) => Object.keys(data).length > 0);
    
                //Update the dataArray with the filteredArray
                dataObject[dataArrayName] = filteredArray;
    
                //Convert the updated JS object back to JSON string
                const updatedJsonData = JSON.stringify(dataObject, null, 2);
    
                fs.writeFile(filePath, updatedJsonData, (writeError) => {
                    if (writeError) {
                        console.error(chalk.red('Error writing JSON file: ', writeError));
                        return;
                    }
                    console.log(chalk.green('JSON file has been updated successfully!'));
                })
            } catch (err) {
                console.error(chalk.red('Error while finding data ' + err));
                return;
            }
        });
    },
    
    del(filePath, dataArrayName, objectID, deleteObject) {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                console.error(chalk.red('Error while reading JSON file ' + err));
                return;
            }
    
            try {
                //Parse the JSON to a JS object
                const dataObject = JSON.parse(jsonData);
                const dataArray = dataObject[dataArrayName];
    
                const dataToDel = dataArray.find((data) => data.id === objectID);
    
                if (dataToDel) {
                    for (const key in deleteObject) {
                        delete dataToDel[key];
                    }
                } else {
                    console.log(`Dataset with ID ${objectID} not found.`)
                    return;
                }
    
                const updatedJsonData = JSON.stringify(dataObject, null, 2)
    
                fs.writeFile(filePath, updatedJsonData, (writeError) => {
                    if (writeError) {
                        console.error(chalk.red('Error while writing JSON file ' + err));
                        return;
                    }
                    console.log(chalk.green('JSON file has been updated successfully!'));
                });
            } catch (err) {
                console.error(chalk.red('Error while finding data ' + err));
            }
        })
    }
}