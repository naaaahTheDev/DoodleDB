[doodledb](../README.md) / DoodleDB

# Class: DoodleDB

## Table of contents

### Constructors

- [constructor](DoodleDB.md#constructor)

### Properties

- [path](DoodleDB.md#path)

### Methods

- [createIndex](DoodleDB.md#createindex)
- [delete](DoodleDB.md#delete)
- [deleteObject](DoodleDB.md#deleteobject)
- [edit](DoodleDB.md#edit)
- [get](DoodleDB.md#get)
- [getCollection](DoodleDB.md#getcollection)
- [push](DoodleDB.md#push)

## Constructors

### constructor

• **new DoodleDB**(`options`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.filePath` | `string` | The path to the database. A file will be created here if it doesn't exist. |

## Properties

### path

• **path**: `string`

## Methods

### createIndex

▸ **createIndex**(`options`): `Promise`<`string`\>

Creates an index for faster searching

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionName` | `string` | - |
| `options.fieldName` | `string` | The property on each object in the collection to index. |

#### Returns

`Promise`<`string`\>

Error / success message

___

### delete

▸ **delete**(`options`): `Promise`<`string`\>

Deletes specific properties from an existing dataset in the JSON file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionName` | `string` | - |
| `options.targetID` | `number` | The ID of the object the property is on. |
| `options.targetKeys` | `string`[] | A list of keys that will be deleted from the object. |

#### Returns

`Promise`<`string`\>

Error / success message

___

### deleteObject

▸ **deleteObject**(`options`): `Promise`<`string`\>

Delete an object from a collection in the JSON file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionName` | `string` | - |
| `options.targetID` | `number` | The ID of the object to delete. |

#### Returns

`Promise`<`string`\>

Error / success message

___

### edit

▸ **edit**(`options`): `Promise`<`string`\>

Edit an object from an existing collection in the JSON file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | - |
| `options.collectionName` | `string` | - |
| `options.editObject` | `Object` | Data to add to the object with ID `objectID` |
| `options.objectID` | `number` | The ID of the object to edit inside the collection. |

#### Returns

`Promise`<`string`\>

Error / success message

___

### get

▸ **get**(`options`): `Promise`<`string` \| `any`[]\>

Retrieves data from the JSON database based on a search query.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.collectionName` | `string` |
| `options.searchQuery` | [`SearchQuery`](../interfaces/SearchQuery.md) |

#### Returns

`Promise`<`string` \| `any`[]\>

An array of objects matching the search query.

___

### getCollection

▸ **getCollection**(`options`): `Promise`<`any`[]\>

Retrieve an entire collection from the JSON file

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.collectionName` | `string` |

#### Returns

`Promise`<`any`[]\>

___

### push

▸ **push**(`options`): `Promise`<`string`\>

Pushes data to a collection in the JSON file.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.collectionName` | `string` |
| `options.data` | `Object` |
| `options.data.id?` | `number` |

#### Returns

`Promise`<`string`\>

Error / success message
