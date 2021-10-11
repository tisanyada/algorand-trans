import 'assets/home.css'
import { useEffect, useState } from 'react'
import algoSDK from 'algosdk'
import { Link } from 'react-router-dom'




const HomeScreen = () => {
    const senderMnemonic = 'come image neglect eternal poem body wave panel resist region garage whisper master chair embrace blade amused rhythm liberty flag split aim gun abandon donkey'
    const [senderAddr, setSenderAddr] = useState('')
    const [senderSK, setSenderSK] = useState('')
    const [receiverAddr, setReceiverAddr] = useState('')
    const [mnemonicKey, setMnemonicKey] = useState('')
    const [recoveredAddr, setRecoveredAddr] = useState('')
    const [tokenAmount, setTokenAmount] = useState('')
    const [firstReceiverAddr, setFirstReceiverAddr] = useState('')
    const [secondReceiverAddr, setSecondReceiverAddr] = useState('')
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(null)
    const [accountInfoAddr, setAccountInfoAddr] = useState('')
    const [accountBalance, setAccountBalance] = useState('')
    const [displaySingle, setDisplaySingle] = useState(true)

    // client connection params - to get yours visit https://developer.purestake.io
    const port = ''
    const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
    const token = {
        'X-API-Key': '77fe7ugIPx1tJ1cl1CcIT3hUxBTAy1Th2t2l6EFi'
    }
    // initialising the algorand client connection
    const algodClient = new algoSDK.Algodv2(token, baseServer, port)


    useEffect(() => {
        const senderAccount = algoSDK.mnemonicToSecretKey(senderMnemonic)
        setSenderAddr(senderAccount.addr)
        setSenderSK(senderAccount.sk)
    }, [])
    


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

    const generateReceiverAccount = () => {
        const account = algoSDK.generateAccount()
        setReceiverAddr(account.addr)
    }
    const generateFirstReceiverAccount = () => {
        const account = algoSDK.generateAccount()
        setFirstReceiverAddr(account.addr)
    }
    const generateSecondReceiverAccount = () => {
        const account = algoSDK.generateAccount()
        setSecondReceiverAddr(account.addr)
    }
  
    const submitSingleTransaction = async () => {
        try {
            const accountInfo = await algodClient.accountInformation(senderAddr).do()
            if (accountInfo.amount < 1000000) return setMessage('you have insufficient funds to perform this transaction')
            if (!tokenAmount) return setMessage('token amount is required')
            if (!receiverAddr) return setMessage('receiver address is required')

            setLoading(true)
            setMessage(null)

            const params = await algodClient.getTransactionParams().do();
            console.log(params)

            const signedTxn = algoSDK.signTransaction({
                from: senderAddr,
                to: receiverAddr,
                fee: 100,
                amount: tokenAmount * 1000000,
                firstRound: params.firstRound,
                lastRound: params.lastRound,
                genesisID: params.genesisID,
                genesisHash: params.genesisHash,
                // params,
                note: new Uint8Array(0),
            }, senderSK);
            const sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();

            if (sendTx.txId) {
                setLoading(null)
                setMessage('success')
            }

            setTimeout(() => {
                setMessage(null)
            }, 3000)
        } catch (e) {
            console.log(e);
        }
    }
    const submitAtomicTransaction = async () => {
        try {
            const accountInfo = await algodClient.accountInformation(senderAddr).do()
            if (accountInfo.amount < 1000000) return setMessage('you have insufficient funds to perform this transaction')
            if (!tokenAmount) return setMessage('token amount is required')
            if (!firstReceiverAddr || !secondReceiverAddr) return setMessage('receivers address is required')

            setLoading(true)
            setMessage(null)

            const suggestedParams = await algodClient.getTransactionParams().do();

            const txn1 = algoSDK.makePaymentTxnWithSuggestedParamsFromObject({
                from: senderAddr,
                to: firstReceiverAddr,
                fee: 100,
                amount: tokenAmount * 1000000,
                suggestedParams,
                note: new Uint8Array('success', 'utf-8'),
            })
            const txn2 = algoSDK.makePaymentTxnWithSuggestedParamsFromObject({
                from: senderAddr,
                to: secondReceiverAddr,
                fee: 100,
                amount: tokenAmount * 1000000,
                suggestedParams,
                note: new Uint8Array('success', 'utf-8'),
            })

            await algoSDK.assignGroupID([txn1, txn2])

            const stnx1 = txn1.signTxn(senderSK)
            const stnx2 = txn2.signTxn(senderSK)

            const sendTx = await algodClient.sendRawTransaction([stnx1, stnx2]).do();

            if (sendTx.txId) {
                setLoading(null)
                setMessage('success')
            }

            setTimeout(() => {
                setMessage(null)
            }, 3000)
        } catch (e) {
            console.log(e);
        }
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
                <div className="col-md-5 right">
                    <hr />
                    <p className="badge bg-dark">transactions</p> <br />
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <span className={`badge badge-sm trans-btn ${displaySingle ? 'bg-light text-dark' : 'bg-success text-white'}`} onClick={() => setDisplaySingle(!displaySingle)}>
                            {displaySingle ? 'single transaction' : 'atomic transaction'}
                        </span>
                    </div>
                    {displaySingle ? (
                        <div className='mt-4'>
                            <label className="badge bg-secondary">sender address</label>
                            <input type="text" className="form-control form-control-sm" value={senderAddr} disabled />

                            <label className="badge bg-secondary mt-3">token amount</label>
                            <input type="number" className="form-control form-control-sm" value={tokenAmount} onChange={(e) => setTokenAmount(e.target.value)} />

                            <label className="badge bg-secondary mt-3">receiver address</label>
                            <input type="text" className="form-control form-control-sm" value={receiverAddr} onChange={(e) => setReceiverAddr(e.target.value)} placeholder='receiver address' />
                            <small className='badge bg-warning gen-receiver-btn' onClick={generateReceiverAccount}>generate address</small>
                            <br />
                            <button className='btn btn-sm btn-primary col-5 mt-2 mb-4' onClick={submitSingleTransaction}>send</button> <br />
                            <small>fund sender address at: <Link to={{ pathname: 'https://bank.testnet.algorand.network/' }} target={'_blank'}>Testnet Bank</Link></small>
                        </div>
                    ) : (
                        <div className='mt-4'>
                            <label className="badge bg-secondary">sender address</label>
                            <input type="text" className="form-control form-control-sm" value={senderAddr} disabled />

                            <label className="badge bg-secondary mt-3">token amount</label>
                            <input type="number" className="form-control form-control-sm" value={tokenAmount} onChange={(e) => setTokenAmount(e.target.value)} />

                            <label className="badge bg-secondary mt-3">first receiver address</label>
                            <input type="text" className="form-control form-control-sm" value={firstReceiverAddr} onChange={(e) => setFirstReceiverAddr(e.target.value)} placeholder='first receiver address' />
                            <small className='badge bg-warning gen-receiver-btn' onClick={generateFirstReceiverAccount}>generate address</small>
                            <br />
                            <label className="badge bg-secondary mt-3">second receiver address</label>
                            <input type="text" className="form-control form-control-sm" value={secondReceiverAddr} onChange={(e) => setSecondReceiverAddr(e.target.value)} placeholder='first receiver address' />
                            <small className='badge bg-warning gen-receiver-btn' onClick={generateSecondReceiverAccount}>generate address</small>
                            <br />
                            <button className='btn btn-sm btn-primary col-5 mt-2 mb-4' onClick={submitAtomicTransaction}>send</button> <br />
                            <small>fund sender address at: <Link to={{ pathname: 'https://bank.testnet.algorand.network/' }} target={'_blank'}>Testnet Bank</Link></small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomeScreen
