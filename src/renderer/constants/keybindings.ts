export type KeybindingEntry = {
  eventKey: string;
  display?: readonly string[];
};

export type KeybindingsConfig = {
  shortcuts: {
    home: KeybindingEntry;
    myNotifications: KeybindingEntry;
    toggleReadUnread: KeybindingEntry;
    groupByProduct: KeybindingEntry;
    groupByTitle: KeybindingEntry;
    filters: KeybindingEntry;
    refresh: KeybindingEntry;
    settings: KeybindingEntry;
    accounts: KeybindingEntry;
    quit: KeybindingEntry;
  };
  notifications: {
    navigate: {
      eventKeys: readonly string[];
      display: readonly string[];
    };
    first: KeybindingEntry;
    last: KeybindingEntry;
    action: KeybindingEntry;
    toggleRead: KeybindingEntry;
  };
};

export const keybindings: KeybindingsConfig = {
  shortcuts: {
    home: { eventKey: 'h' },
    myNotifications: { eventKey: 'n' },
    toggleReadUnread: { eventKey: 'u' },
    groupByProduct: { eventKey: 'p' },
    groupByTitle: { eventKey: 't' },
    filters: { eventKey: 'f' },
    refresh: { eventKey: 'r' },
    settings: { eventKey: 's' },
    accounts: { eventKey: 'a' },
    quit: { eventKey: 'q' },
  },
  notifications: {
    navigate: { display: ['↑', '↓'], eventKeys: ['ArrowUp', 'ArrowDown'] },
    first: { display: ['Shift', '↑'], eventKey: 'ArrowUp' },
    last: { display: ['Shift', '↓'], eventKey: 'ArrowDown' },
    action: { eventKey: 'Enter' },
    toggleRead: { eventKey: 'a' },
  },
};
