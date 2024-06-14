import { Dispatch, FormEvent, SetStateAction, useCallback, useState } from "react";

type Props = {
  onClose: () => void,
  accounts: Account[],
  onAccountsChange: Dispatch<SetStateAction<Account[]>>,
}

export default function Modal({ onClose, accounts, onAccountsChange }: Props) {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors when a new request starts

    try {
      const formData = new FormData(event.currentTarget);
      const res = await fetch('/api/accounts', {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }
      
      const accountData = await res.json();
      handleAccountsChange(accountData);
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountsChange = useCallback((account: Account) => {
    onAccountsChange([...accounts, account])
  }, [onAccountsChange])

  const accountTypes = [
    "CHECKING",
    "SAVINGS"
  ]
  

  return (
    <>
      <dialog className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-25 z-50 overflow-auto backdrop-blur-sm flex justify-center items-center text-gray-500">
        <div className="bg-white m-auto p-8 rounded-xl">
          <div className="flex flex-col items-center">
            <h3 className="text-xl">Add New Account</h3>
            <br/>
            <form className="flex flex-col" onSubmit={onSubmit}>
              <label htmlFor="name" className="">Name:*</label>
              <input className="border-2 border-gray-500 rounded-md" type="text" name="name" required/>
              <label htmlFor="accountType" className="">Type:*</label>
              <select className="border-2 border-gray-500 rounded-md" name="accountType" required>
                {
                  accountTypes.map((type) => (
                    <option key={`${type}`} value={`${type}`}>{type}</option>
                  ))
                }
              </select>
              <label htmlFor="balance" className="">Current Balance:*</label>
              <input className="border-2 border-gray-500 rounded-md" type="number" name="balance" step=".01" required/>
              <label htmlFor="note" className="">Note:</label>
              <textarea className="border-2 border-gray-500 rounded-md" name="note"></textarea>
              <br/>
              <button type="submit" className="bg-green-500 text-white p-2 rounded-full" disabled={isLoading}>{isLoading ? "Loading..." : "Submit"}</button>
              <br/>
              <button type="button" className="bg-red-500 text-white p-2 rounded-full" disabled={isLoading} onClick={onClose}>{isLoading ? "Loading..." : "Close"}</button>
            </form>
            
          </div>
        </div>
      </dialog>
    </>
  )
}