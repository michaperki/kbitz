
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useSmartContract, getA } from "@/hooks/useSmartContract";
import { useWallet } from "@/hooks/useWallet";
import { Wager } from "@/types/typechain-types";
import { ethers } from "ethers";

export default function WagerSection() {
    const [wagerAmount, setWagerAmount] = useState<string>("1.0");
    const [contractBalance, setContractBalance] = useState<string>("0");
    const [winnerAddress, setWinnerAddress] = useState<string>("");
    const { getSmartContract, deployedNetworkData, getAllSmartContractNames } = useSmartContract();
    const { walletConnectionStatus, switchNetwork, chainCurrent } = useWallet();
    const [error, setError] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        console.log(getAllSmartContractNames());
    }, []);

    const depositWager = async () => {
        setError("");
        const wagerContract = getSmartContract<Wager>("WAGER");

        try {
            if (wagerContract && walletConnectionStatus === "connected" && switchNetwork && deployedNetworkData) {
                switchNetwork(deployedNetworkData.chainId);

                const amount = ethers.parseEther(wagerAmount);
                setIsProcessing(true);
                const tx = await wagerContract.deposit({ value: amount });
                await tx.wait();

                syncContractBalance();
            } else {
                throw Error("Failed to connect to wager contract");
            }
        } catch (e) {
            console.error(e);
            setError("Failed to deposit wager");
        } finally {
            setIsProcessing(false);
        }
    };

    const declareWinner = async () => {
        setError("");
        const wagerContract = getSmartContract<Wager>("WAGER");

        try {
            if (wagerContract && walletConnectionStatus === "connected" && winnerAddress) {
                setIsProcessing(true);
                const tx = await wagerContract.declareWinner(winnerAddress);
                await tx.wait();

                syncContractBalance();
            } else {
                throw Error("Failed to declare winner");
            }
        } catch (e) {
            console.error(e);
            setError("Failed to declare winner");
        } finally {
            setIsProcessing(false);
        }
    };

    const syncContractBalance = async () => {
        const wagerContract = getSmartContract<Wager>("WAGER");

        try {
            if (walletConnectionStatus === "connected" && wagerContract) {
                const balance = await wagerContract.getBalance();
                setContractBalance(ethers.formatEther(balance));
            }
        } catch (e) {
            console.error(e);
            setError("Failed to sync contract balance");
        }
    };

    // Sync contract balance on load
    useEffect(() => {
        syncContractBalance();
    }, [walletConnectionStatus]);

    // Switch chain on load
    useEffect(() => {
        if (deployedNetworkData?.chainId && chainCurrent?.id !== deployedNetworkData?.chainId) {
            switchNetwork && switchNetwork(deployedNetworkData?.chainId);
        }
    }, [chainCurrent, deployedNetworkData]);

    return (
        <div className={styles.wagerSection}>
            <div className={styles.wagerSectionInner}>
                <h2 className={styles.heading}>Wager Section</h2>
                <p>Contract Balance: {contractBalance} MATIC</p>

                <form className={styles.form} onSubmit={(e) => { e.preventDefault(); depositWager(); }}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Enter wager amount in MATIC"
                        value={wagerAmount}
                        onChange={(e) => setWagerAmount(e.target.value)}
                        disabled={isProcessing}
                    />
                    <button className={styles.btn} type="submit" disabled={isProcessing || !wagerAmount}>
                        {isProcessing ? "Processing..." : "Deposit Wager"}
                    </button>
                </form>

                <form className={styles.form} onSubmit={(e) => { e.preventDefault(); declareWinner(); }}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Winner's address"
                        value={winnerAddress}
                        onChange={(e) => setWinnerAddress(e.target.value)}
                        disabled={isProcessing}
                    />
                    <button className={styles.btn} type="submit" disabled={isProcessing || !winnerAddress}>
                        {isProcessing ? "Processing..." : "Declare Winner"}
                    </button>
                </form>
            </div>

            <pre className={styles.error}>
                {error}
            </pre>
        </div>
    );
}

