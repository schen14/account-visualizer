export function isAccount(obj: object): obj is Account {
  return (
    typeof obj === 'object' &&
    'id' in obj &&
    'name' in obj &&
    'accountType' in obj &&
    'note' in obj &&
    'balance' in obj &&
    'createdAt' in obj &&
    'updatedAt' in obj
  );
}

export function isAccountArray(arr: object[]): arr is Account[] {
  return arr.every(isAccount);
}

export function isAccountTypes(arr: string[]): arr is string[] {
  return arr.every((s: string) => typeof s  === 'string');
}