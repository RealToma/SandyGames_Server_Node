const express = require("express");
const router = express.Router();
const {
  PhantasmaTS,
  ScriptBuilder,
  Transaction,
  Base16,
  PhantasmaKeys,
  Address,
} = require("phantasma-ts");

router.post("/mint_outfit", async (req, res) => {
  let tempHash = await mintOutfit(
    req.body.address,
    req.body.type,
    req.body.name
  );
  if (tempHash !== null || tempHash !== undefined) {
    return res.json({
      flagSuccess: true,
    });
  } else {
    return res.json({
      flagSuccess: false,
    });
  }
});

async function mintOutfit(toAddress, type, name) {
  let Keys = PhantasmaKeys.fromWIF(
    "KxMn2TgXukYaNXx7tEdjh7qB2YaMgeuKy47j4rvKigHhBuZWeP3r"
  );

  let expiration = new Date(Date.now() + 60 * 60 * 10 * 1000);
  let script;

  let sb = new ScriptBuilder();
  let myScript = sb.AllowGas(Keys.Address, Address.Null, 100000, 210000);

  // myScript = sb.CallInterop("Runtime.TransferTokens", [Keys.Address.Text, "P2K65RZhfxZhQcXKGgSPZL6c6hkygXipNxdeuW5FU531Bqc", "SOUL", 1000000000]);

  myScript = sb.CallContract("AAAB", "mintOutfit", [toAddress, type, name]);

  myScript = sb.SpendGas(Keys.Address);
  script = myScript.EndScript();

  const Payload = Base16.encode("Airdrop - Deposit");

  const tx = new Transaction("simnet", "main", script, expiration, Payload);

  tx.signWithKeys(Keys);

  const rawTx = Base16.encodeUint8Array(tx.ToByteAray(true));

  let RPC = new PhantasmaTS.PhantasmaAPI(
    "http://localhost:7077/rpc",
    null,
    "simnet"
  );

  const hash = await RPC.sendRawTransaction(rawTx);
  return hash;
  // console.info(rawTx);
}

module.exports = router;
