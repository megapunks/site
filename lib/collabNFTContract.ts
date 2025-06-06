import { ethers } from "ethers";
import { getProvider } from "./provider"; 
import collabAbi from "./collabNFTAbi.json"; 
export const collabNFTAddress = "0x0ED9BE360CED359c5064b207423bBDA65099ee76";

export const getCollabNFTContract = async () => {
  const provider = getProvider();
  const signer = provider.getSigner();
  return new ethers.Contract(collabNFTAddress, collabAbi, signer);
};
