import { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import abi from "./contracts/Counter.json";
import logo from './logo.svg';
import './App.css';

function App () {
    const [currentCounterValue, setCurrentCounterValue] = useState(null);
    const [error, setError] = useState(null);
    const [customerAddress, setCustomerAddress] = useState(null);

    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [walletStatus, setWalletStatus] = useState(null);
    const contractAddress = '0x3b5aD3FbC7deeA1aebD7b184a609c1B25a038AEF';
    const contractABI = abi.abi;


    const checkIfWalletIsConnected = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          const account = accounts[0];
          setIsWalletConnected(true);
          setWalletStatus('Connected');
          setCustomerAddress(account);
          console.log("Account Connected: ", account);
        } else {
          setError("Please install a MetaMask wallet to use our counter.");
          console.log("No Metamask detected");
          setWalletStatus('Disconnected, Please connect Metamask | Network : Rinkeby');
        }
      } catch (error) {
        console.log(error);
      }
    } 

    const getCounter = async () =>  {
        try {
          //Using infura to use get method : this helps to fire the view function without wallet intallation
          const provider = new ethers.providers.InfuraProvider('rinkeby','38b7330bc7ae40ebbd73d8d7d68a673a','Ae1f4765de0743759752808d4fddf0ba');
          //  const provider = new ethers.providers.Web3Provider(window.ethereum);
          const ConuterContract = new ethers.Contract(contractAddress, contractABI, provider);
          let counterValue = await ConuterContract.get();
          console.log(counterValue);
          
          setCurrentCounterValue(counterValue.toString());
        } catch (error) {
            console.log(error)
        }

    }

  const setIncrement = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const ConuterContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await ConuterContract.inc();
        console.log("Incrementing counter...");
        await txn.wait();
        console.log("Incremented Counter", txn.hash);
        getCounter();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our counter.");
        setWalletStatus('Disconnected, Please connect Metamask | Network : Rinkeby');
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setDecrement = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const CounterContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await CounterContract.dec();
        console.log("Decrementing counter...");
        await txn.wait();
        console.log("Decremented Counter", txn.hash);
        getCounter();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our counter.");
        setWalletStatus('Disconnected, Please connect Metamask | Network : Rinkeby');
      }
    } catch (error) {
      console.log(error)
    }
  }


    useEffect(() => {
      setWalletStatus('Disconnected, Please connect Metamask | Network : Rinkeby');
      getCounter();
      checkIfWalletIsConnected();
      
  
    }, [isWalletConnected])



    return (
        <div className="App">
          <header className="App-header">
            
            <p>
              Counter Value:  {currentCounterValue}
            </p>
            <p>
              Wallet Status:  {walletStatus}
            </p>
            
          </header>
     



            <div className="container">
              <div className="center">
             <button className="App-button" onClick={setIncrement}> 
                Increment
              </button>
               <button className="App-button" onClick={setDecrement}> 
                Decrement
               </button>
              </div>
            </div>


            </div>
        
      );
}


export default App;
