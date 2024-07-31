import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import getAccount from "../../../lib/getAccount";
import getRecords from "../../../lib/getRecords";
import getFormattedAmount from "../../../lib/getFormateedAmount";
import DeleteAccountButton from "../../_components/delete-account-button";

type Props = {
  params: {
    accountId: string
  }
}

export default async function Account({ params: { accountId } }: Props) {
  //const session = await getServerAuthSession();
  const accountData: Promise<Account> = getAccount(accountId);
  const recordsData: Promise<AccRecord[]> = getRecords(accountId);
  const account: Account = await accountData;
  const records: AccRecord[] = await recordsData;


  return (
    <section className="flex flex-col h-screen py-40 w-screen px-96">
      <div className="flex flex-wrap">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {account.name}
        </h1>
        <p className="text-5xl tracking-tight sm:text-[5rem]">Back</p>
      </div>
      <div className="flex justify-center space-x-4 my-5 text-gray-500 items-stretch flex-grow">
        <div className="w-1/3 bg-white m-auto p-8 rounded-xl h-full">
          <div className="flex flex-col h-full">
            <h2 className="text-2xl">Details</h2>
            <hr className="h-1 bg-gray-300"></hr>
            <br/>
            <span><b>Account Type:</b> {account.accountType}</span>
            <span><b>Current Balance:</b> {getFormattedAmount(account.balance)}</span>
            {account.note && <span><b>Note:</b> {account.note}</span>}
            <span><b>Created:</b> {new Date(account.createdAt).toLocaleString()}</span>
            <span><b>Updated:</b> {new Date(account.updatedAt).toLocaleString()}</span>
            <span><b>Link:</b> <a href="https://www.chase.com" target="_blank" rel="noreferrer noopener" className="text-blue-400 dark:text-blue-300 hover:underline">Chase</a></span>
            <DeleteAccountButton accountId={accountId}></DeleteAccountButton>
          </div>
        </div>
        <div className="w-2/3 bg-white m-auto p-8 rounded-xl h-full">
          <div className="flex flex-col">
            <h2 className="text-2xl">History</h2>
            <hr className="h-1 bg-gray-300"></hr>
            <br/>
            <table className="table-auto">
              <thead className="bg-gray-300">
                <tr className="">
                  <th className="p-2 border-b text-left">Value</th>
                  <th className="p-2 border-b text-left">Created By</th>
                  <th className="p-2 border-b text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  records.map((record) => (
                    <tr key={record.id} className="border-t-2 border-gray-300">
                      <td className="p-2 text-left">{getFormattedAmount(record.value)}</td>
                      <td className="p-2 text-left">{record.createdBy || 'Default'}</td>
                      <td className="p-2 text-left">{new Date(record.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
