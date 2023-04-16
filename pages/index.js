import GithubInstance from "../service/github";
import { Button, Card } from "flowbite-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { format, parseISO } from "date-fns";
import Chip from "../components/chip";
import Star from "../components/star";

export default function Home({ repos }) {
  const [page, setPage] = useState(1);
  const router = useRouter();

  return (
    <section className="pb-2 w-fit">
      <h3 className="text-xl font-bold mb-2">Repositories</h3>
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 gap-4">
        {repos.map((item) => (
          <Card key={item.id} className="cursor-pointer">
            <a href={item.html_url} target="_blank">
              <p className="font-bold text-xl">{item.name}</p>
              <Star count={item.stargazers_count} />

              <small>
                Update: {format(parseISO(item.updated_at), "MMMM do, yyyy")}
              </small>

              <div className="my-4">
                <p>{item.description}</p>
              </div>

              {item.language ? <Chip text={item.language} /> : <div />}
            </a>
          </Card>
        ))}
      </div>

      <div className="flex mt-4 mb-8 justify-between">
        <Button
          onClick={async () => {
            setPage((prevState) => prevState - 1);

            await router.push({
              pathname: "/",
              query: { page: page - 1 },
            });
          }}
        >
          Prev
        </Button>
        <Button
          onClick={async () => {
            setPage((prevState) => prevState + 1);

            await router.push({
              pathname: "/",
              query: { page: page + 1 },
            });
          }}
        >
          Next
        </Button>
      </div>
    </section>
  );
}

export const getServerSideProps = async (ctx) => {
  try {
    const { data: user } = await GithubInstance.get("/irhamputra");
    const { data: repos } = await GithubInstance.get(
      `/irhamputra/repos?page=${ctx.query.page}`
    );
    return {
      props: {
        user,
        repos: repos.sort(function (a, b) {
          return b.updated_at < a.updated_at
            ? -1
            : b.updated_at > a.updated_at
            ? 1
            : 0;
        }),
      },
    };
  } catch (e) {
    return {
      props: {
        user: {},
        repos: [],
      },
    };
  }
};
