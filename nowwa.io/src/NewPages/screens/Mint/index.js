import React, { useState, useEffect, useContext } from 'react'
import cn from "classnames";
import styles from "./Mint.module.sass";
import { shortenAddress } from '../../helper';
import { BigNumber } from "ethers"
import useMintNFT from '../../hooks/useMintNFT'
import { formatBalance, errorFilter } from '../../utils'
import { ChainId, contractAddress } from '../../constants'
import { useWeb3React } from '@web3-react/core'
import { useWalletModalToggle } from '../../hooks/store'
import { useIsTransactionPending } from '../../hooks/store/transactions'
import Loader from '../../components/Loader';
import { NotificationManager } from 'react-notifications'
import { NFTContext } from '../../contexts/NFTContext';
import { WalletContext } from '../../contexts/WalletContext';

const Mint = () => {
  //NFTContext
  const { contractInfo, mintTokens } = useContext(NFTContext)
  useEffect(() => {
    console.log(contractInfo)
  }, [contractInfo])

  //Wallet
  const { balance, loadingWallet } = useContext(WalletContext)



  const { account } = useWeb3React()
  const [count, setCount] = useState(1)
  const [pendingTx, setPendingTx] = useState(null)
  const [saleStatus, setSaleStatus] = useState('')

  const isPending = useIsTransactionPending(pendingTx ?? undefined)

  const enableMintBtn = pendingTx === null || !isPending

  const { totalSupply, maxSupply, presaleStatus, publicsaleStatus, presalePrice, publicsalePrice, mint } = useMintNFT()

  const toggleWalletModal = useWalletModalToggle()

  const getTotalMintPrice = () => {
    let totalPrice

    if (presaleStatus)
      totalPrice = BigNumber.from(presalePrice).mul(count)
    if (publicsaleStatus)
      totalPrice = BigNumber.from(publicsalePrice).mul(count)

    totalPrice = !totalPrice ? BigNumber.from(0) : totalPrice

    return totalPrice
  }

  const getFormattedTotalPrice = () => {
    return Number(formatBalance(getTotalMintPrice(), 18))
  }

  useEffect(() => {
    if (count >= maxSupply - totalSupply)
      setCount(maxSupply - totalSupply)
    if (count <= 1)
      setCount(1)

    if (account) {
      if (presaleStatus) {
        setSaleStatus('PreSale')
      } else if (publicsaleStatus) {
        setSaleStatus('PublicSale')
      } else {
        setSaleStatus('Now is not the time to mint')
      }
    }
  }, [count, presaleStatus, publicsaleStatus])

  const onClickMint = async () => {
    // if (!account) {
    //   console.log('no account')
    //   toggleWalletModal()
    //   return
    // }

    try {
      let mintedTokens = await mintTokens(1); //conquer->nft->mint
      console.log(mintedTokens)
      return;


      const val = await mint({
        mintAmount: count,
        value: getTotalMintPrice()
      })

      if (val.result) {
        if (val.status.hash)
          setPendingTx(val.status.hash)
      } else {
        const err = val.status
        NotificationManager.error(errorFilter(err), 'Something went wrong!')
      }

    } catch (e) {
      console.error('mint process error --------', e)
    }
  }
  return (
    <div className={styles.page}>
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.list}>
            <div className={styles.item}>
              <h1 className={cn("h2", styles.title)}>Mint Now</h1>
              <h5 className={cn("h5", styles.title)}>{saleStatus}</h5>
              <div className={styles.info}>
                <span>{totalSupply} / {maxSupply} minted!</span>
              </div>
              <div className={styles.search}>
                <button
                  className={cn("button-stroke", styles.button)}
                  onClick={() => setCount(prev => prev - 1)}
                  disabled={count <= 1}
                >-</button>
                <input
                  type="text"
                  readOnly
                  value={count}
                  placeholder={count}
                  onChange={(e) => setCount(e.target.value)}
                  className={styles.input}
                />
                <button
                  className={cn("button-stroke", styles.button)}
                  onClick={() => setCount(prev => prev + 1)}
                  disabled={count >= (maxSupply - totalSupply)}
                >+</button>
              </div>
              <div className={styles.info}>
                {getFormattedTotalPrice()}E + TX
              </div>
              <button
                className={cn("button-stroke", styles.button)}
                onClick={onClickMint}
                disabled={!enableMintBtn}
              >
                {(pendingTx && isPending) ? (
                  <>
                    <Loader size='25' />
                  </>
                ) : 'MINT'}
              </button>
              <div
                className={styles.note}
              >
                Wallet Balance: {balance} ETH
              </div>
              <div
                className={styles.note}
              >
                Mint Price: {contractInfo.mintPrice} ETH
              </div>
              <div
                className={styles.note}
              >
                <a
                  href={`https://goerli.etherscan.io/address/${contractAddress[ChainId['GOERLI']]}`}
                  target="_blank"
                >
                  {shortenAddress(contractInfo.address)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;
