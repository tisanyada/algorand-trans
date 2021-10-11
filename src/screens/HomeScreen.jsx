import 'assets/home.css'
import { useState } from 'react'
import algoSDK from 'algosdk'




const HomeScreen = () => {
    // const senderMnemonic = 'come image neglect eternal poem body wave panel resist region garage whisper master chair embrace blade amused rhythm liberty flag split aim gun abandon donkey'

    const [mnemonicKey, setMnemonicKey] = useState('')
    const [recoveredAddr, setRecoveredAddr] = useState('')
   

    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(null)
    const [accountInfoAddr, setAccountInfoAddr] = useState('')
    const [accountBalance, setAccountBalance] = useState('')

    // client connection params - to get yours visit https://developer.purestake.io
    const port = ''
    const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
    const token = {
        'X-API-Key': '77fe7ugIPx1tJ1cl1CcIT3hUxBTAy1Th2t2l6EFi'
    }
    // initialising the algorand client connection
    const algodClient = new algoSDK.Algodv2(token, baseServer, port)


 


    const getAccountInfo = async () => {
        if (!accountInfoAddr) return setMessage('address is required')
        setLoading(true)
        setMessage(null)
        const accountInfo = await algodClient.accountInformation(accountInfoAddr).do()
        const balance = accountInfo.amount / 1000000
        setAccountBalance(balance)
        setLoading(null)
    }

    const recoverAccount = () => {
        if (!mnemonicKey) return setMessage('mnemonic key is required')
        setLoading(true)
        setMessage(null)
        const recoveredAccount = algoSDK.mnemonicToSecretKey(mnemonicKey)
        setRecoveredAddr(recoveredAccount.addr)
        setLoading(null)
    }


    return (
        <div className="container mt-5">
            <div className="row mx-auto">
                {loading && <div className='alert alert-warning'>processing...</div>}
                {message && <div className='alert alert-danger'>{message}</div>}
                <div className="col-md-7 left">
                    <hr />
                    <p className="badge bg-secondary">get account balance</p>
                    <input
                        type="text"
                        className='form-control'
                        placeholder='please insert an algorand account address'
                        value={accountInfoAddr}
                        onChange={(e) => setAccountInfoAddr(e.target.value)}
                    />
                    <button className='btn btn-info col-5 btn-sm mt-2 mb-2 text-white' onClick={getAccountInfo}>get account information</button> <br />

                    <div className='badge alert-light' style={{ color: 'grey' }}>the algo balance for this account is: {accountBalance}</div>

                    <hr />
                    <p className="badge bg-secondary">recover account address</p>
                    <input
                        type="text"
                        className='form-control'
                        placeholder='please insert your mnemonic key here'
                        value={mnemonicKey}
                        onChange={(e) => setMnemonicKey(e.target.value)}
                    />
                    <button className='btn btn-info col-5 btn-sm mt-2 mb-2 text-white' onClick={recoverAccount}>recover account</button> <br />
                    <div className='badge alert-light' style={{ width: '40px' }}>{recoveredAddr}</div>

                    <hr />
                </div>
               
            </div>
        </div>
    )
}

export default HomeScreen
