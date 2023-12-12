import React, { useState } from "react";
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

const LoginPage: React.FC = () => {
  const [suiAddress, setSuiAddress] = useState<string | undefined>();
  const [ephemeralKeyPair, setEphemeralKeyPair] = useState<Ed25519Keypair | undefined>();
  const [nonce, setNonce] = useState<string | undefined>();

  const suiClient = new SuiClient({ url: "https://fullnode.devnet.sui.io" });

  const handleZKLogin = async () => {
    // // 生成临时密钥对
    // const newEphemeralKeyPair = Ed25519Keypair.generate();
    // setEphemeralKeyPair(newEphemeralKeyPair);
    //
    // // 获取当前epoch（在真实应用中应从Sui网络获取）
    // const currentEpoch = 1; // 示例值
    //
    // // 生成Nonce
    // const newNonce = generateNonce(newEphemeralKeyPair.getPublicKey(), currentEpoch, "randomness_string");
    // setNonce(newNonce);
    //
    // // 执行登录流程（例如，显示Google登录界面）
    //
    // // 以下步骤通常在用户完成外部认证后执行
    //
    // // 假设JWT令牌已获得
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
        <button onClick={handleZKLogin}>Login with ZKLogin</button>
        {suiAddress && <p>Your Sui Address: {suiAddress}</p>}
      </div>
  );
};

export default LoginPage;
