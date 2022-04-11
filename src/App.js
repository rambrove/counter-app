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
    const contractAddress = '0x3b5aD3FbC7deeA1aebD7b184a609c1B25a038AEF';
    const contractABI = abi.abi;


    const checkIfWalletIsConnected = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          const account = accounts[0];
          setIsWalletConnected(true);
          setCustomerAddress(account);
          console.log("Account Connected: ", account);
        } else {
          setError("Please install a MetaMask wallet to use our counter.");
          console.log("No Metamask detected");
        }
      } catch (error) {
        console.log(error);
      }
    }

    const getCounter = async () =>  {
        try {
            if(window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                const ConuterContract = new ethers.Contract(contractAddress, contractABI, signer);
                let counterValue = await ConuterContract.get();
                console.log(counterValue);
               
                setCurrentCounterValue(counterValue.toString());
            } else {
                console.log("Ethereum object not found, install Metamask.");
                setError("Please install a MetaMsk wallet to use our Counter");
            }
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
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await bankContract.inc();
        console.log("Incrementing counter...");
        await txn.wait();
        console.log("Incremented Counter", txn.hash);
        getCounter();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
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
        const bankContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await bankContract.dec();
        console.log("Decrementing counter...");
        await txn.wait();
        console.log("Decremented Counter", txn.hash);
        getCounter();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }


    useEffect(() => {
      checkIfWalletIsConnected();
      getCounter();
  
    }, [isWalletConnected])



    return (
        <div className="App">
          <header className="App-header">
            
            <p>
              Counter Value:  {currentCounterValue}
            </p>
            
          </header>
     



            <div class="container">
              <div class="center">
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
