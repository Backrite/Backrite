import dns from "node:dns/promises";

try {
  const result = await dns.resolveSrv(
    "_mongodb._tcp.backrite-cluster.jeqhsfp.mongodb.net"
  );
  console.log(result);
} catch (err) {
  console.error(err);
}