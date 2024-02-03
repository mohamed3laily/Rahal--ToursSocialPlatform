const accountSid = "AC0ecec80c7669e4b055f9e0f962b0ce24";
const authToken = "b5308b77b3c3e8b713776cf6648ce62f";
const verifySid = "VA5df1127219a30561585ec7d11deb7275";
const client = require("twilio")(accountSid, authToken);

client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+2001095482308", channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+2001095482308", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
  });
