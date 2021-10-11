import '../assets/token.css'
import { useEffect, useState } from 'react'
import algoSDK from 'algosdk'


const TokenScreen = () => {
    const [senderAddr, setSenderAddr] = useState('')
    const [senderSK, setSenderSK] = useState('')
    const [tokenName, setTokenName] = useState('')
    const [tokenUnitName, setTokenUnitName] = useState('')
    const [tokenUrl, setTokenUrl] = useState('')
    const [transactionID, setTransactionID] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    // client params
    const port = ''
    const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
    const token = {
        'X-API-Key': '77fe7ugIPx1tJ1cl1CcIT3hUxBTAy1Th2t2l6EFi'
    }
    const algoClient = new algoSDK.Algodv2(token, baseServer, port)


    useEffect(() => {
        const senderMnemonic = 'come image neglect eternal poem body wave panel resist region garage whisper master chair embrace blade amused rhythm liberty flag split aim gun abandon donkey'
        const acc = algoSDK.mnemonicToSecretKey(senderMnemonic)
        setSenderAddr(acc.addr)
        setSenderSK(acc.sk)
    }, [])


    const createToken = async (e) => {
        e.preventDefault()

        try {
            if (!tokenName) return setError('token name is required')
            if (tokenName.trim().length > 8) return setError('token name must be less than 8 chars.')
            if (!tokenUnitName) return setError('token unit name is required')
            if (!tokenUrl) return setError('token url(link) is required')

            setError(null)
            setLoading(true)

            const params = await algoClient.getTransactionParams().do()
            const assetMetadataHash = '01234567890123456789012345678901'
            const addr = senderAddr
            const note = undefined
            const totalIssuance = 1000000
            const decimals = 0
            const defaultFrozen = false
            const manager = senderAddr
            const reserve = senderAddr
            const freeze = senderAddr
            const clawback = senderAddr
            const unitName = tokenUnitName
            const assetName = tokenName
            const assetURL = 'https://www.' + tokenUrl
            
            const txn = algoSDK.makeAssetCreateTxnWithSuggestedParams(
                addr,
                note,
                totalIssuance,
                decimals,
                defaultFrozen,
                manager,
                reserve,
                freeze,
                clawback,
                unitName,
                assetName,
                assetURL,
                assetMetadataHash,
                params
            )

            const signedTxn = txn.signTxn(senderSK)
            const tx = await algoClient.sendRawTransaction(signedTxn).do()

            console.log('Transaction : ', tx)

            if (tx) {
                setTransactionID(tx.txId)
                setLoading(false)
                setMessage('token created successfully')
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className='container mt-3'>
            <div className="row">
                <div className="col-md-6 mx-auto main">
                    <p className="badge bg-success">create token</p>

                    {error && <div className='alert alert-danger'>{error}</div>}
                    {loading && <div className='alert alert-warning'>processing...</div>}
                    {message && <div className='alert alert-success'>{message}</div>}

                    <form className='mt-2' onSubmit={createToken}>
                        <label className="badge bg-secondary">admin address(creator)</label>
                        <input
                            type="text"
                            className="form-control"
                            value={senderAddr}
                            disabled
                        />
                        <label className="badge bg-secondary mt-4">token name</label>
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={tokenName}
                            onChange={(e) => setTokenName(e.target.value)}
                        />
                        <label className="badge bg-secondary mt-4">token unit name</label>
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={tokenUnitName}
                            onChange={(e) => setTokenUnitName(e.target.value)}
                        />
                        <label className="badge bg-secondary mt-4">token url</label>
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={tokenUrl}
                            onChange={(e) => setTokenUrl(e.target.value)}
                        />
                        <button className='btn btn-dark col-5 btn-sm mt-2 mb-2 text-white'>create token</button> <br />
                        {transactionID && <div className='alert alert-success' style={{fontSize: '10px'}}>{transactionID}</div>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default TokenScreen
