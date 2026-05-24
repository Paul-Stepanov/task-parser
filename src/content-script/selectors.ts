export const BITRIX24_SELECTORS = {
  taskScope: [
    "#tasks-iframe-popup-scope",
    ".task-detail-main",
    '[id*="task-detail"]',
    ".bx-task-detail-container",
    ".task-card-detail",
    ".main-ui-item-edit-container",
    ".task-detail",
    ".task-view",
    ".task-content",
  ],

  title: ".task-popup-pagetitle-item, h1, .task-title, [class*='title']",

  description: "#task-detail-description, .task-description, [class*='description']",
  comments: "#task-comments-block",
  history: "#task-log-block, #task-log-table",
  time: "#task-time-block",
  files: "#task-files-block, [class*='files']",
  planning:
    "#task-executor-block, #task-executor-table, [class*='executor'], [class*='plan']",

  sidebar: ".task-iframe-sidebar, .task-detail-sidebar",
  status: "[class*='status'], [id*='status']",
  deadline: "[class*='deadline'], [id*='deadline']",
  creator: "[class*='author'], [class*='creator']",

  unwanted:
    "script, style, button, input, select, .ui-btn, .btn, [class*='button'], .toolbar, .control-panel",
} as const