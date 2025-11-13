/**
 * Offline Sync Queue Utility
 * 
 * Manages offline operations by queuing them locally and syncing when connection is restored.
 * Used primarily for daily check-ins and other critical user actions.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_QUEUE_KEY = '@plover_app:sync_queue';

export interface QueuedOperation {
  id: string;
  type: string;
  payload: unknown;
  timestamp: number;
  retries: number;
}

export interface SyncQueue {
  operations: QueuedOperation[];
}

const MAX_RETRIES = 3;
const MAX_QUEUE_SIZE = 100;

/**
 * Adds an operation to the sync queue
 */
export async function queueOperation(
  type: string,
  payload: unknown
): Promise<QueuedOperation> {
  const operation: QueuedOperation = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    payload,
    timestamp: Date.now(),
    retries: 0,
  };

  const queue = await getQueue();
  
  // Prevent queue from growing too large
  if (queue.operations.length >= MAX_QUEUE_SIZE) {
    // Remove oldest operations
    queue.operations = queue.operations.slice(-MAX_QUEUE_SIZE + 1);
  }

  queue.operations.push(operation);
  await saveQueue(queue);

  return operation;
}

/**
 * Gets all queued operations
 */
export async function getQueuedOperations(): Promise<QueuedOperation[]> {
  const queue = await getQueue();
  return queue.operations;
}

/**
 * Removes an operation from the queue (after successful sync)
 */
export async function removeOperation(operationId: string): Promise<void> {
  const queue = await getQueue();
  queue.operations = queue.operations.filter((op) => op.id !== operationId);
  await saveQueue(queue);
}

/**
 * Increments retry count for an operation
 */
export async function incrementRetry(operationId: string): Promise<boolean> {
  const queue = await getQueue();
  const operation = queue.operations.find((op) => op.id === operationId);

  if (!operation) {
    return false;
  }

  operation.retries += 1;

  // Remove if max retries exceeded
  if (operation.retries >= MAX_RETRIES) {
    queue.operations = queue.operations.filter((op) => op.id !== operationId);
  }

  await saveQueue(queue);
  return operation.retries < MAX_RETRIES;
}

/**
 * Clears all operations from the queue
 */
export async function clearQueue(): Promise<void> {
  await saveQueue({ operations: [] });
}

/**
 * Gets the sync queue from storage
 */
async function getQueue(): Promise<SyncQueue> {
  try {
    const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    if (data) {
      return JSON.parse(data) as SyncQueue;
    }
  } catch (error) {
    console.error('Error reading sync queue:', error);
  }
  return { operations: [] };
}

/**
 * Saves the sync queue to storage
 */
async function saveQueue(queue: SyncQueue): Promise<void> {
  try {
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error saving sync queue:', error);
  }
}

/**
 * Checks if device is online
 */
export function isOnline(): boolean {
  // In React Native, you would typically use NetInfo
  // For now, this is a placeholder that assumes online
  // In production, use: import NetInfo from '@react-native-community/netinfo';
  return true;
}

/**
 * Processes the sync queue (to be called when connection is restored)
 */
export async function processSyncQueue(
  syncHandler: (operation: QueuedOperation) => Promise<boolean>
): Promise<void> {
  if (!isOnline()) {
    return;
  }

  const operations = await getQueuedOperations();
  const results = await Promise.allSettled(
    operations.map(async (operation) => {
      try {
        const success = await syncHandler(operation);
        if (success) {
          await removeOperation(operation.id);
        } else {
          await incrementRetry(operation.id);
        }
      } catch (error) {
        console.error(`Error syncing operation ${operation.id}:`, error);
        await incrementRetry(operation.id);
      }
    })
  );

  // Log results
  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.length - successful;
  
  if (__DEV__) {
    console.log(`Sync complete: ${successful} successful, ${failed} failed`);
  }
}

