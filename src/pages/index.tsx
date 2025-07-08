import { useAuth } from "@/components/AuthProvider";
import Back from "@/components/back";
import DefaultDialog from "@/components/default-dialog";
import Directive from "@/components/directive";
import IndexDropDown from "@/components/index-dropdown";
import InputDialog from "@/components/input-dialog";
import { auth } from "@/firebase";
import { LoadingOutlined } from "@ant-design/icons";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import {
  Bug,
  Crown,
  KeyRound,
  Link,
  Mail,
  UserCog,
  UserSquare
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Index() {
  const usenavigate = useNavigate();
  const [requestDialog, setRequestDialog] = useState(false);
  const [bugDialog, setBugDialog] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [valeLoginPrompt, setValeLoginPrompt] = useState(false);
  const [logoutPrompt, setLogoutPrompt] = useState(false);
  const navigate = useNavigate();
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState(false);
  const [admin, setAdmin] = useState(false);
  const { userData, logoutUser: logOut } = useAuth();

  const serviceId = "service_fixajl8";
  const templateId = "template_0f3zy3e";

  const sendBugReport = async () => {
    setLoading(true);
    await emailjs.send(serviceId, templateId, {
      name: auth.currentUser?.email,
      subject:
        "Bug Report - " +
        moment().format("ll") +
        " from " +
        auth.currentUser?.email,
      recipient: "goblinn688@gmail.com",
      message: issue,
    });
    setLoading(false);
    toast.success("Bug Report sent");
    setBugDialog(false);
  };

  useEffect(() => {
    if (userData) {
      const hasAccess =
        userData.clearance === "All";
      setAccess(hasAccess);
      setAdmin(userData.role === "admin");

      if (userData.role === "profile") {
        navigate("/profile");
      }
    }
  }, [userData, navigate]);

  const Authenticate = () => {
    access ? navigate("/record-list") : toast.error("Clearance required");
  };

  const handleLogout = async () => {
    try {
      setLogoutPrompt(false);
      await logOut();
    } catch (error) {
      console.error("Logout error:", error);
      toast("Failed to logout. Please try again.");
    }
  };

  return (
    <>
      {/* <div style={{border:"", display:"flex", alignItems:"center", justifyContent:'center'}}>
        <ConfettiExplosion/>
        </div> */}
      <div
        style={{
          border: "",
          padding: "1.25rem",
          // background:
          //   "linear-gradient(rgba(100 100 100/ 0%),black,black, saddlebrown)",
          height: "100svh",
        }}
      >
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
          <Back
            title="App"
            subtitle={"v1.0"}
            icon={<img src="/vite.svg" style={{ width: "1.75rem" }} />}
            noback
            extra={
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                {/* <button
                  onClick={() => window.location.reload()}
                  style={{
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    fontSize: "0.75rem",
                    opacity: "0.75",
                  }}
                >
                  <RefreshCcw width={"1rem"} color="dodgerblue" />
                  <p style={{ opacity: 0.5, letterSpacing: "0.15rem" }}>
                    v1.18
                  </p>
                </button> */}

                {/* <button onClick={()=>usenavigate("/inbox")} style={{ width:"3rem", background:"rgba(220 20 60/ 20%)"}}>
                            <Inbox className="" color="crimson"/>
                        </button> */}

                {/* <button
                  onClick={() => {
                    setLogoutPrompt(true);
                  }}
                  style={{ width: "3rem" }}
                >
                  <LogOut width={"1rem"} color="lightcoral" />
                </button> */}

                {admin && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                  >
                    <button
                      onClick={() => navigate("/users")}
                      style={{
                        fontSize: "0.75rem",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        height: "2.5rem",
                        width: "3rem",
                      }}
                    >
                      {loading ? (
                        <LoadingOutlined color="dodgerblue" />
                      ) : (
                        <UserCog color="chocolate" width={"1rem"} />
                      
                      )}
                    </button>
                  </motion.div>
                )}

                {/* <button
                  style={{
                    fontSize: "0.75rem",
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                  }}
                  onClick={() => setBugDialog(true)}
                >
                  <Bug width={"1rem"} color="lightgreen" />
                </button> */}

                <IndexDropDown
                  onLogout={() => setLogoutPrompt(true)}
                  onProfile={() => navigate("/profile")}
                />
              </div>
            }
          />
          <br />
          {loading ? (
            <div
              style={{
                border: "",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "75svh",
              }}
            >
              <LoadingOutlined style={{ color: "dodgerblue", scale: "2" }} />
            </div>
          ) : (
            <div style={{ display: "flex", flexFlow: "column", gap: "0.5rem" }}>
              <Directive
                to={access ? "/record-list" : ""}
                onClick={Authenticate}
                title={"Role Based Access"}
                icon={<UserSquare color="chocolate" width={"1.25rem"} />}
              />

              <Directive
                to={access ? "/record-list" : ""}
                onClick={() =>
                  userData?.role == "hr"
                    ? usenavigate("/human-resources")
                    : toast.error("No Clearance to Access")
                }
                title={"Exclusive Access"}
                icon={<Crown color="chocolate" width={"1.25rem"} />}
              />

              <Directive
                onClick={() => usenavigate("/quick-links")}
                to={"/quick-links"}
                title={"Normal Directive"}
                icon={<Link color="chocolate" width={"1.25rem"} />}
              />

             

              {/* <Directive onClick={()=>{setRequestDialog(true)}} title="Request Feature" icon={<Plus color="grey" width={"1.1rem"} height={"1.1rem"}/>}/> */}
            </div>
          )}
        </motion.div>

        <DefaultDialog
          title={"Report a Bug"}
          titleIcon={<Bug color="lightgreen" />}
          extra={
            <div
              style={{
                display: "flex",
                width: "100%",
                flexFlow: "column",
                gap: "0.75rem",
                paddingBottom: "0.5rem",
              }}
            >
              <textarea
                onChange={(e) => setIssue(e.target.value)}
                rows={5}
                placeholder="Describe issue"
              />
            </div>
          }
          open={bugDialog}
          onCancel={() => setBugDialog(false)}
          OkButtonText="Report"
          disabled={issue == ""}
          onOk={() => {
            issue != "" ? sendBugReport() : "";
          }}
          updating={loading}
        />

        <DefaultDialog
          titleIcon={<Mail />}
          title="Request Feature"
          extra={
            <p
              style={{
                fontSize: "0.85rem",
                opacity: 0.5,
                marginBottom: "0.5rem",
              }}
            >
              Reach out to the developer to request a new feature? You will be
              redirected to your e-mail client
            </p>
          }
          open={requestDialog}
          OkButtonText="Reach out"
          onCancel={() => setRequestDialog(false)}
          sendmail
        />

        <InputDialog
          title={"Protected Route"}
          input1Type="password"
          desc="Enter key to continue"
          titleIcon={<KeyRound color="chocolate" />}
          open={loginPrompt}
          onCancel={() => setLoginPrompt(false)}
          OkButtonText="Continue"
          inputplaceholder="Password"
          onOk={() => navigate("/records")}
        />

        <InputDialog
          title={"Protected Route"}
          input1Type="password"
          desc="Enter key to continue"
          titleIcon={
            <img
              src="/vale-logo.png"
              width={"28rem"}
              style={{ paddingBottom: "0.25rem", marginRight: "0.25rem" }}
            />
          }
          open={valeLoginPrompt}
          onCancel={() => setValeLoginPrompt(false)}
          OkButtonText="Continue"
          inputplaceholder="Password"
          onOk={() => navigate("/vale-records")}
        />

        <DefaultDialog
          destructive
          title={"Logout"}
          OkButtonText="Logout"
          open={logoutPrompt}
          onCancel={() => setLogoutPrompt(false)}
          onOk={handleLogout}
        />
      </div>
      {/* <ReleaseNote /> */}
    </>
  );
}
