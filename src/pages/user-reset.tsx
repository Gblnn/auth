import Back from "@/components/back";
import { LoadingOutlined } from "@ant-design/icons";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function UserReset() {
  const [email, setEmail] = useState("");
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const usenavigate = useNavigate();

  const ResetPassword = async () => {
    setLoading(true);
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        toast("Password recovery mail sent.");
        setLoading(false);
        usenavigate("/");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        toast(error.message);
      });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          border: "",
          height: "100svh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            border: "",
            position: "absolute",
            top: 0,
            left: 0,
            margin: "2rem",
          }}
        >
          <Back />
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <div
            style={{
              display: "flex",
              width: "32ch",
              height: "",
              border: "1px solid rgba(100 100 100/ 50%)",
              borderRadius: "1.75rem",
              padding: "1.45rem",
              flexFlow: "column",
              gap: "1.75rem",
            }}
          >
            <p
              style={{
                fontSize: "1.35rem",
                textTransform: "uppercase",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <KeyRound color="saddlebrown" />
              Reset Password
            </p>
            <p style={{ fontSize: "0.8rem", opacity: 0.75 }}>
              Enter your e-mail address to recieve a password recovery link for
              your account.
            </p>

            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter Email"
            ></input>

            <button
              onClick={ResetPassword}
              className={email != "" ? "" : "disabled"}
              style={{
                background: "saddlebrown",
                height: "2.5rem",
                fontSize: "0.9rem",
              }}
            >
              {loading ? <LoadingOutlined /> : "Send Recovery Email"}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
