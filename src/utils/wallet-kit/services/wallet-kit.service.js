import {
  StellarWalletsKit,
  FreighterModule,
  FREIGHTER_ID,
  xBullModule,
  AlbedoModule,
  HanaModule,
  RabetModule,
  HotWalletModule,
} from "@creit.tech/stellar-wallets-kit";
import { WatchWalletChanges } from "@stellar/freighter-api";
import { Networks } from "@stellar/stellar-sdk";
import EventService from "./event.service";
import { toast } from "react-toastify";

export const WalletKitEvents = {
  login: "login",
  logout: "logout",
  accountChanged: "accountChanged",
};

export default class WalletKitServiceClass {
  walletKit;
  event = new EventService();
  watcher = null;

  constructor() {
    this.walletKit = new StellarWalletsKit({
      network: Networks.TESTNET,
      modules: [
        new FreighterModule(),
        new HotWalletModule(),
        new xBullModule(),
        new AlbedoModule(),
        new HanaModule(),
        new RabetModule(),
      ],
      selectedWalletId: FREIGHTER_ID,
    });
  }

  async startFreighterWatching(publicKey, setPublicKey, setNetwork) {
    if (!this.watcher) {
      this.watcher = new WatchWalletChanges(1000);
    }
    this.watcher.watch(async ({ address }) => {
      if (publicKey === address || !address) {
        return;
      }

      const network = await this.walletKit.getNetwork();

      setNetwork(network);
      setPublicKey(address);

      this.event.trigger({
        type: WalletKitEvents.accountChanged,
        publicKey: address,
      });
    });
  }

  stopFreighterWatching() {
    this.watcher?.stop();
    this.watcher = null;
  }

  async login(id, setPublicKey, setNetwork, onComplete) {
    try {
      this.walletKit.setWallet(id);

      const { address } = await this.walletKit.getAddress();

      const network = {
        network: "TESTNET",
        networkPassphrase: Networks["TESTNET"],
      };

      setNetwork(network);
      setPublicKey(address);

      if (id === FREIGHTER_ID) {
        this.startFreighterWatching(address, setPublicKey, setNetwork);
      }

      if (onComplete) {
        onComplete(address, network);
      }

      this.event.trigger({
        type: WalletKitEvents.login,
        publicKey: address,
        id,
      });
    } catch (e) {
      console.log("the error is", e);
      toast.error(e?.message);
    }
  }

  restoreLogin(id, publicKey) {
    this.walletKit.setWallet(id);

    if (id === FREIGHTER_ID) {
      this.startFreighterWatching(publicKey);
    }
  }

  async signTx(xdrRaw, network) {
    const { signedTxXdr } = await this.walletKit.signTransaction(xdrRaw, {
      networkPassphrase: network?.networkPassphrase,
    });

    return signedTxXdr;
  }

  logout() {
    if (this.watcher) {
      this.watcher = null;
    }
    this.event.trigger({
      type: WalletKitEvents.logout,
    });
  }
}
