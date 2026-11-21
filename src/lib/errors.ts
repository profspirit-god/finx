export type ErrorCode =
  | 'URL1'  // unknown wallet id
  | 'URL2'  // unknown record id
  | 'URL3'  // invalid route pattern
  | 'DATA1' // wallet failed to load
  | 'DATA2' // record failed to load
  | 'DATA3' // corrupted local database
  | 'AUTH1' // session expired
  | 'AUTH2' // PIN incorrect
  | 'SYS1'  // unexpected application error
  | 'SYS2'  // network unavailable (offline action)
  | 'SYS3'; // storage quota exceeded

export type ErrorInfo = {
  code: ErrorCode;
  title: string;
  description: string;
  hint?: string;
  helpAnchor: string;
};

export const ERRORS: Record<ErrorCode, ErrorInfo> = {
  URL1: {
    code: 'URL1',
    title: 'Wallet not found',
    description: 'The wallet you tried to open does not exist, or it was deleted.',
    hint: 'Check the URL, or go back to the wallets list.',
    helpAnchor: 'url-errors',
  },
  URL2: {
    code: 'URL2',
    title: 'Record not found',
    description: 'The record you tried to open does not exist, or it was deleted.',
    hint: 'Check the URL, or go back to the records list.',
    helpAnchor: 'url-errors',
  },
  URL3: {
    code: 'URL3',
    title: 'Page not found',
    description: 'This route does not exist in FinX.',
    hint: 'Use the sidebar to navigate to a valid page.',
    helpAnchor: 'url-errors',
  },
  DATA1: {
    code: 'DATA1',
    title: "Couldn't load wallet",
    description: 'The wallet data could not be read from this device.',
    hint: 'Try again. If it keeps failing, export your data from Data Tools and reimport.',
    helpAnchor: 'data-errors',
  },
  DATA2: {
    code: 'DATA2',
    title: "Couldn't load record",
    description: 'The record data could not be read from this device.',
    hint: 'Try again. If it keeps failing, check Data Tools for a full export.',
    helpAnchor: 'data-errors',
  },
  DATA3: {
    code: 'DATA3',
    title: 'Local storage corrupted',
    description: 'FinX could not read its local database.',
    hint: 'Open Settings → Data to reset or reimport a backup.',
    helpAnchor: 'data-errors',
  },
  AUTH1: {
    code: 'AUTH1',
    title: 'Session expired',
    description: 'Your session ended. Please unlock FinX again.',
    hint: 'Enter your PIN to continue.',
    helpAnchor: 'auth-errors',
  },
  AUTH2: {
    code: 'AUTH2',
    title: 'Incorrect PIN',
    description: 'The PIN you entered does not match.',
    hint: 'Try again carefully. After several failures, use your password.',
    helpAnchor: 'auth-errors',
  },
  SYS1: {
    code: 'SYS1',
    title: 'Unexpected error',
    description: 'Something unexpected happened inside FinX.',
    hint: 'Reload the page. If the problem persists, open Help → Troubleshooting.',
    helpAnchor: 'system-errors',
  },
  SYS2: {
    code: 'SYS2',
    title: 'Offline',
    description: 'This action requires a connection.',
    hint: 'Reconnect and try again.',
    helpAnchor: 'system-errors',
  },
  SYS3: {
    code: 'SYS3',
    title: 'Storage full',
    description: 'FinX could not save because local storage is full.',
    hint: 'Export and clear old data from Settings → Data.',
    helpAnchor: 'system-errors',
  },
};