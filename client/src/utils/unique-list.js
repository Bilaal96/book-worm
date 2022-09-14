/**
 * Removes duplicate elements from an array of values (with primitive types) 
 * @param { Array } arr - a list of primitive values to remove duplicates from
 * @returns { Array } a unique list of elements with primitive types
 
 #### Logic explained:
 1. `arr` is passed to Set constructor. A Set can only contain unique values, so the duplicate values are naturally removed from the iterable returned.
 2. The unique values of the iterable created are spread into a new array 
 3. The unique array is returned 
 */
export const getUniqueList = (arr) => [...new Set(arr)];

/**
 * Returns a list of unique objects by removing any duplicate objects found in the subjected array.
 * @param { Array } arr - a list of objects to remove duplicates from
 * @param { String } key - the property of an object in `arr` that determines uniqueness; e.g. if `key === 'id'`, the `id` property of every object in the returned array will be unique, therefore removing objects with duplicate ids
 * @returns { Array } a list of unique objects 
 
 #### Logic explained:
 1. Use arr.map() to produce iterable key-value pairs (i.e. entries).
 2. Pass entries as the argument to Map constructor.
 3. Map will create an object where the key of each property must be unique. This is leveraged to remove duplicates from the array.
 4. Call Map.values() to get iterable of all property values.
 5. Create an array of unique objects by spreading the iterable into an array literal.
 */
export const getUniqueListBy = (arr, key) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};
