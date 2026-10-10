// MMKV Storage Utils for maintaining any operation and functions related to it.

import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

/**
 * function SaveDataToAsyncStorage: it will store any value that is provided,
 * with the mentioned key into MMKV Storage.
 *
 * @param {string} key : key defines the key used for storing data.
 * @param {string} value : value to be stored.
 */
export const SaveDataToAsyncStorage = (key: string, value: string) => {
  try {
    storage.set(key, value);
  } catch (error) {
    console.error('Error saving data to MMKV:', error);
  }
};

/**
 * function DeleteDataFromAsyncStorage: it will delete the value associated
 * with the provided key from MMKV Storage.
 */
export const DeleteDataFromAsyncStorage = (key: string) => {
  try {
    storage.remove(key);
  } catch (error) {
    console.error('Error deleting data from MMKV:', error);
  }
};

/**
 * function ReadDataFromAsyncStorage: it will retrieve the value associated
 * with the provided key from MMKV Storage.
 *
 * @returns {string | undefined}
 */
export const ReadDataFromAsyncStorage = (key: string) => {
  try {
    return storage.getString(key);
  } catch (error) {
    console.error('Error reading data from MMKV:', error);
    return undefined;
  }
};

/**
 * function ClearDataFromAsyncStorage: it will clear all data from MMKV Storage.
 */
export const ClearDataFromAsyncStorage = () => {
  try {
    storage.clearAll();
  } catch (error) {
    console.error('Error clearing MMKV storage:', error);
  }
};