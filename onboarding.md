index.tsx

Home

- Zion logo
- Button: Subscribe to the waitlist
- Button: I have an invite code
- Button: I have a backup code

Improvements:

Home

- Change to "Enter access key" -- "Enter backup key"

Code

- Change "invitation key" to "access code"
- "Paste the access key or scan the QR code"
- Back button only works if you double tap it
- Throw correct error if invite code has already been used

Welcome

- Who is "Zion Root"? - A message from your friend - get started - WTF does that mean?
- Replace with some good explainer copy -- Welcome to Zion!
- Now you can: Chat with your friends, join your communities, earn Bitcoin

PIN

- "Enter a 6-digit PIN"
- Need to confirm

NickAndKey

- Consolidate nickname and profile pic on the same page
- Set my nickname - what is that? opportunity to describe things on every screen

- Screen muted - overlay 'audio on'
- You're ready to use Zion - You can send messages - spend 1000 sats / receive 10000
- NameAndKey needs explanation
- "Hi" -- nickname --
- ProfilePic -- Why is it a female

Code, // scan or enter code, create ip (from invite server), create auth_token in Relay
Welcome, // create inviter contact (relay) ---- make no sense --
PIN, // set pin
NameAndKey, // set my nickname (and RSA pubkey!) --- needs
SuggestToUserToBackupTheirKeys, // Presents a a video saying to user backup their keys
ProfilePic, // SuggestToUserToBackupTheirKeys
Ready, // set my profile pic

- Later: Consolidate/abstract "invite"/"backup"
