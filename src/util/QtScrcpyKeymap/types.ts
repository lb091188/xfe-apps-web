export enum ClickType {
  /** 单击 */
  KMT_CLICK,
  /** 双击 */
  KMT_CLICK_TWICE,
  /** 连击 */
  KMT_CLICK_MULTI,
  /** 拖拽 */
  KMT_DRAG,
  /** 方向 */
  KMT_STEER_WHEEL,
}

/** 注释 */
export type Comment = string;

/** 坐标对象 */
export interface Pos {
  /** 横坐标，相对值，最大为1 */
  x: number;
  /** 纵坐标，相对值，最大为1 */
  y: number;
}

export interface KMT_CLICK {
  comment: Comment;
  type: "KMT_CLICK";
  key: string;
  pos: Pos;
  switchMap: boolean;
}
export interface KMT_CLICK_TWICE {
  comment: Comment;
  type: "KMT_CLICK_TWICE";
  key: string;
  pos: Pos;
}
export interface KMT_CLICK_MULTI {
  comment: Comment;
  type: "KMT_CLICK_MULTI";
  key: string;
  pos: Pos;
  delay: number;
}
export interface KMT_DRAG {
  comment: Comment;
  type: "KMT_DRAG";
  key: string;
  startPos: Pos;
  endPos: Pos;
}

export interface KMT_STEER_WHEEL {
  comment: Comment;
  type: "KMT_STEER_WHEEL";
  centerPos: Pos;
  leftOffset: number;
  rightOffset: number;
  upOffset: number;
  downOffset: number;
  leftKey: string;
  rightKey: string;
  upKey: string;
  downKey: string;
}

export type KeyMapNode = KMT_CLICK | KMT_CLICK_TWICE | KMT_CLICK_MULTI | KMT_DRAG | KMT_STEER_WHEEL;

/** 鼠标移动映射配置 */
export interface MouseMoveMap {
  /** 起点坐标 */
  startPos?: Pos;
  speedRatio?: number;
  speedRatioX?: number;
  speedRatioY?: number;
  smallEyes?: KMT_CLICK;
}

/** keymap 对象 */
export interface KeyMap {
  /** 映射开关 */
  switchKey: string;
  /** 鼠标移动映射 */
  mouseMoveMap: MouseMoveMap;
  /** 按键映射 */
  keyMapNodes: KeyMapNode[];
}
