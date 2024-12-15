'use client';

// src/app/context/Web3Context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  connectWallet: async () => {},
  provider: null,
  signer: null,
});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connectWallet = async () => {
    if ((window as any).ethereum !== undefined) {
      try {
        // Solicitar conexión de cuenta
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        
        // Configurar provider y signer
        const web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const web3Signer = web3Provider.getSigner();
        const userAccount = await web3Signer.getAddress();
        
        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(userAccount);
      } catch (error) {
        console.error('Error al conectar con MetaMask:', error);
      }
    } else {
      alert('Por favor, instala MetaMask!');
    }
  };

  // Escuchar cambios de cuenta
  useEffect(() => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          // Usuario desconectó su wallet
          setAccount(null);
          setProvider(null);
          setSigner(null);
        } else {
          setAccount(accounts[0]);
        }
      });
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{ account, connectWallet, provider, signer }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);