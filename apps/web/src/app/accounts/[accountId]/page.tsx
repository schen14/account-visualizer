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
        {/* <p className="text-5xl tracking-tight sm:text-[5rem]"></p> */}
        <svg fill="#ffffff" height="75px" width="75px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 219.151 219.151" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M109.576,219.151c60.419,0,109.573-49.156,109.573-109.576C219.149,49.156,169.995,0,109.576,0S0.002,49.156,0.002,109.575 C0.002,169.995,49.157,219.151,109.576,219.151z M109.576,15c52.148,0,94.573,42.426,94.574,94.575 c0,52.149-42.425,94.575-94.574,94.576c-52.148-0.001-94.573-42.427-94.573-94.577C15.003,57.427,57.428,15,109.576,15z"></path> <path d="M94.861,156.507c2.929,2.928,7.678,2.927,10.606,0c2.93-2.93,2.93-7.678-0.001-10.608l-28.82-28.819l83.457-0.008 c4.142-0.001,7.499-3.358,7.499-7.502c-0.001-4.142-3.358-7.498-7.5-7.498l-83.46,0.008l28.827-28.825 c2.929-2.929,2.929-7.679,0-10.607c-1.465-1.464-3.384-2.197-5.304-2.197c-1.919,0-3.838,0.733-5.303,2.196l-41.629,41.628 c-1.407,1.406-2.197,3.313-2.197,5.303c0.001,1.99,0.791,3.896,2.198,5.305L94.861,156.507z"></path> </g> </g></svg>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {account.name}
        </h1>
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
