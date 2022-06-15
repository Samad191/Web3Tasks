import logo from './logo.svg';
import './App.css';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { simpleStorageAbi, lotteryContractAbi, eventListenerContractAbi } from './Abi'
import Web3 from 'web3';
import { useEffect } from 'react';

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1,3,4,5,42]
})

const web3 = new Web3(Web3.givenProvider)

function getLibrary(provider){
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library
}


const Wallet = () => {

const eventListener = () => {
  const contractAddr = '0xBCB54052E11Ab15fd426842CfD42020c1af2ee4e';
  const myContract = new web3.eth.Contract(eventListenerContractAbi, contractAddr);
  console.log('My contract', myContract);
  myContract.getPastEvents('transferEvent')
    .then(res => console.log('a',res))
    .catch(err => console.log(err));

  myContract.events.allEvents(res => console.log('b',res));

  myContract.events.transferEvent({
    // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
    fromBlock: 0
}, function(error, event){ console.log(event); })
.on('data', function(event){
    console.log('c',event); // same results as the optional callback above
})
.on('changed', function(event){
  console.log('abc')
    // remove event from local database
})
.on('error', () => console.log('error'));

}

  const triggerEvent = async () => {
    const gas = '91212'
    const contractAddr = '0xBCB54052E11Ab15fd426842CfD42020c1af2ee4e';
    const myContract = new web3.eth.Contract(eventListenerContractAbi, contractAddr);
    
    const result = await myContract.methods.transfer('0xd82b09990f96EDBd6e7731C67e7ea4c9b01AF150').send({ from: account, gas, value: 2})
 
  }

  const readTxFromHash = async () => {
    const hash = "0x0ec03078eafc5e9388445eac8130aa5f4182bcaaf7a7274207dfc505ff393bae"
    const res = await web3.eth.getTransaction(hash);
    console.log('res ---->>>>', res)
    console.log('This the amount transfered', res.value)
  }

  const speedUpTx = async () => {
    const addressTo = '0xd82b09990f96EDBd6e7731C67e7ea4c9b01AF150';
    console.log('account', account)
    const nonce = await web3.eth.getTransactionCount(account, 'latest');

    console.log('Nonce', nonce);
    let rawTx = {
      from: account,
      to: addressTo,
      value: web3.utils.toWei('0.1', 'ether'),
      gas: '900000000',
      chainId: '4',
      nonce: nonce.toString()
    }

    web3.eth.sendTransaction(rawTx).on('transactionHash', (txHash) => {
      console.log('hash of new tx', txHash)
    })

  }
  
  const { chainId, account, activate } = useWeb3React()      

  const onClick = () => {
    activate(injectedConnector)
  }


  return (
    <div>
      {chainId}
      <br />
      {account}
      <br />

      <h2> EVENT LISTENER </h2>
      <button  onClick={onClick} > Activate MM </button>
      <br /> <br />
 

      <button onClick={eventListener} >Event Listener</button>
      <button onClick={triggerEvent} >Trigger event</button>
      <br />
      <br />
      <button onClick={readTxFromHash} >Tx Hash</button>
      <br /> <br />
      <button onClick={speedUpTx} >Speed up Tx</button>
    </div>
  )
}

function App() {
  return (
      <Web3ReactProvider getLibrary={getLibrary} >
         <Wallet />
      </Web3ReactProvider>
  );
}

export default App;
