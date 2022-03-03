import {RefObject} from 'react';

class Queue<T> {
  elements: T[] = [];

  // 向队列添加元素
  enQueue(ele: T): number {
    return this.elements.unshift(ele);
  }

  // 队列中去除元素
  deQueue(): T | undefined {
    return this.elements.pop();
  }

  length(): number {
    return this.elements.length;
  }

  isEmpty(): boolean {
    return this.length() === 0;
  }
}

/**
 * modal 必须提供的ref数据
 */
export interface ModalRef<T> {
  hide: () => void;
  show: (param: T | undefined) => void;
  isShowing: () => boolean;
}

export type ModalCurrentRef<T> = RefObject<ModalRef<T>>;

interface QueueItemCallback<T> {
  onShow?: (params: T | undefined) => void;
  onHide?: (params: T | undefined) => void;
}

interface IModalQueueItem<T> extends QueueItemCallback<T> {
  modal: ModalCurrentRef<T>;
  show: () => void;
  hide: () => void;
}

/**
 * 添加到队列中的item
 *
 * @example
 *
 * ```
 *  new ModalQueueItem(ref, any, QueueItemCallback)
 * ```
 */
class ModalQueueItem<T> implements IModalQueueItem<T> {
  hasOpen = false;
  showParam: T | undefined;
  modal: ModalCurrentRef<T>;
  onShow?: (params: T | undefined) => void;
  onHide?: (params: T | undefined) => void;
  constructor(
    modal: ModalCurrentRef<T>,
    param?: T,
    callback?: QueueItemCallback<T>,
  ) {
    this.showParam = param;
    this.modal = modal;
    this.onShow = callback?.onShow;
    this.onHide = callback?.onHide;
  }

  hide = () => {
    this.modal.current?.hide();
  };

  show() {
    this.modal.current?.show(this.showParam);
    this.checkClose();
    this.onShow && this.onShow(this.showParam);
  }

  isShowing() {
    return this.modal.current?.isShowing();
  }

  checkClose() {
    setTimeout(() => {
      if (!this.isShowing()) {
        this.onHide && this.onHide(this.showParam);
      } else {
        this.checkClose();
      }
    }, 300);
  }
}

/**
 * 将需要顺序弹出的弹窗 顺序的加入队列
 * 第一个加入的弹窗会立刻弹出
 * 下一个弹窗会在上一个弹窗关闭时自动弹出
 * @example
 *
 * ```
 *  const modalQueue = useRef(new ModalQueue());
 *  modalQueue.current.add(ref, params, callback);
 * ```
 *
 */

export class ModalQueue {
  hasModalOpen = false;

  queue = new Queue<ModalQueueItem<any>>();

  add<T>(
    modal: ModalCurrentRef<T>,
    param?: T,
    callback?: QueueItemCallback<T>,
  ) {
    const item = new ModalQueueItem<T>(modal, param, callback);
    const onHide = item.onHide;
    item.onHide = (params) => {
      onHide && onHide(params);
      this.onItemHide();
    };
    this.queue.enQueue(item);
    this.startOpen();
  }

  onItemHide = () => {
    if (this.queue.isEmpty()) {
      this.hasModalOpen = false;
    } else {
      this.showItemModal();
    }
  };

  startOpen() {
    if (this.queue.length() === 1 && !this.hasModalOpen) {
      this.hasModalOpen = true;
      this.showItemModal();
    }
  }

  showItemModal() {
    const item = this.queue.deQueue();
    item?.show();
  }

  reset() {
    this.hasModalOpen = false;
    this.queue = new Queue<ModalQueueItem<unknown>>();
  }
}

/**
 * 全局弹窗队列
 * @example
 * ```
 * globalModalQueue.add(dialogRef, params, callback)
 * ```
 */

export const globalModalQueue = new ModalQueue();
