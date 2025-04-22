// bcrypt-test.js
const bcrypt = require('bcrypt');

(async () => {
    const password = "Krish@1";
    const hash = await bcrypt.hash(password, 10);
    console.log("🧪 Generated hash:", hash);

    const isMatch = await bcrypt.compare(password, hash);
    console.log("✅ Does it match?", isMatch);
})();
