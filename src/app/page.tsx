'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useWeb3 } from './context/Web3Context';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { MINESWEEPER_ADDRESS } from './contracts/addresses';
import { MINESWEEPER_ABI } from './contracts/MinesweeperABI';

export default function Home() {
  const { account, connectWallet, provider } = useWeb3();
  const [rows, setRows] = useState<number>(8);
  const [cols, setCols] = useState<number>(8);
  const [mines, setMines] = useState<number>(10);
  const [grid, setGrid] = useState<number[][]>([]);
  const [revealedCells, setRevealedCells] = useState<{[key: string]: number}>({});
  const [gameMessages, setGameMessages] = useState<string[]>([]);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [boardState, setBoardState] = useState<any>(null);

  useEffect(() => {
    if (provider) {
      console.log("Provider connected, initializing contract...");
      const newContract = new ethers.Contract(
        MINESWEEPER_ADDRESS,
        MINESWEEPER_ABI,
        provider.getSigner()
      );
      console.log("Contract initialized:", newContract.address);
      setContract(newContract);

      // Suscribirse a eventos
      newContract.on("CellRevealed", (row, col, value) => {
        console.log("CellRevealed event:", row, col, value);
        setRevealedCells(prev => ({
          ...prev,
          [`${row}-${col}`]: value
        }));
      });

      newContract.on("GameMessage", (player, message) => {
        console.log("GameMessage event:", player, message);
        setGameMessages(prev => [...prev, message]);
      });

      return () => {
        newContract.removeAllListeners();
      };
    }
  }, [provider]);

  // Función para obtener el estado del tablero
  const getBoardState = async () => {
    if (!contract) {
      console.log("No contract instance available");
      return;
    }
    try {
      console.log("Calling playerBoard...");
      const board = await contract.playerBoard();
      console.log("Raw board state:", board);
      setBoardState({
        rows: board.rows.toString(),
        cols: board.cols.toString(),
        isGameActive: board.isGameActive,
        mines: board.mines.toString(),
        revealedCount: board.revealedCount.toString()
      });
    } catch (error) {
      console.error("Error getting board state:", error);
    }
  };

  // Función para obtener el estado de una celda específica
  const checkCellState = async (row: number, col: number) => {
    if (!contract) return;
    try {
      const [isRevealed, value] = await contract.getCellState(row, col);
      console.log(`Cell [${row},${col}] - Revealed: ${isRevealed}, Value: ${value}`);
      if (isRevealed) {
        setRevealedCells(prev => ({
          ...prev,
          [`${row}-${col}`]: value
        }));
      }
    } catch (error) {
      console.error("Error checking cell state:", error);
    }
  };

  useEffect(() => {
    if (contract) {
      getBoardState();
    }
  }, [contract]);

  const initializeGame = async () => {
    try {
      if (!account || !contract) {
        console.log("No account or contract:", { account, contract });
        alert('Please connect your wallet first');
        return;
      }

      console.log("Initializing game with:", { rows, cols, mines });
      const tx = await contract.initializeGame(rows, cols, mines);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed");

      const newGrid = Array(rows).fill(null).map(() => Array(cols).fill(0));
      setGrid(newGrid);
      setRevealedCells({});
      setGameMessages([]);
      
      // Actualizamos el estado del tablero después de inicializar
      await getBoardState();
      
      alert('Game initialized successfully!');
    } catch (error) {
      console.error('Error initializing game:', error);
      alert('Error initializing game. Check console for details.');
    }
  };

  const revealCell = async (row: number, col: number) => {
    try {
      if (!contract) return;
      
      // Primero revelamos la celda
      const tx = await contract.revealCell(row, col);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed");
      
      // Luego verificamos su estado
      await checkCellState(row, col);
      
      // Actualizamos el estado del tablero
      await getBoardState();
    } catch (error: any) {
      if (error.reason) {
        alert(error.reason);
      } else {
        console.error('Error revealing cell:', error);
        alert('Error revealing cell. Check console for details.');
      }
    }
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setRows(value);
    // Ajustar minas si exceden el límite
    const maxMines = value * cols - 1;
    if (mines > maxMines) {
      setMines(maxMines);
    }
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setCols(value);
    // Ajustar minas si exceden el límite
    const maxMines = rows * value - 1;
    if (mines > maxMines) {
      setMines(maxMines);
    }
  };

  const handleMinesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const maxMines = rows * cols - 1;
    setMines(Math.min(value, maxMines));
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <img src="/ZKgato.png" alt="ZK Cat" className={styles.logo} />
          <h1 className={styles.title}>Minesweeperzk</h1>
        </div>

        {!account ? (
          <button className={styles.connectButton} onClick={connectWallet}>
            Connect Wallet to Play
          </button>
        ) : (
          <div className={styles.gameContainer}>
            <img src="/ZKgato.png" alt="ZK Cat" className={styles.gameLogo} />
            {boardState && (
              <div className={styles.gameInfo}>
                <div>🎮 {boardState.rows}x{boardState.cols}</div>
                <div>💣 Mines: {boardState.mines}</div>
                <div>🔍 Revealed: {boardState.revealedCount}</div>
                <div>🎯 {boardState.isGameActive ? "Active" : "Game Over"}</div>
                <button onClick={getBoardState} className={styles.refreshButton}>
                  🔄 Refresh
                </button>
              </div>
            )}
            <div className={styles.controls}>
              <div className={styles.inputGroup}>
                <label>Rows:</label>
                <input
                  type="number"
                  value={rows}
                  onChange={handleRowsChange}
                  min="3"
                  max="16"
                />
                <label>Cols:</label>
                <input
                  type="number"
                  value={cols}
                  onChange={handleColsChange}
                  min="3"
                  max="16"
                />
                <label>Mines:</label>
                <input
                  type="number"
                  value={mines}
                  onChange={handleMinesChange}
                  min="1"
                  max={rows * cols - 1}
                />
                <div className={styles.minesInfo}>
                  Max mines: {rows * cols - 1}
                </div>
              </div>
              <button onClick={initializeGame} className={styles.startButton}>
                🎮 Start Game
              </button>
            </div>

            {grid.length > 0 && (
              <div className={styles.grid}>
                {grid.map((row, rowIndex) => (
                  <div key={rowIndex} className={styles.row}>
                    {row.map((_, colIndex) => {
                      const value = revealedCells[`${rowIndex}-${colIndex}`];
                      return (
                        <div 
                          key={`${rowIndex}-${colIndex}`} 
                          className={`${styles.cell} ${value !== undefined ? styles.revealed : ''}`}
                          onClick={() => revealCell(rowIndex, colIndex)}
                          data-mines={value}
                        >
                          {value === 9 ? '💣' : value || ''}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            <div className={styles.messages}>
              {gameMessages.map((msg, index) => (
                <div key={index} className={styles.message}>{msg}</div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
