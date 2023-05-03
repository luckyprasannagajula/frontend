import { useEffect, useMemo, useState } from "react";
import { Button, message, Dropdown } from "antd";
// import { useLocation } from 'react-router-dom'
import { DownOutlined, SwapOutlined } from "@ant-design/icons";
import { Routes, Route, useSearchParams, Link, useNavigation, Router } from "react-router-dom";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useNavigate, useLocation } from "react-router-dom";
import SwapForm from "./components/SwapForm";
import NftForm from "./components/NftForm";
import getTONMaxAmount from "./logic/fetch/getTONMaxAmount";
import getATOMMaxAmount from "./logic/fetch/getATOMMaxAmount";
import getSOLMaxAmount from "./logic/fetch/getSOLMaxAmount";
import fetchMarkets from "./logic/fetch/fetchMarkets";

import { menuBuilder } from "./components/MenuBuilder";
import { generateBtn } from "./components/BtnBuilder";
import { icoBuilder } from "./components/IcoBuilder";
import { initializeWalletNEAR } from "./logic/wallet/initializeWalletNEAR";
import { makeNEARTrxAfterLoad } from "./logic/transaction/MakeNEARTrx";
import { makeUSNTrxAfterLoad } from "./logic/transaction/MakeUSNTrx";
import getAURMaxAmount from "./logic/fetch/getAURMaxAmount";
import getETHMaxAmount from "./logic/fetch/getETHMaxAmount";
import Social from "./components/Social";
import Header from "./components/Header";
import Rpcs from "./components/Rpcs";
import Gstyles from "./styles/gstyles";
import tonRpcStatus from "./logic/rpcsStatus/ton";
import solRpcStatus from "./logic/rpcsStatus/solana";
import auroraRpcStatus from "./logic/rpcsStatus/aurora";
import cosmosRpcStatus from "./logic/rpcsStatus/cosmos";
import nearRpcStatus from "./logic/rpcsStatus/near";
import ethRpcStatus from "./logic/rpcsStatus/eth";
import callBackStatus from "./logic/rpcsStatus/back";

import "@near-wallet-selector/modal-ui/styles.css";
import { Loader } from "./styles/style";
import "antd/dist/antd.css";
import { useWalletSelector } from "./contexts/WalletSelectorContext";

import bnn from "./static/img/logo.svg";
import { RootStore, StoreProvider, useStores } from "./stores";

