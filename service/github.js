import axios from "axios";

const GithubInstance = axios.create({
  baseURL: "https://api.github.com/users",
  headers: {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
});

export default GithubInstance;
