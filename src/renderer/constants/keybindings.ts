export const keybindings = {
  shortcuts: {
    home: { display: ['h'], eventKey: 'h' },
    myNotifications: { display: ['n'], eventKey: 'n' },
    toggleReadUnread: { display: ['u'], eventKey: 'u' },
    groupByProduct: { display: ['p'], eventKey: 'p' },
    groupByTitle: { display: ['t'], eventKey: 't' },
    filters: { display: ['f'], eventKey: 'f' },
    refresh: { display: ['r'], eventKey: 'r' },
    settings: { display: ['s'], eventKey: 's' },
    accounts: { display: ['c'], eventKey: 'c' },
    quit: { display: ['q'], eventKey: 'q' },
  },
  notifications: {
    navigate: { display: ['↑', '↓'], eventKeys: ['ArrowUp', 'ArrowDown'] },
    first: { display: ['Shift', '↑'], eventKey: 'ArrowUp' },
    last: { display: ['Shift', '↓'], eventKey: 'ArrowDown' },
    action: { display: ['Enter'], eventKey: 'Enter' },
    toggleRead: { display: ['a'], eventKey: 'a' },
  },
} as const;