const AppWrapper = () => {
	const { storeMain } = useStores();
	const { selector, modal, accounts, accountId } = useWalletSelector();
	const [ex, sex] = useState(true);

	const [SOLwalletKey, setSOLWalletKey] = useState("");
	const [MUMBwalletKey, setMUMBwalletKey] = useState("");
	const [TONwalletKey, setTONwalletKey] = useState("");
	const [NEARwalletKey, setNEARwalletKey] = useState("");
	const [ATOMwalletKey, setATOMwalletKey] = useState("");
	const [MASSAwalletKey, setMASSAwalletKey] = useState("");
	const [AURwalletKey, setAURwalletKey] = useState("");
	const [AURMaxAmount, setAURMaxAmount] = useState(0);
	const [SOLMaxAmount, setSOLMaxAmount] = useState(0);
	const [MASSAMaxAmount, setMASSAMaxAmount] = useState(0);
	const [TONMaxAmount, setTONMaxAmount] = useState(0);
	const [ATOMMaxAmount, setATOMMaxAmount] = useState(0);
	const [NEARMaxAmount, setNEARMaxAmount] = useState(0);
	const [ETHMaxAmount, setETHMaxAmount] = useState(0);
	const [USNMaxAmount, setUSNMaxAmount] = useState(0);
	const [firstCurrAmount, setFirstCurrAmount] = useState<string>("");
	const [secCurrAmount, setSecCurrAmount] = useState<string>("");
	const [ETHwalletKey, setETHWalletKey] = useState("");

	const [formType, setFormType] = useState<string>("swap");
	const navigate = useNavigate();
	const location = useLocation();
	// const navigation = useNavigation();

	const [isload, setIsload] = useState(false);
	const [hexString, sHexString] = useState("");
	const [networkSource, setNetworkSource] = useState("MASSA");
	const [networkDestination, setNetworkDestination] = useState("TON");
	const [rpcEthStatus, setRpcEthStatus] = useState<{
		key: string;
		title: string;
		status: boolean;
	}>({
		title: "Ethereum RPC",
		key: "eth",
		status: false,
	});

	const [rpcSolStatus, setRpcSolStatus] = useState<{
		key: string;
		title: string;
		status: boolean;
	}>({
		title: "Solana RPC",
		key: "sol",
		status: false,
	});
	const [rpcNearStatus, setRpcNearStatus] = useState<{
		key: string;
		title: string;
		status: boolean;
	}>({
		title: "Near RPC",
		key: "near",
		status: false,
	});

	const [rpcMassaStatus, setRpcMassaStatus] = useState<{
		key: string;
		title: string;
		status: boolean;
	}>({
		title: "Massa RPC",
		key: "massa",
		status: true, // todo
	});

	const [rpcAuroraStatus, setRpcAuroraStatus] = useState<{
		key: string;
		title: string;
		status: boolean;
	}>({
		title: "Aurora RPC",
		key: "aurora",
		status: false,
	});

	const [rpcTonStatus, setRpcTonStatus] = useState<{
		key: string;
		title: string;
		status: boolean;
	}>({
		title: "Ton RPC",
		key: "ton",
		status: false,
	});

	const [rpcCosmosStatus, setRpcCosmosStatus] = useState<{
		key: string;
		title: string;
		status: boolean;
	}>({
		title: "Cosmos RPC",
		key: "atom",
		status: false,
	});
	const [backStatus, setBackStatus] = useState<{
		key: string;
		title: string;
		status: boolean;
	}>({
		title: "Tonana oracle",
		key: "tnn",
		status: false,
	});

	const [rpcsStatuses, setRpcsStatuses] = useState<
		Array<{
			key: string;
			title: string;
			status: boolean;
		}>
	>([]);

	useEffect(() => {
		setRpcsStatuses([
			backStatus,
			rpcTonStatus,
			rpcEthStatus,
			rpcNearStatus,
			rpcSolStatus,
			rpcCosmosStatus,
			rpcAuroraStatus,
			rpcMassaStatus,
		]);
	}, [
		rpcAuroraStatus,
		rpcNearStatus,
		rpcSolStatus,
		rpcTonStatus,
		rpcCosmosStatus,
		rpcEthStatus,
		rpcMassaStatus,
		backStatus,
	]);

	const [searchParams, setSearchParams] = useSearchParams();
	const transactionHashes = searchParams.get("transactionHashes");
	const nearAccountId = searchParams.get("account_id");
	const isusn = searchParams.get("isusn");
	const isnear = searchParams.get("isnear");

	const tvl = useMemo(() => {
		return AURMaxAmount * storeMain.repository.get().auru +
			USNMaxAmount * storeMain.repository.get().usnu +
			ETHMaxAmount * storeMain.repository.get().ethu +
			NEARMaxAmount * storeMain.repository.get().nu +
			ATOMMaxAmount * storeMain.repository.get().au +
			TONMaxAmount * storeMain.repository.get().tu +
			SOLMaxAmount * storeMain.repository.get().su;
	}, [ATOMMaxAmount, AURMaxAmount, ETHMaxAmount, NEARMaxAmount, SOLMaxAmount, TONMaxAmount, USNMaxAmount, storeMain.repository]);

	var connection = new Connection(
		"https://solana-mainnet.g.alchemy.com/v2/B9sqdnSJnFWSdKlCTFqEQjMr8pnj7RAb"
	);
	console.log(location.pathname);

	useEffect(() => {
		const getStatuses = () => {
			(async () => {
				setRpcTonStatus(await tonRpcStatus());
			})();
			(async () => {
				setRpcSolStatus(await solRpcStatus());
			})();
			(async () => {
				setRpcNearStatus(await nearRpcStatus());
			})();
			(async () => {
				setRpcAuroraStatus(await auroraRpcStatus());
			})();
			(async () => {
				setRpcEthStatus(await ethRpcStatus());
			})();
			(async () => {
				setRpcCosmosStatus(await cosmosRpcStatus());
			})();
			(async () => {
				setBackStatus(await callBackStatus());
			})();
			//todo massa rpc status
		};
		getStatuses();
		setInterval(() => {
			getStatuses();
		}, 30000);

		getTONMaxAmount(setTONMaxAmount);
		getSOLMaxAmount(setSOLMaxAmount);
		getATOMMaxAmount(setATOMMaxAmount);
		getAURMaxAmount(setAURMaxAmount);
		getETHMaxAmount(setETHMaxAmount);
		//todo massa max amount
		// getMASSAMaxAmount(setMASSAMaxAmount);
		storeMain.smassau(0.25);
		//todo massa price or something
		fetchMarkets(storeMain.setTu, storeMain.setSu, storeMain.setAu, storeMain.setNu, storeMain.setAuru, storeMain.setUsnu, storeMain.setEthu, storeMain.smaticu);
		setInterval(() => {
			fetchMarkets(storeMain.setTu, storeMain.setSu, storeMain.setAu, storeMain.setNu, storeMain.setAuru, storeMain.setUsnu, storeMain.setEthu, storeMain.smaticu);
		}, 15000);

		sHexString(
			Array(16)
				.fill("")
				.map(() => Math.round(Math.random() * 0xf).toString(16))
				.join("")
		);

		if (localStorage.getItem("tonana_data") && nearAccountId) {
			//@ts-ignore
			const storedData = JSON.parse(localStorage.getItem("tonana_data"));
			sex(storedData.ex);
			setSOLWalletKey(storedData.SOLwalletKey);
			setTONwalletKey(storedData.TONwalletKey);
			setAURwalletKey(storedData.AURwalletKey);
			setNEARwalletKey(storedData.NEARwalletKey);
			setATOMwalletKey(storedData.ATOMwalletKey);
			setETHWalletKey(storedData.ETHwalletKey);
			setMASSAwalletKey(storedData.MASSAwalletKey);
			sHexString(storedData.hexString);
			setNetworkSource(storedData.networkSource);
			setNetworkDestination(storedData.networkDestination);
		}

		initializeWalletNEAR(setNEARMaxAmount, setNEARwalletKey, setUSNMaxAmount);
		if (isnear)
			makeNEARTrxAfterLoad(transactionHashes, setSearchParams, searchParams);
		if (isusn)
			makeUSNTrxAfterLoad(transactionHashes, setSearchParams, searchParams);
		// message.success("Use Chrome with TonWallet & Phantom extensions", 10);
		// message.success("Connect both and make trx, then wait a little bit", 11);
	}, []);

	useEffect(() => {
		localStorage.setItem(
			"tonana_data",
			JSON.stringify({
				ex,
				SOLwalletKey,
				TONwalletKey,
				ETHwalletKey,
				AURwalletKey,
				NEARwalletKey,
				ATOMwalletKey,
				MASSAwalletKey,
				hexString,
				networkSource,
				networkDestination,
			})
		);
	}, [
		ex,
		SOLwalletKey,
		TONwalletKey,
		AURwalletKey,
		ETHwalletKey,
		NEARwalletKey,
		ATOMwalletKey,
		MASSAwalletKey,
		hexString,
		networkSource,
		networkDestination,
	]);

	const btnProps = {
		setSOLWalletKey,
		setETHWalletKey,
		setTONwalletKey,
		setAURwalletKey,
		setMASSAwalletKey,
		setNEARwalletKey,
		setATOMwalletKey,
		setMUMBwalletKey,
		TONwalletKey,
		AURwalletKey,
		SOLwalletKey,
		NEARwalletKey,
		ATOMwalletKey,
		ETHwalletKey,
		MASSAwalletKey,
		MUMBwalletKey
	};


	const menuSource = menuBuilder(networkDestination, setNetworkSource, formType, false);
	const menuDestination = menuBuilder(networkSource, setNetworkDestination, formType, true);

	const coinIco = icoBuilder(networkSource);
	const coinIcoDest = icoBuilder(networkDestination);

	const btnDest = generateBtn(btnProps, networkDestination);
	const btnSource = generateBtn(btnProps, networkSource);

	const swap = () => {
		setNetworkDestination(networkSource);
		setNetworkSource(networkDestination);
		setFirstCurrAmount(secCurrAmount);
		setSecCurrAmount(firstCurrAmount);
		sex(!ex);
	};

	const btnSelectSource = (
		<>
			<Dropdown overlay={menuSource} placement="bottom">
				<Button id={"selectCoin"}>
					<img src={coinIco} alt={"#"} />
					{networkSource}
					<DownOutlined />
				</Button>
			</Dropdown>
		</>
	);

	const btnSelectDirection = (
		<>
			<Dropdown overlay={menuDestination} placement="bottom">
				<Button id={"selectCoin"}>
					<img src={coinIcoDest} alt={"#"} />
					{networkDestination}
					<DownOutlined />
				</Button>
			</Dropdown>
		</>
	);

	const changeDirection = (
		<div id={"directionBtn"}>
			<SwapOutlined onClick={swap} />
		</div>
	);

	const fromProps = {
		ATOMwalletKey,
		ETHwalletKey,
		MUMBwalletKey,
		SOLwalletKey,
		TONwalletKey,
		AURwalletKey,
		NEARwalletKey,
		MASSAwalletKey,
		ATOMMaxAmount,
		SOLMaxAmount,
		ETHMaxAmount,
		MASSAMaxAmount,
		AURMaxAmount,
		TONMaxAmount,
		USNMaxAmount,
		NEARMaxAmount,
		btnSelectSource,
		btnSelectDirection,
		btnDest,
		btnSource,
		setIsload,
		isload,
		hexString,
		changeDirection,
		connection,
		directionNetwork: networkDestination.toLowerCase(),
		networkSource: networkSource.toLowerCase(),
		setFirstCurrAmount,
		setSecCurrAmount,
		firstCurrAmount,
		secCurrAmount,
		rpcsStatuses,
		formType
	};

	useEffect(() => {
		console.log(formType)
		setNetworkSource('MASSA')
		if (formType === 'bridge') {
			setNetworkDestination('wMASSA (TON)')
		} else if (formType === 'swap') {
			setNetworkDestination("TON")
		} else {
			setNetworkDestination("MUMBAI")
			setNetworkSource('TON')
		}
	}, [formType])

	useEffect(() => {
		if (location.pathname !== '/swap' && location.pathname !== '/bridge' && location.pathname !== '/nft') {
			navigate("/swap");
			setFormType('swap')
		}
		if (location.pathname === '/swap') {
			navigate("/swap");
			setFormType('swap')
		}
		if (location.pathname === '/bridge') {
			navigate("/bridge");
			setFormType('bridge')
		}
		if (location.pathname === '/nft') {
			navigate("/nft");
			setFormType('nft')
		}
	}, [location.pathname])

	useEffect(() => {
		if (formType === 'bridge') {
			if (networkSource.includes('(') && networkSource.includes(')')) {
				console.log(networkSource.split(' ')[0].slice(1))
				setNetworkDestination(networkSource.split(' ')[0].slice(1))
			} else {
				setNetworkDestination(`w${networkSource} (TON)`)
			}
		}
	}, [networkSource])

	return (
		<>
			<Header />
			<div className={'selector'}>
				<Link to="/swap"><div onClick={() => setFormType('swap')}>Swap</div></Link>
				<Link to="/bridge"><div onClick={() => setFormType('bridge')}>Bridge</div></Link>
				<Link to="/nft"><div onClick={() => setFormType('nft')}>NFT<span>testnet</span></div></Link>
			</div>
			<div className="App">
				{/*<Route path="/swap" element={<SwapForm {...fromProps} />} />*/}
				{location.pathname !== '/nft' ? <SwapForm {...fromProps} /> : <NftForm {...fromProps} />}
				{isload ? <Loader src={bnn} /> : null}
			</div>
			<Rpcs rpcsStatuses={rpcsStatuses} />
			<Social />
			<div className="version">
				Tonana TVL: ${tvl.toFixed(2)}
				<br />
				v1.1.01 (alpha)
			</div>
			<Gstyles />
		</>
	);
};

const App = () => {
	const rootStore = new RootStore();
	return (
		<StoreProvider store={rootStore}>
			<AppWrapper />
		</StoreProvider>
	);
};

export default App;
