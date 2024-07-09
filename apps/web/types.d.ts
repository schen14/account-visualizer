type Account = {
  id: number,
  name: string,
  accountType: string,
  note: string,
  balance: number,
  createdAt: Date,
  updatedAt: Date
}

type AccRecord = {
  id: number,
  accountId: number,
  value: number,
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string,
}