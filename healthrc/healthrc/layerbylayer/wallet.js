/* =========================
   1️⃣ CONTRACT CONFIG
========================= */
console.log("wallet.js loaded");

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "string", name: "_hash", type: "string" }],
    name: "addRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_id", type: "uint256" },
      { internalType: "address", name: "_doctor", type: "address" },
    ],
    name: "grantAccess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "recordCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

/* =========================
   2️⃣ GLOBAL STATE
========================= */
let provider = null;
let signer = null;
let contract = null;
let connectedAddress = null;

/* =========================
   3️⃣ INITIALIZE WALLET
========================= */
async function initWallet() {
  if (!window.ethereum) return;

  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

/* =========================
   4️⃣ DOM READY
========================= */
document.addEventListener("DOMContentLoaded", async () => {
  const walletBtn = document.getElementById("walletBtn");
  const walletDot = document.getElementById("walletDot");

  if (!walletBtn || !walletDot) return;

  // 🔁 Restore wallet session
  if (localStorage.getItem("walletConnected") === "true") {
    try {
      await initWallet();
      const accounts = await provider.listAccounts();
      if (accounts.length) {
        connectedAddress = accounts[0].address;

        walletBtn.innerHTML = `Disconnect (${connectedAddress.slice(0, 6)}…)`;
        walletDot.classList.add("online");
        walletDot.classList.remove("offline");
      }
    } catch (err) {
      console.warn("Wallet restore failed");
    }
  }

  /* =========================
     WALLET BUTTON
  ========================= */
  walletBtn.addEventListener("click", async () => {
    // 🔴 DISCONNECT
    if (connectedAddress) {
      connectedAddress = null;
      provider = signer = contract = null;

      localStorage.removeItem("walletConnected");

      walletBtn.innerHTML = "🦊 Connect Wallet";
      walletDot.classList.remove("online");
      walletDot.classList.add("offline");
      return;
    }

    // 🟢 CONNECT
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      connectedAddress = accounts[0];
      localStorage.setItem("walletConnected", "true");

      await initWallet();

      walletBtn.innerHTML = `Disconnect (${connectedAddress.slice(0, 6)}…)`;
      walletDot.classList.add("online");
      walletDot.classList.remove("offline");

      console.log("Wallet connected:", connectedAddress);

    } catch (err) {
      console.error("Wallet connection failed", err);
    }
  });

  /* =========================
     ACCESS CONTROL (UNCHANGED)
  ========================= */
  document.querySelectorAll(".approve").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!contract) {
        showModal();
        return;
      }

      const recordId = btn.dataset.recordId;
      const doctorAddress = btn.dataset.doctorAddress;

      if (!recordId || !doctorAddress) {
        alert("Missing record or doctor info");
        return;
      }

      try {
        const tx = await contract.grantAccess(
          Number(recordId),
          doctorAddress
        );
        await tx.wait();

        btn.innerHTML = "Approved";
        btn.disabled = true;

      } catch (err) {
        console.error("Approval failed", err);
      }
    });
  });

  document.querySelectorAll(".reject").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.innerHTML = "Rejected";
      btn.disabled = true;
    });
  });
});

/* =========================
   5️⃣ FILE UPLOAD HANDLER
========================= */
document.addEventListener("click", async (e) => {
  const uploadBtn = e.target.closest("#uploadBtn");
  if (!uploadBtn) return;

  if (!contract) {
    alert("Please connect wallet first");
    return;
  }

  const input = document.createElement("input");
  input.type = "file";

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) return;

    try {
      console.log("Uploading file to backend...");

      // 1️⃣ Upload file to backend
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/upload-record", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend not reachable");
      }

      const data = await response.json();
      console.log("Backend response:", data);

      const cid = data.cid;

      // 2️⃣ THIS LINE OPENS METAMASK
      console.log("Calling blockchain...");
      const tx = await contract.addRecord(cid);
      await tx.wait();

      alert("✅ Record uploaded & stored on blockchain");

    } catch (err) {
      console.error(err);
      alert("❌ Backend or blockchain error");
    }
  };

  input.click();
});


/* =========================
   6️⃣ MODAL HANDLER
========================= */
function showModal() {
  const modal = document.getElementById("customModal");
  if (!modal) return;
  modal.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const okBtn = document.getElementById("modalOkBtn");
  if (!okBtn) return;

  okBtn.addEventListener("click", () => {
    document.getElementById("customModal").classList.add("hidden");
  });
});
