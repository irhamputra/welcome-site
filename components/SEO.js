import { DefaultSeo } from "next-seo";

const SEO = () => {
  return (
    <DefaultSeo
      title="Muhamad Irham Prasetyo"
      description="Get to know me first by looking this site with Stories"
      twitter={{
        handle: "@IRHMPTRA",
        site: "@IRHMPTRA",
        cardType: "summary_large_image",
      }}
      openGraph={{
        site_name: "Muhamad Irham Prasetyo",
        url: "https://irhamputra.com",
        title: "Irham Putra Prasetyo",
        description:
          "Hi! My name is Irham Putra Prasetyo. Welcome to the my personal website!",
        images: [
          {
            url: "https://irhamputra.com/_next/image?url=%2Fme-computer.svg&w=750&q=75",
            width: 800,
            height: 600,
            alt: "Irham Putra",
          },
        ],
      }}
    />
  );
};

export default SEO;
