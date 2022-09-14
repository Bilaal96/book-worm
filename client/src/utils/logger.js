/**
 * Maintains the order of keys in object and logs it to the console.
 * @param { Object } obj - object to log.
 * @param { String } [logName] - An optional label to easily identify the log in the console.
 */
export const logObjectWithKeysInOrder = (obj, label = '') => {
  console.log(
    label,
    Object.entries(obj).map(([k, v]) => ({ [k]: v }))
  );
};
