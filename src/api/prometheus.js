export const getUsers = async () => {
  const res = await fetch("https://api.cloud.cbh.kth.se/deploy/v1/metrics", {
    method: "GET",
  });

  const raw = await res.text();
  let users = 0;
  raw.split("\n").forEach((line) => {
    if (line.startsWith("go_deploy_users_total")) {
      users = line.split(" ")[1].trim();
    }
  });

  return users;
};
