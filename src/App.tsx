import { useEffect, useMemo, useState } from "react";
import { useStore as useStoreNanoStores } from '@nanostores/react'
import { message, Dropdown } from "antd";
import { DownOutlined, SwapOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import SwapForm from "./components/SwapForm/";
import NftForm from "./components/NftForm/";
import getTONMaxAmount from "./logic/fetch/getTONMaxAmount";
import getATOMMaxAmount from "./logic/fetch/getATOMMaxAmount";
import getSOLMaxAmount from "./logic/fetch/getSOLMaxAmount";
import fetchMarkets from "./logic/fetch/fetchMarkets";

import { menuBuilder } from "./components/MenuBuilder/";
import { GenerateBtn } from "./components/BtnBuilder/";
import { icoBuilder } from "./components/IcoBuilder";
import { initializeWalletNEAR } from "./logic/wallet/initializeWalletNEAR";
import { makeNEARTrxAfterLoad } from "./logic/transaction/MakeNEARTrx";
import { makeUSNTrxAfterLoad } from "./logic/transaction/MakeUSNTrx";
import getAURMaxAmount from "./logic/fetch/getAURMaxAmount";
import getETHMaxAmount from "./logic/fetch/getETHMaxAmount";
import Social from "./components/Social/";
import Header from "./components/Header/";
import Rpcs from "./components/Rpcs/";
import Gstyles from "./styles/gstyles";
import tonRpcStatus from "./logic/rpcsStatus/ton";
import solRpcStatus from "./logic/rpcsStatus/solana";
import auroraRpcStatus from "./logic/rpcsStatus/aurora";
import cosmosRpcStatus from "./logic/rpcsStatus/cosmos";
import nearRpcStatus from "./logic/rpcsStatus/near";
import ethRpcStatus from "./logic/rpcsStatus/eth";
import callBackStatus from "./logic/rpcsStatus/back";

import { WalletSelectorContextProvider } from "./contexts/WalletSelectorContext";


import "@near-wallet-selector/modal-ui/styles.css";
import { Loader, Version, SelectCoin, AppDiv, Selector, DirectionBtn, } from "./styles/style";
import "antd/dist/antd.css";

import bnn from "./static/img/logo.svg";
import { RootStore, StoreProvider, useStores } from "./stores";
import NetSwitch from "./components/NetSwitch";
import NftLink from "./components/NftLink";
import SwapLink from "./components/SwapLink";
import BridgeLink from "./components/BridgeLink";
import SwitchAlert from "./components/SwitchAlert";


const AppWrapper = () => {
	const { storeMain, storeSwitch } = useStores();
	const storeMainRepository = useStoreNanoStores(storeMain.repository);
	const storeSwitchRepository = useStoreNanoStores(storeSwitch.repository);



	const [ex, sex] = useState(true);
	const [firstCurrAmount, setFirstCurrAmount] = useState<string>("");
	const [secCurrAmount, setSecCurrAmount] = useState<string>("");
	const [formType, setFormType] = useState<string>("swap");
	const navigate = useNavigate();
	const location = useLocation();
	// const navigation = useNavigation();

	const [isload, setIsload] = useState(false);
	const [hexString, sHexString] = useState("");
	const [networkSource, setNetworkSource] = useState("NEAR");
	const [networkDestination, setNetworkDestination] = useState("TON");

	useEffect(() => {
	 storeMain.setRpcsStatuses([
			storeMainRepository.backStatus,
			storeMainRepository.rpcTonStatus,
			storeMainRepository.rpcEthStatus,
			storeMainRepository.rpcNearStatus,
			storeMainRepository.rpcSolStatus,
			storeMainRepository.rpcCosmosStatus,
			storeMainRepository.rpcAuroraStatus,
		]);
	}, [
		storeMainRepository.rpcAuroraStatus,
		storeMainRepository.rpcNearStatus,
		storeMainRepository.rpcSolStatus,
		storeMainRepository.rpcTonStatus,
		storeMainRepository.rpcCosmosStatus,
		storeMainRepository.rpcEthStatus,
		storeMainRepository.backStatus,
	]);

	const [searchParams, setSearchParams] = useSearchParams();
	const transactionHashes = searchParams.get("transactionHashes");
	const nearAccountId = searchParams.get("account_id");
	const isusn = searchParams.get("isusn");
	const isnear = searchParams.get("isnear");

	const tvl = useMemo(() => {
		return storeMainRepository.AURMaxAmount * storeMainRepository.auru +
		storeMainRepository.USNMaxAmount * storeMainRepository.usnu +
		storeMainRepository.ETHMaxAmount * storeMainRepository.ethu +
		storeMainRepository.NEARMaxAmount * storeMainRepository.nu +
		storeMainRepository.ATOMMaxAmount * storeMainRepository.au +
		storeMainRepository.TONMaxAmount * storeMainRepository.tu +
		storeMainRepository.SOLMaxAmount * storeMainRepository.su;
	}, [storeMainRepository.ATOMMaxAmount, storeMainRepository.AURMaxAmount, storeMainRepository.ETHMaxAmount, storeMainRepository.NEARMaxAmount, storeMainRepository.SOLMaxAmount, storeMainRepository.TONMaxAmount, storeMainRepository.USNMaxAmount, storeMain.repository]);


	useEffect(() => {
		const getStatuses = () => {
			(async () => {
				storeMain.setRpcTonStatus(await tonRpcStatus(storeSwitchRepository.isTestNet));
			})();
			(async () => {
				storeMain.setRpcSolStatus(await solRpcStatus(storeSwitchRepository.isTestNet));
			})();
			(async () => {
				storeMain.setRpcNearStatus(await nearRpcStatus(storeSwitchRepository.isTestNet));
			})();
			(async () => {
				storeMain.setRpcAuroraStatus(await auroraRpcStatus(storeSwitchRepository.isTestNet));
			})();
			(async () => {
				storeMain.setRpcEthStatus(await ethRpcStatus(storeSwitchRepository.isTestNet)); //need to replace rpc-fast
			})();
			(async () => {
				storeMain.setRpcCosmosStatus(await cosmosRpcStatus(storeSwitchRepository.isTestNet)); // dont work
			})();
			(async () => {
				storeMain.setBackStatus(await callBackStatus(storeSwitchRepository.isTestNet));
			})();
		};
		getStatuses();
		setInterval(() => {
			getStatuses();
		}, 30000);

		getTONMaxAmount(storeMain.setTONMaxAmount, storeSwitchRepository.isTestNet); 
		getSOLMaxAmount(storeMain.setSOLMaxAmount, storeSwitchRepository.isTestNet); 
		getATOMMaxAmount(storeMain.setATOMMaxAmount, storeSwitchRepository.isTestNet); //cosmos doesn't work, new api required
		getAURMaxAmount(storeMain.setAURMaxAmount, storeSwitchRepository.isTestNet); 
		getETHMaxAmount(storeMain.setETHMaxAmount, storeSwitchRepository.isTestNet); 

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
			storeMain.setSOLwalletKey(storedData.SOLwalletKey);
			storeMain.setTONwalletKey(storedData.TONwalletKey);
			storeMain.setAURwalletKey(storedData.AURwalletKey);
			storeMain.setNEARwalletKey(storedData.NEARwalletKey);
			storeMain.setATOMwalletKey(storedData.ATOMwalletKey);
			storeMain.setETHwalletKey(storedData.ETHwalletKey);
			sHexString(storedData.hexString);
			setNetworkSource(storedData.networkSource);
			setNetworkDestination(storedData.networkDestination);
			storeSwitch.setIsTestNet(storedData.isTestNet);
		}

		initializeWalletNEAR(storeMain.setNEARMaxAmount, storeMain.setNEARwalletKey, storeMain.setUSNMaxAmount, storeSwitchRepository.isTestNet);
		if (isnear)
			makeNEARTrxAfterLoad(transactionHashes, setSearchParams, searchParams, storeSwitchRepository.isTestNet);
		if (isusn)
			makeUSNTrxAfterLoad(transactionHashes, setSearchParams, searchParams, storeSwitchRepository.isTestNet);
		message.success("Use Chrome with TonWallet & Phantom extensions", 5);
		message.success("Connect both and make trx, then wait a little bit", 6);
	}, [storeSwitchRepository.isTestNet]);

	useEffect(() => {
		const SOLwalletKey = storeMainRepository.SOLwalletKey;
		const TONwalletKey = storeMainRepository.TONwalletKey;
		const ETHwalletKey = storeMainRepository.ETHwalletKey;
		const AURwalletKey = storeMainRepository.AURwalletKey;
		const NEARwalletKey = storeMainRepository.NEARwalletKey;
		const ATOMwalletKey = storeMainRepository.ATOMwalletKey;
		const isTestNet = storeSwitchRepository.isTestNet;
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
				hexString,
				networkSource,
				networkDestination,
				isTestNet
			})
		);
	}, [
		ex,
		storeMainRepository.SOLwalletKey,
		storeMainRepository.TONwalletKey,
		storeMainRepository.AURwalletKey,
		storeMainRepository.ETHwalletKey,
		storeMainRepository.NEARwalletKey,
		storeMainRepository.ATOMwalletKey,
		hexString,
		networkSource,
		networkDestination,
		storeSwitchRepository.isTestNet
	]);


	const menuSource = menuBuilder(networkDestination, setNetworkSource, formType, false);
	const menuDestination = menuBuilder(networkSource, setNetworkDestination, formType, true);

	const coinIco = icoBuilder(networkSource);
	const coinIcoDest = icoBuilder(networkDestination);

	const btnDest = GenerateBtn(networkDestination);
	const btnSource = GenerateBtn(networkSource);

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
				<SelectCoin>
				<img src={coinIco} alt={"#"} />
					{networkSource}
					<DownOutlined />
				</SelectCoin>
			</Dropdown>
		</>
	);

	const btnSelectDirection = (
		<>
			<Dropdown overlay={menuDestination} placement="bottom">
				<SelectCoin>
					<img src={coinIcoDest} alt={"#"} />
					{networkDestination}
					<DownOutlined />
				</SelectCoin>
			</Dropdown>
		</>
	);

	const changeDirection = (
		<DirectionBtn>
			<SwapOutlined onClick={swap} />
		</DirectionBtn>
	);

	const fromProps = {
		btnSelectSource,
		btnSelectDirection,
		btnDest,
		btnSource,
		setIsload,
		isload,
		hexString,
		changeDirection,
		directionNetwork: networkDestination.toLowerCase(),
		networkSource: networkSource.toLowerCase(),
		setFirstCurrAmount,
		setSecCurrAmount,
		firstCurrAmount,
		secCurrAmount,
		formType
	};

	useEffect(() => {
		console.log(formType)
		setNetworkSource('NEAR')
		if (formType === 'bridge') {
			setNetworkDestination('wNEAR (TON)')
		} else if (formType === 'swap') {
			setNetworkDestination("TON")
		} else {
			setNetworkDestination("MUMBAI")
			setNetworkSource('TON')
		}
		// wrap
		// COIN -> XCOIN
		// XCOIN -> COIN
		//
		// swap
		// COIN -> COIN
		// XCOIN none 
	}, [formType])
	

	useEffect(() => {

		console.log(location.pathname)
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
			if(storeSwitchRepository.isTestNet) {
				navigate("/nft");
				setFormType('nft')
			} else {
				navigate("/swap");
				setFormType('swap')
			}
			
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


	const formTypeProps = {
		formType,
		setFormType
	};

	return (
		<>
			<SwitchAlert/>

			<Header />

			<NetSwitch {...formTypeProps}/>

			<Selector>
				<SwapLink {...formTypeProps}/>
				<BridgeLink {...formTypeProps}/>
				<NftLink {...formTypeProps} />				 
			</Selector>
			<AppDiv>
				{/*<Route path="/swap" element={<SwapForm {...fromProps} />} />*/}
				{location.pathname !== '/nft' ? <SwapForm {...fromProps} /> : <NftForm {...fromProps} />}
				{isload ? <Loader src={bnn} /> : null}
			</AppDiv>
			<Rpcs rpcsStatuses={storeMainRepository.rpcsStatuses} />
			<Social />
			<Version>
				Tonana TVL: ${tvl.toFixed(2)}
				<br />
				v1.1.01 (alpha)
			</Version>
			<Gstyles />
		</>
	);
};

const App = () => {
	const rootStore = new RootStore();
	return (
		<StoreProvider store={rootStore}>
			<WalletSelectorContextProvider>
				<AppWrapper />
			</WalletSelectorContextProvider>
		</StoreProvider>
	);
};

export default App;
