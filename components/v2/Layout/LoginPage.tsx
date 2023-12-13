import React, { useEffect, useState } from "react";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import {
  genAddressSeed,
  generateNonce,
  generateRandomness,
  getExtendedEphemeralPublicKey,
  getZkLoginSignature,
  jwtToAddress,
} from "@mysten/zklogin";
import { SuiClient } from "@mysten/sui.js/client";
import { signOut, useSession } from "next-auth/react";
import {
  KEY_PAIR_SESSION_STORAGE_KEY,
  MAX_EPOCH_LOCAL_STORAGE_KEY,
  RANDOMNESS_SESSION_STORAGE_KEY,
} from "../../../const";
import { jwtDecode, JwtPayload } from "jwt-decode";
import queryString from "query-string";
import { useRouter } from "next/router";

const LoginPage: React.FC = () => {
  const [suiAddress, setSuiAddress] = useState<string | undefined>();
  const [ephemeralKeyPair, setEphemeralKeyPair] = useState<
    Ed25519Keypair | undefined
  >();
  const [currentEpoch, setCurrentEpoch] = useState("");
  const [maxEpoch, setMaxEpoch] = useState(0);
  const [randomness, setRandomness] = useState("");
  const [nonce, setNonce] = useState<string | undefined>();
  const [oauthParams, setOauthParams] =
    useState<queryString.ParsedQuery<string>>();
  const [jwtString, setJwtString] = useState("");
  const [decodedJwt, setDecodedJwt] = useState<JwtPayload>();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("logout error:", error);
    }
  };

  // query jwt id_token
  useEffect(() => {
    if (oauthParams && oauthParams.id_token) {
      const decodedJwt = jwtDecode(oauthParams.id_token as string);
      setJwtString(oauthParams.id_token as string);
      setDecodedJwt(decodedJwt);
    }
  }, [oauthParams]);

  const router = useRouter();

  useEffect(() => {
    if (router.asPath.includes("?")) {
      const res = queryString.parse(router.asPath.split("?")[1]);
      setOauthParams(res);
    }
  }, [router.asPath]);

  const suiClient = new SuiClient({ url: "https://fullnode.devnet.sui.io" });

  const handleZKLogin = async () => {
    // generate randomness
    const ephemeralKeyPair = Ed25519Keypair.generate();
    window.sessionStorage.setItem(
      KEY_PAIR_SESSION_STORAGE_KEY,
      ephemeralKeyPair.export().privateKey,
    );
    setEphemeralKeyPair(ephemeralKeyPair);

    // get epoch from Sui node
    const { epoch } = await suiClient.getLatestSuiSystemState();

    setCurrentEpoch(epoch);
    window.localStorage.setItem(
      MAX_EPOCH_LOCAL_STORAGE_KEY,
      String(Number(epoch) + 10),
    );
    setMaxEpoch(Number(epoch) + 10);

    // generate randomness
    const randomness = generateRandomness();
    window.sessionStorage.setItem(RANDOMNESS_SESSION_STORAGE_KEY, randomness);
    setRandomness(randomness);

    // generate Nonce
    const newNonce = generateNonce(
      ephemeralKeyPair.getPublicKey(),
      Number(currentEpoch),
      randomness,
    );
    setNonce(newNonce);
    console.log("nonce:", process.env.GOOGLE_CLIENT_ID as string);

    // login to google
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI as string,
      response_type: "id_token" as string,
      scope: "openid" as string,
      nonce: nonce as string,
    });
    const loginURL = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    window.location.replace(loginURL);

    // const jwtToken = "your_jwt_token"; // 示例值
    //
    // // 从JWT令牌生成Sui地址
    // const address = jwtToAddress(jwtToken, "user_salt");
    // setSuiAddress(address);
    //
    // // 获取ZKLogin签名
    // const zkLoginSignature: SerializedSignature =
    //     getZkLoginSignature({
    //       inputs: {
    //         ...zkProof,
    //         addressSeed,
    //       },
    //       maxEpoch,
    //       userSignature,
    //     });
    //
    // // 执行与Sui区块链的交互...
  };

  return (
    <div>
      <button
        onClick={handleZKLogin}
        className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-full text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 "
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
      </button>
      {suiAddress && <p>Your Sui Address: {suiAddress}</p>}
    </div>
  );
};

export default LoginPage;
